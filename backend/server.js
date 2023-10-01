const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cors = require("cors");
const dotenv = require("dotenv");
const mockDb = require("./utils/mock-db");
const route = require("./route");
const bodyParser = require("body-parser");

const Nylas = require("nylas");
const { WebhookTriggers } = require("nylas/lib/models/webhook");
const { openWebhookTunnel } = require("nylas/lib/services/tunnel");
const { Scope } = require("nylas/lib/models/connect");
const { OpenAI } = require("openai");
dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

// The port the express app will run on
const port = 9000;

// Initialize the Nylas SDK using the client credentials
Nylas.config({
  clientId: process.env.NYLAS_CLIENT_ID,
  clientSecret: process.env.NYLAS_CLIENT_SECRET,
  apiServer: process.env.NYLAS_API_SERVER,
});

// Initialize the Open AI SDK using the client credentials
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Before we start our backend, we should register our frontend as a
// redirect URI to ensure the auth completes
const CLIENT_URI =
  process.env.CLIENT_URI || `http://localhost:${process.env.PORT || 3000}`;
Nylas.application({
  redirectUris: [CLIENT_URI],
}).then((applicationDetails) => {
  console.log(
    "Application registered. Application Details: ",
    JSON.stringify(applicationDetails)
  );
});

// Start the Nylas webhook
openWebhookTunnel({
  // Handle when a new message is created (sent)
  onMessage: function handleEvent(delta) {
    switch (delta.type) {
      case WebhookTriggers.EventCreated:
        console.log(
          "Webhook trigger received, event created. Details: ",
          JSON.stringify(delta.objectData, undefined, 2)
        );
        break;
    }
  },
}).then((webhookDetails) => {
  console.log("Webhook tunnel registered. Webhook ID: " + webhookDetails.id);
});

// '/nylas/generate-auth-url': This route builds the URL for
// authenticating users to your Nylas application via Hosted Authentication
app.post("/nylas/generate-auth-url", express.json(), async (req, res) => {
  const { body } = req;

  const authUrl = Nylas.urlForAuthentication({
    loginHint: body.email_address,
    redirectURI: (CLIENT_URI || "") + body.success_url,
    scopes: [Scope.Calendar, Scope.Email],
  });

  return res.send(authUrl);
});

// '/nylas/exchange-mailbox-token': This route exchanges an authorization
// code for an access token
// and sends the details of the authenticated user to the client
app.post("/nylas/exchange-mailbox-token", express.json(), async (req, res) => {
  const body = req.body;

  const { accessToken, emailAddress } = await Nylas.exchangeCodeForToken(
    body.token
  );

  // Normally store the access token in the DB

  const adminUser = await prisma.user.findUnique({
    where: {
      // id: parseInt(user.id),
      email: emailAddress,
    },
  });

  // res.json(adminUser);

  const updateAdmin = async (adminId, emailAddress, accessToken) => {
    const updAdmin = await prisma.user.update({
      where: {
        // id: parseInt(adminUser.id),
        id: parseInt(adminId),
      },
      data: {
        name: "",
        email: emailAddress,
        accessToken: accessToken,
      },
    });

    return updAdmin;
  };

  const createAdmin = async (emailAddress, accessToken) => {
    const newAdmin = await prisma.user.create({
      data: {
        name: "",
        email: emailAddress,
        accessToken: accessToken,
        medicalCounselorName: "",
        medicalCounselorEmail: "",
      },
    });

    return newAdmin;
  };

  const adminUserData = adminUser
    ? await updateAdmin(adminUser.id, emailAddress, accessToken)
    : await createAdmin(emailAddress, accessToken);

  // Return an authorization object to the user
  return res.json({
    id: adminUserData.id,
    emailAddress: adminUserData.email,
  });
});

// Middleware to check if the user is authenticated
async function isAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json("Unauthorized");
  }

  const adminData = await prisma.user.findUnique({
    where: {
      id: parseInt(req.headers.authorization),
    },
  });

  if (!adminData) {
    return res.status(401).json("Unauthorized");
  }

  // Add the user to the response locals
  res.locals.user = adminData;

  next();
}

// Add route for getting 20 latest calendar events
app.get("/nylas/read-events", isAuthenticated, (req, res) =>
  route.readEvents(req, res)
);

// Add route for getting 20 latest calendar events
app.get("/nylas/read-calendars", isAuthenticated, (req, res) =>
  route.readCalendars(req, res)
);

// Add route for creating calendar events
app.post("/nylas/create-events", isAuthenticated, express.json(), (req, res) =>
  route.createEvents(req, res)
);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// send email notification to the medical counselor
app.post("/send/email-notification", isAuthenticated, (req, res) => {
  route.emailNotification(req, res, prisma, openai);
});

app.get("/get/admin-data", async (req, res) => {
  const adminData = await prisma.user.findMany();

  res.json(adminData);
});

app.post("/add/admin-data", async (req, res) => {
  const { id, medicalCounselorName, medicalCounselorEmail } = req.body;

  const admin = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      medicalCounselorName,
      medicalCounselorEmail,
    },
  });

  res.json(admin);
});

app.put("/enable/student-form", async (req, res) => {
  const { id, studentFormToggle } = req.body;

  const admin = await prisma.user.update({
    where: { id },
    data: { studentFormToggle },
  });

  res.json(admin);
});

app.put("/delete/admin-data/:id", async (req, res) => {
  const { id } = req.params;
  const admin = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      medicalCounselorName: "",
      medicalCounselorEmail: "",
    },
  });

  res.json(admin);
});

app.post("/add/student-input", async (req, res) => {
  const {
    studentId,
    name,
    email,
    disability,
    programme,
    courseType,
    dob,
    gender,
    contact,
    guardian,
    guardianContact,
    guardianEmail,
    other,
    otherDetails,
  } = req.body;

  const admin = await prisma.studentForm.create({
    data: {
      studentId,
      name,
      email,
      disability,
      programme,
      courseType,
      dob,
      gender,
      contact,
      guardian,
      guardianContact,
      guardianEmail,
      other,
      otherDetails,
    },
  });

  // To find the free busy time
  // console.log("Checking for free busy time");
  // const user = await prisma.user.findMany();
  // route.freeBusy(req, res, user[0]);

  res.json(admin);
});

app.get("/get/student-input", async (req, res) => {
  const studentInputs = await prisma.studentForm.findMany();
  res.json(studentInputs);
});

// Start listening on port 9000
app.listen(port, () => console.log("App listening on port " + port));

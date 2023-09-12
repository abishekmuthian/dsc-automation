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
    scopes: [Scope.Calendar],
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
  console.log("Access Token was generated for: " + emailAddress);

  // Replace this mock code with your actual database operations - uncomment or delete the below 4 lines
  // const user = await mockDb.createOrUpdateUser(emailAddress, {
  //   accessToken,
  //   emailAddress,
  // });

  // replace mockdb for create/update
  // app.get("/get/admin-data", async (req, res) => {
  //   const adminData = await prisma.user.findMany();
  //   console.log("admin data from  server: ", adminData);
  //   res.json(adminData);
  // });
  // console.log("replace - input user.id: ", user.id);
  const adminUser = await prisma.user.findUnique({
    where: {
      // id: parseInt(user.id),
      email: emailAddress,
    },
  });
  console.log("replace - create or update adminUser FIND: ", adminUser);
  // res.json(adminUser);

  const updateAdmin = async (adminId, emailAddress, accessToken) => {
    const updAdmin = await prisma.user.update({
      where: {
        id: parseInt(adminUser.id),
      },
      data: {
        name: "",
        email: emailAddress,
        accessToken: accessToken,
      },
    });
    console.log("replace - adminUser updated with userToken: ", updAdmin);
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
    console.log("replace - adminUser created", newAdmin);
    return newAdmin;
  };

  const adminUserData = adminUser
    ? await updateAdmin(adminUser.id, emailAddress, accessToken)
    : await createAdmin(emailAddress, accessToken);

  console.log("replace - adminUserData: ", adminUserData);
  // if (adminUser) {
  //   const updAdmin = await prisma.user.update({
  //     where: {
  //       id: parseInt(adminUser.id),
  //     },
  //     data: {
  //       name: "",
  //       email: emailAddress,
  //       accessToken: accessToken,
  //     },
  //   });
  //   console.log("replace - adminUser updated with userToken: ", updAdmin);
  //   // res.json(admin);
  // } else {
  //   const updAdmin = await prisma.user.create({
  //     data: {
  //       name: "",
  //       email: emailAddress,
  //       accessToken: accessToken,
  //     },
  //   });
  //   console.log("replace - adminUser created", updAdmin);
  //   // res.json(admin);
  // }
  // replace mockdb for create/update

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

  // Query our mock db to retrieve the stored user access token
  // console.log("request for auth check:::::: ", req);
  // console.log("request for auth check:::::: ", req.headers);
  // console.log("mockdb - hd-auth: ", req.headers.authorization);
  // console.log("id");
  // const user = await mockDb.findUser(req.headers.authorization);
  // console.log("mockdb - user: ", user);
  // replacing mockDB

  const adminData = await prisma.user.findUnique({
    where: {
      id: parseInt(req.headers.authorization),
    },
  });
  console.log("replace - get admin to check auth: ", adminData);
  // res.json(adminData);

  //replacing mockDB

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

// get stored user data from sqlite db using prims
app.get("/get/admin-data", async (req, res) => {
  const adminData = await prisma.user.findMany();
  console.log("admin data from  server: ", adminData);
  res.json(adminData);
});

app.post("/add/admin-data", async (req, res) => {
  const { id, medicalCounselorName, medicalCounselorEmail } = req.body;
  console.log("backend id: ", id);
  console.log("backend name", medicalCounselorName);
  console.log("backend email", medicalCounselorEmail);

  const admin = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      medicalCounselorName,
      medicalCounselorEmail,
    },
  });
  console.log("Medical counselor details added/updated");
  res.json(admin);
});

app.put("/enable/student-form", async (req, res) => {
  const { id, studentFormToggle } = req.body;
  console.log("put-req id: ", id);
  console.log("put-req toggle: ", studentFormToggle);
  const admin = await prisma.user.update({
    where: { id },
    data: { studentFormToggle },
  });
  console.log("admin after updating medical counselor details: ", admin);
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
  console.log("user deleted after DEL request: ", admin);
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
    other,
    otherDetails,
    crossSchool,
    mandatory,
  } = req.body;
  console.log("backend name", studentId);
  console.log("backend email", name);
  console.log("backend email", email);
  console.log("backend disability", disability);
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
      other,
      otherDetails,
      crossSchool,
      mandatory,
    },
  });
  console.log("admin created");

  console.log("Checking for free busy time");
  const user = await prisma.user.findMany();
  route.freeBusy(req, res, user[0]);
  res.json(admin);
});

app.get("/get/student-input", async (req, res) => {
  const studentInputs = await prisma.studentForm.findMany();
  console.log("fetched student input data: ", studentInputs);
  res.json(studentInputs);
});

// Fetch the inclusive pedagogy from open AI for the disease mentioned by the student in the form
async function getInclusivePedagogy(disability) {
  if (disability.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid disability",
      },
    });
    return;
  }

  try {
    const completion = await openai.completions.create({
      model: "text-davinci-003",
      prompt: "Inclusive pedagogy for " + disability,
      temperature: 0.6,
      max_tokens: 30,
    });
    return completion.data.choices[0].text;
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

// Send the email to the medical counselor and the student
async function sendEmail(subject, recipients, body) {
  try {
    const message = await Nylas.messages.send({
      subject: "Hello from Nylas",
      to: [{ name: "Recipient Name", email: "recipient@example.com" }],
      body: "This is the email content.",
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Start listening on port 9000
app.listen(port, () => console.log("App listening on port " + port));

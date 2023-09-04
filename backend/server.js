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

  // Replace this mock code with your actual database operations
  const user = await mockDb.createOrUpdateUser(emailAddress, {
    accessToken,
    emailAddress,
  });

  // Return an authorization object to the user
  return res.json({
    id: user.id,
    emailAddress: user.emailAddress,
  });
});

// Middleware to check if the user is authenticated
async function isAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json("Unauthorized");
  }

  // Query our mock db to retrieve the stored user access token
  const user = await mockDb.findUser(req.headers.authorization);

  if (!user) {
    return res.status(401).json("Unauthorized");
  }

  // Add the user to the response locals
  res.locals.user = user;

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
  // res.send("Request received for Admin data");
  const adminData = await prisma.user.findMany();
  console.log("admin data from  server: ", adminData);
  res.json(adminData);
});

app.post("/add/admin-data", async (req, res) => {
  const { name, email, accessToken } = req.body;
  console.log("backend name", name);
  console.log("backend email", email);
  console.log("backend accessToken", accessToken);
  const admin = await prisma.user.create({
    data: {
      name,
      email,
      accessToken,
    },
  });
  console.log("admin created");
  res.json(admin);
});

app.put("/enable/student-form", async (req, res) => {
  console.log("put request");
  const { id, name, email, accessToken, studentFormToggle } = req.body;
  console.log("put-req id: ", id);
  console.log("put-req toggle: ", studentFormToggle);
  const admin = await prisma.user.update({
    where: { id },
    data: { studentFormToggle },
  });
  console.log("admin after PUT request: ", admin);
  res.json(admin);
});

app.delete("/delete/admin-data/:id", async (req, res) => {
  const { id } = req.params;
  const admin = await prisma.user.delete({
    where: {
      id: parseInt(id),
    },
  });
  console.log("user deleted after DEL request: ", admin);
  res.json(admin);
});
app.post("/add/student-input", async (req, res) => {
  const { studentId, name, email, disability } = req.body;
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
    },
  });
  console.log("admin created");
  res.json(admin);
});
app.get("/get/student-input", async (req, res) => {
  const studentInputs = await prisma.studentForm.findMany();
  console.log("fetched student input data: ", studentInputs);
  res.json(studentInputs);
});
// Start listening on port 9000
app.listen(port, () => console.log("App listening on port " + port));

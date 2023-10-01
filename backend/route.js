const { default: Event } = require("nylas/lib/models/event");
const Nylas = require("nylas");
const {
  default: EmailParticipant,
} = require("nylas/lib/models/email-participant");
const { default: Draft } = require("nylas/lib/models/draft");

exports.readEvents = async (req, res) => {
  const user = res.locals.user;

  const { calendarId, startsAfter, endsBefore, limit } = req.query;

  const events = await Nylas.with(user.accessToken)
    .events.list({
      calendar_id: calendarId,
      starts_after: startsAfter,
      ends_before: endsBefore,
      limit: limit,
    })
    .then((events) => events);

  return res.json(events);
};

exports.readCalendars = async (req, res) => {
  const user = res.locals.user;

  const calendars = await Nylas.with(user.accessToken)
    .calendars.list()
    .then((calendars) => calendars);

  return res.json(calendars);
};

exports.freeBusy = async (req, res, user) => {
  const nylas = Nylas.with(user.accessToken);

  // Search for free-busy time slots over the next 24 hours.
  // Replace with user set starttime, end time depending upon the working days
  const startTime = Math.floor(Date.now() / 1000); // current unix timestamp in seconds
  const endTime = startTime + 60 * 60 * 24; // add 24 hours in seconds

  // To check free-busy with calendars:
  const freeBusy = await nylas.calendars.freeBusy({
    startTime: startTime,
    endTime: endTime,
    emails: [user.email], //Use admin email id here
  });

  // console.log("Calendar free time: ", freeBusy);
};

exports.emailNotification = async (req, res, prisma, openai) => {
  const user = res.locals.user;

  const nylas = Nylas.with(user.accessToken);

  const { participants } = req.body;

  // Find the student's disability

  student = await prisma.studentForm.findUnique({
    where: {
      // id: parseInt(user.id),
      email: participants.studentEmail,
    },
  });

  studentDisabilities = student.disability.split(",");

  emailBody =
    "<h3>" +
    student.name +
    " is living with " +
    studentDisabilities.toString() +
    "." +
    "</h3>";
  emailBody = emailBody + "<br>" + "<br>";

  inclusivePedagogyResults = [];

  // inclusivePedagogy =   studentDisabilities.forEach(async function(value, item, index){
  //  await getInclusivePedagogy(value, item, index, inclusivePedagogy, openai);
  // });

  await Promise.all(
    studentDisabilities.map(async (disability) => {
      inclusivePedagogy = await getInclusivePedagogy(
        disability,
        inclusivePedagogyResults,
        openai
      );
    })
  );

  // console.log(
  //   "Inclusive Pedagogy results",
  //   inclusivePedagogyResults.toString()
  // );

  emailBody = emailBody + inclusivePedagogyResults.join("<br><br>");

  sendEmail(
    "Inclusive pedagogy for " + participants.studentName,
    { name: participants.mcName, email: participants.mcEmail },
    emailBody,
    nylas
  );

  res.json({
    message: "success",
  });
};

exports.createEvents = async (req, res) => {
  const user = res.locals.user;

  const { calendarId, title, description, startTime, endTime, participants } =
    req.body;

  if (!calendarId || !title || !startTime || !endTime) {
    return res.status(400).json({
      message:
        "Missing required fields: calendarId, title, starTime or endTime",
    });
  }

  const nylas = Nylas.with(user.accessToken);

  const event = new Event(nylas);

  event.calendarId = calendarId;
  event.title = title;
  event.description = description;
  event.when.startTime = startTime;
  event.when.endTime = endTime;

  if (participants) {
    event.participants = participants
      .split(/\s*,\s*/)
      .map((email) => ({ email }));
  }

  event.save();

  return res.json(event);
};

// Fetch the inclusive pedagogy from open AI for the disease mentioned by the student in the form
async function getInclusivePedagogy(
  disability,
  inclusivePedagogyResults,
  openai
) {
  if (disability.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid disability",
      },
    });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant advising inclusive pedagogy for different disabilities.",
        },
        { role: "user", content: disability },
      ],
      temperature: 0.6,
      max_tokens: 600,
    });

    suggestion = completion.choices[0].message.content;

    inclusivePedagogyResults.push(formatMessage(suggestion));
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
async function sendEmail(subject, recipient, body, nylas) {
  try {
    // Create a new draft object
    const draft = new Draft(nylas, {
      to: [{ name: recipient.name, email: recipient.email }],
      subject: subject,
      body: body,
    });
    // Save the draft to send it to Nylas
    draft.save();

    draft.send();
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

function formatMessage(text) {
  // Make the text between numbering and colon bold
  // Insert <br><br> before the numbering

  return text.replace(/(\d+\.\s)(.*?):/g, "<br><br>$1<b><i>$2</i></b>:");
}

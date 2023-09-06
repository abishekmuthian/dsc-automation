const { default: Event } = require("nylas/lib/models/event");
const Nylas = require("nylas");

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

  console.log("Calendar free time: ", freeBusy);
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

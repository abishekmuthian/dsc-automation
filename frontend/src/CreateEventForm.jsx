import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  applyTimezone,
  convertUTCDate,
  getDefaultEventStartTime,
  getDefaultEventEndTime,
  getMinimumEventEndTime,
} from "./utils/date";

function CreateEventForm({
  userId,
  calendarId,
  serverBaseUrl,
  setShowCreateEventForm,
  setToastNotification,
  refresh,
  studentName = "",
  studentEmail = "",
  mcEmail = "",
}) {
  const [startTime, setStartTime] = useState(getDefaultEventStartTime());
  const [endTime, setEndTime] = useState(getDefaultEventEndTime());
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState(
    sessionStorage.getItem("userEmail") || ""
  );

  const [description, setDescription] = useState("");
  useEffect(() => {
    if (studentName) {
      const newTitle = `Medical Counselor appointment with ${studentName}`;
      setTitle(newTitle);
    }
    if (studentEmail && mcEmail) {
      setParticipants(studentEmail + "," + mcEmail);
    }
  }, [studentName]);

  const now = new Date();

  const createEvent = async (e) => {
    e.preventDefault();
    console.log("calendar id: ", calendarId);
    console.log("participants: ", participants);
    console.log("title: ", title);
    console.log("description: ", description);
    try {
      const url = serverBaseUrl + "/nylas/create-events";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: userId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startTime: applyTimezone(startTime),
          endTime: applyTimezone(endTime),
          title,
          description,
          calendarId,
          participants,
        }),
      });
      console.log("res : ", res);
      if (!res.ok) {
        console.log("error while creating event", res);
        setToastNotification("error");
        throw new Error(res.statusText);
      }

      const data = await res.json();

      console.log("Event created:", data);

      // reset form fields
      setStartTime(convertUTCDate(new Date()));
      setEndTime(convertUTCDate(new Date()));
      setTitle("");
      setDescription("");
      console.log("before event from set");
      setShowCreateEventForm(false);
      setToastNotification("success");
      console.log("after event from set");
      refresh();
    } catch (err) {
      console.warn(`Error creating event:`, err);
    }
  };

  return (
    <div className="create-event-view">
      <div className="header">
        <div className="title">Create event</div>
        <div className="button-container">
          <button
            type="button"
            className="outline"
            onClick={() => setShowCreateEventForm(false)}
          >
            Cancel
          </button>
          <button className="blue" type="submit" form="event-form">
            Create
          </button>
        </div>
      </div>
      <form id="event-form" className="scrollbar" onSubmit={createEvent}>
        <div className="row">
          <div className="field-container">
            <label htmlFor="event-title">Event title</label>
            <input
              type="text"
              name="event-title"
              placeholder="Discuss calendar APIs"
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              value={title}
            />
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="event-start-time">Start time</label>
            <input
              type="datetime-local"
              name="event-start-time"
              onChange={(event) => {
                setStartTime(event.target.value);
              }}
              value={startTime}
              min={convertUTCDate(now)}
            />
          </div>
          <div className="field-container">
            <label htmlFor="event-end-time">End time</label>
            <input
              type="datetime-local"
              name="event-end-time"
              onChange={(event) => {
                setEndTime(event.target.value);
              }}
              value={endTime}
              min={convertUTCDate(getMinimumEventEndTime(startTime))}
            />
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="participants">Participants</label>
            <textarea
              type="text"
              name="participants"
              placeholder="Enter email addresses"
              onChange={(event) => {
                setParticipants(event.target.value);
              }}
              spellCheck={false}
              value={participants}
              rows={1}
            />
            <p className="note">Separate by comma for multiple participants</p>
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              name="description"
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              placeholder="Enter event description"
              value={description}
              rows={3}
              width="100%"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

CreateEventForm.propTypes = {
  userId: PropTypes.string.isRequired,
  calendarId: PropTypes.string,
  serverBaseUrl: PropTypes.string.isRequired,
  setShowCreateEventForm: PropTypes.func,
  toastNotification: PropTypes.string,
  setToastNotification: PropTypes.func,
  refresh: PropTypes.func,
};

export default CreateEventForm;

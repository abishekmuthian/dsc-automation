import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import CalendarIllustration from "./components/icons/illustration-calendar.svg";
import IconExternalLink from "./components/icons/IconExternalLink.jsx";
import {
  displayMeetingTime,
  getFormattedDate,
  getTimezoneCode,
} from "./utils/date";
import {
  isValidUrl,
  getOrganizerString,
  getParticipantsString,
  cleanDescription,
  dividerBullet,
  initializeScrollShadow,
  handleScrollShadows,
  capitalizeString,
} from "./utils/calendar";

function EventDetail({ selectedEvent, mcName, mcEmail }) {
  const [showTopScrollShadow, setShowTopScrollShadow] = useState(false);
  const [showBottomScrollShadow, setShowBottomScrollShadow] = useState(false);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [hover, setHover] = useState(false);

  useEffect(() => {
    initializeScrollShadow(".description-container", setShowBottomScrollShadow);
  }, [selectedEvent]);

  useEffect(() => {
    window.addEventListener("resize", () =>
      initializeScrollShadow(
        ".description-container",
        setShowBottomScrollShadow
      )
    );

    return () => {
      window.removeEventListener("resize", () =>
        initializeScrollShadow(
          ".description-container",
          setShowBottomScrollShadow
        )
      );
    };
  }, []);

  useEffect(() => {
    const userIdString = sessionStorage.getItem("userId");
    const userEmail = sessionStorage.getItem("userEmail");
    if (userIdString) {
      setUserId(userIdString);
    }
    if (userEmail) {
      setUserEmail(userEmail);
    }
    if (userIdString) {
      setUserId(userIdString);
    }
  }, []);

  const handleMouseHover = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  const handleNotify = (event) => {
    let participants = [];
    for (let i = 0; i < event.participants.length; i++) {
      participants.push(event.participants[i]["email"]);
    }

    let studentEmail = event.title.split("|")[2].trim();
    let studentName = event.title.split("|")[1].trim();

    const url = serverBaseUrl + "/send/email-notification";
    axios
      .post(
        url,
        {
          participants: {
            mcEmail,
            mcName,
            studentEmail,
            studentName,
          },
        },
        {
          headers: {
            Authorization: userId,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("notified");
      });
  };

  const serverBaseUrl =
    import.meta.env.VITE_SERVER_URI || "http://localhost:9000";

  const renderConferencingDetails = (details) => {
    const passwordDetails = {
      ...(details.password && { password: details.password }),
      ...(details.pin && { pin: details.pin }),
    };

    const renderPasswordDetails = () => {
      return (
        <p>
          {Object.keys(passwordDetails)
            .map((detailKey) => (
              <span key={detailKey}>
                {capitalizeString(detailKey)}: {passwordDetails[detailKey]}
              </span>
            ))
            .reduce((acc, cur) => {
              return acc === null ? [cur] : [...acc, dividerBullet, cur];
            }, null)}
        </p>
      );
    };

    const getMeetingCode = () => details.meeting_code.replace(/\s/g, "");

    const getDialOptionsString = details.phone?.map((phoneNumber) => (
      <div key={phoneNumber}>
        {phoneNumber}
        {details.meeting_code ? `, ${getMeetingCode()}#` : ""}
      </div>
    ));

    return (
      <div className="conferencing-details">
        <p className="title">Conference Details</p>
        {details.url && (
          <p className="meeting-link">
            URL:
            <span>
              <a href={details.url} className="external-link">
                <span>Link</span>
                <IconExternalLink />
              </a>
            </span>
          </p>
        )}
        {Object.keys(passwordDetails).length ? renderPasswordDetails() : null}
        {details.phone && (
          <div className="dial-in">
            <div>Dial-In Options:</div>
            <div>{getDialOptionsString}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="event-detail-view">
      {selectedEvent ? (
        <div className="selected">
          <div className="details">
            <div className="event-detail">
              <span className="title truncate">{`${
                selectedEvent.title.split(":")[0]
              }`}</span>
            </div>
            <div className="event-detail">
              <span>{getFormattedDate(selectedEvent)}</span>
              {dividerBullet}
              <span>
                {selectedEvent.when.object === "date"
                  ? "all day"
                  : displayMeetingTime(selectedEvent.when)}
                {` (${getTimezoneCode()})`}
              </span>
              {!isValidUrl(selectedEvent.location) && (
                <>
                  {dividerBullet}
                  <span className="location truncate">
                    {selectedEvent.location}
                  </span>
                </>
              )}
            </div>

            <div className="event-detail">
              <p className="truncate">
                {/* Organized by {getOrganizerString(selectedEvent)} */}
                Participants:{" "}
                {selectedEvent.participants.map((p) => (
                  <p>{p.email}</p>
                ))}
              </p>
            </div>
            {/* <div className="event-detail">
              {getParticipantsString(selectedEvent)}
            </div> */}
          </div>
          <div
            className="description-container scrollbar"
            onScroll={(event) =>
              handleScrollShadows(
                event,
                setShowTopScrollShadow,
                setShowBottomScrollShadow
              )
            }
          >
            <div
              className={`scroll-shadow top${
                showTopScrollShadow ? "" : " hidden"
              }`}
            ></div>
            {selectedEvent.conferencing &&
              renderConferencingDetails(selectedEvent.conferencing.details)}
            <p className="title">Description</p>

            <p
              dangerouslySetInnerHTML={{
                __html: cleanDescription(selectedEvent.description),
              }}
            ></p>
            <button
              onClick={() => handleNotify(selectedEvent)}
              onMouseEnter={handleMouseHover}
              onMouseLeave={handleMouseLeave}
            >
              Notify Counselor
            </button>
            <div
              className={`scroll-shadow bottom${
                showBottomScrollShadow ? "" : " hidden"
              }`}
            ></div>
          </div>
        </div>
      ) : (
        <div className="empty-event">
          <img
            src={CalendarIllustration}
            alt="Calendar illustration"
            width="72"
          />
          <p>Select an event to view the event details</p>
        </div>
      )}
    </div>
  );
}

EventDetail.propTypes = {
  selectedEvent: PropTypes.object,
};

export default EventDetail;

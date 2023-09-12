import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import EventList from "./EventList";
import EventDetail from "./EventDetail";
import Toast from "./components/Toast";
import CreateEventForm from "./CreateEventForm";
import "./styles/calendar.scss";

function CalendarApp({
  userId,
  calendarId,
  serverBaseUrl,
  isLoading,
  setIsLoading,
  events,
  refresh,
  studentName = "",
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [toastNotification, setToastNotification] = useState("");
  // console.log("studentName: ", studentName);
  // console.log(typeof userId, userId);
  // console.log("form flag1: ", showCreateEventForm);
  useEffect(() => {
    if (studentName) {
      // console.log("student event shoud create now: ", studentName);
      setShowCreateEventForm(true);
    }
  }, []);
  // console.log("form flag2: ", showCreateEventForm);

  return (
    <>
      <Toast
        toastNotification={toastNotification}
        setToastNotification={setToastNotification}
      />

      <div className="calendar-app">
        <>
          <div className="event-list-view">
            <section className="event-header">
              <p className="title">Upcoming events</p>
              <p
                className={`create-event${showCreateEventForm ? " hide" : ""}`}
                onClick={() => setShowCreateEventForm(true)}
              >
                Create event
              </p>
            </section>
            <EventList
              events={events}
              userId={userId}
              setSelectedEvent={setSelectedEvent}
              selectedEvent={selectedEvent}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
          </div>
          {showCreateEventForm ? (
            <CreateEventForm
              userId={userId}
              calendarId={calendarId}
              serverBaseUrl={serverBaseUrl}
              setShowCreateEventForm={setShowCreateEventForm}
              toastNotification={toastNotification}
              setToastNotification={setToastNotification}
              refresh={refresh}
              studentName={studentName}
            />
          ) : (
            <EventDetail selectedEvent={selectedEvent} />
          )}
        </>
      </div>
      <div className="mobile-warning hidden-desktop">
        <h2>
          Calendar sample app is currently designed for a desktop experience.
        </h2>
        <p>
          Visit Nylas dashboard for more use-cases: https://dashboard.nylas.com
        </p>
      </div>
    </>
  );
}

CalendarApp.propTypes = {
  userId: PropTypes.string.isRequired,
  calendarId: PropTypes.string,
  serverBaseUrl: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  events: PropTypes.array.isRequired,
  refresh: PropTypes.func,
};

export default CalendarApp;

// return (
//   <>
//     <Toast
//       toastNotification={toastNotification}
//       setToastNotification={setToastNotification}
//     />
//     <div className="calendar-app">
//       <>
//         <div className="event-list-view">
//           <section className="event-header">
//             <p className="title">Upcoming events</p>
//           </section>
//           <EventList
//             events={events}
//             userId={userId}
//             setSelectedEvent={setSelectedEvent}
//             selectedEvent={selectedEvent}
//             setIsLoading={setIsLoading}
//             isLoading={isLoading}
//           />
//         </div>

//         <CreateEventForm
//           userId={userId}
//           calendarId={calendarId}
//           serverBaseUrl={serverBaseUrl}
//           setShowCreateEventForm={setShowCreateEventForm}
//           toastNotification={toastNotification}
//           setToastNotification={setToastNotification}
//           refresh={refresh}
//           studentName={studentName}
//         />
//       </>
//     </div>
//   </>
// );

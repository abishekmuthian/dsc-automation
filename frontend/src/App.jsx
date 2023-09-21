import React, { useState, useEffect } from "react";
import { useNylas } from "@nylas/nylas-react";
import CalendarApp from "./CalendarApp";
import NylasLogin from "./NylasLogin";
import Layout from "./components/Layout";
import axios from "axios";

import {
  getSevenDaysFromTodayDateTimestamp,
  getTodaysDateTimestamp,
} from "./utils/date";
import AdminForm from "./components/AdminPage/AdminForm";
import AdminPage from "./components/AdminPage/AdminPage";
import StudentForm from "./components/StudentForm/StudentForm";

function App() {
  const nylas = useNylas();
  const [primaryCalendar, setPrimaryCalendar] = useState(null);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);

  const [admin, setAdmin] = useState({});
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [enableAdmin, setEnableAdmin] = useState(true);

  useEffect(() => {
    const url = serverBaseUrl + "/get/admin-data";
    fetchAdmin(url);
  }, [userId]);

  const handleShowStudentForm = (show) => {
    setShowStudentForm(show);
  };
  function fetchAdmin(url) {
    axios.get(url).then((res) => {
      if (res.data.length > 0) {
        setAdmin(res.data[0]);
        console.log("setting admin state: ", res.data[0]);
        if (res.data[0].studentFormToggle) {
          setShowStudentForm(true);
        }
      } else {
        setAdmin({});
        setShowStudentForm(false);
      }
    });
  }
  const enableCalendar = () => {
    setEnableAdmin(!enableAdmin);
  };
  const onDeleteAdmin = (admin) => {
    const url = serverBaseUrl + `/delete/admin-data/${admin.id}`;
    axios.put(url, { admin }).then((response) => {
      setAdmin(response.data);
      setShowStudentForm(false);
    });
  };
  const handleAdminSave = (adminObject) => {
    const url = serverBaseUrl + "/add/admin-data";
    axios
      .post(url, {
        ...admin,
        medicalCounselorName: adminObject.medicalCounselorName,
        medicalCounselorEmail: adminObject.medicalCounselorEmail,
      })
      .then((response) => {
        setAdmin(response.data);
      });
  };

  const handleStudentToggle = (updatedAdminObject) => {
    const url = serverBaseUrl + "/enable/student-form";
    axios.put(url, updatedAdminObject).then((response) => {
      setAdmin(updatedAdminObject);
    });
  };
  const serverBaseUrl =
    import.meta.env.VITE_SERVER_URI || "http://localhost:9000";

  useEffect(() => {
    if (!nylas) {
      return;
    }

    // Handle the code that is passed in the query params from Nylas after a successful login
    const params = new URLSearchParams(window.location.search);
    if (params.has("code")) {
      nylas
        .exchangeCodeFromUrlForToken()
        .then((user) => {
          const { id } = JSON.parse(user);
          setUserId(id);
          sessionStorage.setItem("userId", id);
        })
        .catch((error) => {
          console.error("An error occurred parsing the response:", error);
        });
    }
  }, [nylas]);

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

  useEffect(() => {
    if (userId?.length) {
      window.history.replaceState({}, "", `/?userId=${userId}`);
      getPrimaryCalendarEvents();
    } else {
      window.history.replaceState({}, "", "/");
    }
  }, [userId]);

  const getPrimaryCalendar = async () => {
    try {
      const url = serverBaseUrl + "/nylas/read-calendars";
      // console.log("user id before getting primary: ", userId, typeof userId);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: userId,
          "Content-Type": "application/json",
        },
      });
      // console.log("fetch calendar res: ", res);
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const data = await res.json();

      let [calendar] = data.filter((calendar) => calendar.is_primary);
      // if no primary calendar, use the first one
      if (!calendar && data.length) {
        calendar = data[0];
      }

      setPrimaryCalendar(calendar);
      return calendar;
    } catch (err) {
      console.warn(`Error reading calendars:`, err);
    }
  };

  const getCalendarEvents = async (calendarId) => {
    if (calendarId) {
      try {
        const startsAfter = getTodaysDateTimestamp(); // today
        const endsBefore = getSevenDaysFromTodayDateTimestamp(); // 7 days from today

        const queryParams = new URLSearchParams({
          limit: 50,
          startsAfter,
          endsBefore,
          calendarId,
        });

        const url = `${serverBaseUrl}/nylas/read-events?${queryParams.toString()}`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: userId,
            "Content-Type": "application/json",
          },
          params: {
            calendarId,
          },
        });

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        const data = (await res.json()).filter(
          (event) => event.status !== "cancelled"
        );

        setEvents(data);
        setIsLoading(false);
      } catch (err) {
        console.warn(`Error reading calendar events:`, err);
      }
    }
  };

  const getPrimaryCalendarEvents = async () => {
    setIsLoading(true);
    const primaryCalendar = await getPrimaryCalendar();
    await getCalendarEvents(primaryCalendar?.id);
    setIsLoading(false);
  };

  const disconnectUser = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userEmail");
    setUserId("");
    setUserEmail("");
  };

  const refresh = () => {
    getPrimaryCalendarEvents();
  };

  return (
    <Layout
      showMenu={!!userId}
      disconnectUser={disconnectUser}
      isLoading={isLoading}
      refresh={refresh}
      enableCalendar={enableCalendar}
      showAdminLogin={showStudentForm && !userId}
      handleShowStudentForm={handleShowStudentForm}
    >
      {!userId ? (
        showStudentForm ? (
          <StudentForm />
        ) : (
          <NylasLogin email={userEmail} setEmail={setUserEmail} />
        )
      ) : enableAdmin ? (
        admin.medicalCounselorEmail ? (
          <div className="app-card">
            <AdminPage
              admin={admin}
              handleStudentToggle={handleStudentToggle}
              onDeleteAdmin={onDeleteAdmin}
              enableCalendar={enableCalendar}
              userId={typeof userId === "string" ? userId : userId.toString()}
              calendarId={primaryCalendar?.id}
              serverBaseUrl={serverBaseUrl}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              events={events}
              refresh={refresh}
            />
          </div>
        ) : (
          <div className="app-card">
            <AdminForm admin={admin} handleAdminSave={handleAdminSave} />
          </div>
        )
      ) : (
        <div className="app-card">
          <CalendarApp
            userId={typeof userId === "string" ? userId : userId.toString()}
            calendarId={primaryCalendar?.id}
            serverBaseUrl={serverBaseUrl}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            events={events}
            refresh={refresh}
            mcName={admin.medicalCounselorName}
          />
        </div>
      )}
    </Layout>
  );
}

export default App;

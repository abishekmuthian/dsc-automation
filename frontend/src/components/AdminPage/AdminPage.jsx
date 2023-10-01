import React, { useEffect, useCallback, useRef, useState } from "react";
import Switch from "react-switch";
import axios from "axios";
import CalendarApp from "../../CalendarApp";
import jsPDF from "jspdf";
import "jspdf-autotable";
import downloadIcon from "../icons/file-down.png";
import scheduleIcon from "../icons/calendar.png";

const AdminPage = ({
  admin,
  handleStudentToggle,
  onDeleteAdmin,
  enableCalendar,
  userId,
  calendarId,
  serverBaseUrl,
  isLoading,
  setIsLoading,
  events,
  refresh,
}) => {
  const [checked, setChecked] = useState(false);
  const [showData, setShowData] = useState(false);
  const [studentInputs, setStudentInputs] = useState([]);
  const [selectedStudent, setSelectedStduent] = useState("");
  const [calendarButton, setCalendarButton] = useState(true);

  const serverBaseUrlA =
    import.meta.env.VITE_SERVER_URI || "http://localhost:9000";
  useEffect(() => {
    const url = serverBaseUrlA + "/get/student-input";
    axios.get(url).then((res) => {
      if (res.data.length > 0) {
        setStudentInputs(res.data);
      } else {
        setStudentInputs([]);
      }
    });
    refresh();
  }, []);

  // const handleAdminCalendar = () => {
  //   setCalendarButton(!calendarButton);
  //   enableCalendar();
  // };

  // const handleAdminCalendar = useCallback(() => {
  //   setCalendarButton(!calendarButton);
  //   enableCalendar();
  // });

  // const handleChange = (nextChecked) => {
  //   setChecked(nextChecked);
  //   // console.log("admin data while toggling: ", admin);
  //   handleStudentToggle({ ...admin, studentFormToggle: nextChecked });
  // };

  const handleChange = useCallback(
    (nextChecked) => {
      setChecked(nextChecked);
      handleStudentToggle({ ...admin, studentFormToggle: nextChecked });
    },
    [checked]
  );

  const handleDownload = (student) => {
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);
    let studentDataArray = [];
    for (let key in student) {
      studentDataArray.push({ [key]: student[key] });
    }
    console.log("studnt array: ", studentDataArray);

    let headings = Object.keys(student);
    let studentKeyValueArr = Object.entries(student);

    const title = `${student.studentId}(${student.name})` + " DSC Data";

    const headers = [[...headings]];

    let content = {
      startY: 70,
      startX: 100,
      body: studentKeyValueArr,
      theme: "grid",
      columnStyles: {
        0: {
          cellWidth: 150,
          fillColor: [33, 53, 113],
          textColor: "white",
          cellPadding: 10,
          fontSize: 10,
        },
        1: { cellWidth: 350, fontSize: 10 },
      },
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(`${student.studentId}-${student.name}-data.pdf`);
  };

  const handleEventCreator = useCallback(
    (name) => {
      // console.log("event create log anme: ", name);
      setSelectedStduent(name);
    },
    [selectedStudent]
  );

  if (selectedStudent)
    return (
      <CalendarApp
        userId={userId}
        calendarId={calendarId}
        serverBaseUrl={serverBaseUrl}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        events={events}
        refresh={refresh}
        studentId={selectedStudent.studentId}
        studentName={selectedStudent.name}
        studentEmail={selectedStudent.email}
        mcEmail={admin.medicalCounselorEmail}
        mcName={admin.medicalCounselorName}
      />
    );
  return (
    <div
      className="app-card"
      style={{
        display: "flex",
        flexDirection: "row",
        // alignItems: "center",
        justifyContent: "space-between",
        // border: "1px solid red",
        margin: "0px",
        gap: "1px",
        padding: "1px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "50%",
          padding: "0px 5px",
        }}
      >
        <div>
          <h2>
            Settings Page{" "}
            <button onClick={() => onDeleteAdmin(admin)}>Delete</button>
          </h2>
          <p>Medical Counselor Name: {admin.medicalCounselorName}</p>
          <p>Medical Councelor Email: {admin.medicalCounselorEmail}</p>
        </div>

        <div
          className="enable_student"
          style={{ display: "flex", gap: "20px", alignItems: "center" }}
        >
          <p>Enable Student Form</p>
          <Switch
            onChange={handleChange}
            checked={admin.studentFormToggle ? true : checked}
            className="react-switch"
            onColor="#4169e1"
          />
        </div>
        <br />
      </div>
      <div style={{ width: "50%", padding: 0 }}>
        <h2>Enrolled Students</h2>
        {studentInputs.length > 0 ? (
          <div style={{ height: "150px", overflowY: "scroll" }}>
            <table
              className="table_all"
              style={{
                borderCollapse: "collapse",
                borderRadius: "5px",
                background: "white",
              }}
            >
              <thead
                style={{
                  position: "sticky",
                  top: "0px",
                  margin: "0 0 0 0",
                  background: "white",
                  fontWeight: "700",
                  // border: "1px solid grey",
                  // marginBottom: "1px",
                }}
              >
                <tr className="table_header">
                  <td style={{ width: "15%", paddingLeft: "2px" }}>Id</td>
                  <td style={{ width: "30%" }}>Name</td>
                  <td style={{ width: "15%" }}>Schedule</td>
                  <td style={{ width: "15%" }}>Report</td>
                </tr>
              </thead>
              <tbody>
                {studentInputs.map((input, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #EEEDED" }}>
                    <td
                      style={{
                        paddingLeft: "3px",
                      }}
                    >
                      {input.studentId}
                    </td>
                    <td>{input.name}</td>
                    <td>
                      <img
                        src={scheduleIcon}
                        alt="Schedule"
                        style={{ width: "30%" }}
                        onClick={() => handleEventCreator(input)}
                      />
                    </td>
                    <td>
                      <img
                        src={downloadIcon}
                        alt="Download Report"
                        style={{ width: "35%" }}
                        onClick={() => handleDownload(input)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h2>None</h2>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

{
  /* <div>
<CalendarApp
  userId={userId}
  calendarId={calendarId}
  serverBaseUrl={serverBaseUrl}
  isLoading={isLoading}
  setIsLoading={setIsLoading}
  events={events}
  refresh={refresh}
/>
</div> */
}

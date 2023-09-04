import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Switch from "react-switch";
import axios from "axios";

const AdminPage = ({ admin, handleStudentToggle, onDeleteAdmin }) => {
  console.log("admin in admin page: ", admin);
  const [checked, setChecked] = useState(false);
  const [showData, setShowData] = useState(false);
  const [studentInputs, setStudentInputs] = useState([]);
  const serverBaseUrl =
    import.meta.env.VITE_SERVER_URI || "http://localhost:9000";
  useEffect(() => {
    const url = serverBaseUrl + "/get/student-input";
    axios.get(url).then((res) => {
      if (res.data.length > 0) {
        console.log("students data: ", res.data);
        setStudentInputs(res.data);
      } else {
        setStudentInputs([]);
      }
    });
  }, []);

  const handleChange = (nextChecked) => {
    setChecked(nextChecked);
    console.log("admin data while toggling: ", admin);
    handleStudentToggle({ ...admin, studentFormToggle: nextChecked });
  };
  return (
    <div className="app-card">
      <div>
        <h2>
          Settings Page{" "}
          <button onClick={() => onDeleteAdmin(admin)}>Delete</button>
        </h2>
        <p>Name: {admin.name}</p>
        <p>Email: {admin.email}</p>
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
      <button onClick={() => setShowData(!showData)}>
        {showData ? "Hide" : "Show"} Student Input
      </button>
      {showData && (
        <ul>
          {studentInputs.map((input, index) => (
            <li key={index}>{input.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPage;

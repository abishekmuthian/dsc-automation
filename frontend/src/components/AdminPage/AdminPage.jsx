import React, { useRef, useState } from "react";
import Switch from "react-switch";

const AdminPage = ({ admin, handleStudentToggle, onDeleteAdmin }) => {
  const [checked, setChecked] = useState(false);
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
          checked={checked}
          className="react-switch"
          onColor="#4169e1"
        />
      </div>
    </div>
  );
};

export default AdminPage;

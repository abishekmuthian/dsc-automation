import React, { useRef, useState } from "react";
import Switch from "react-switch";
import "../../styles/admin.scss";

const AdminForm = ({ admin, handleAdminSave }) => {
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const adminDetails = {
      medicalCounselorName: "",
      medicalCounselorEmail: "",
    };

    adminDetails.medicalCounselorName = nameRef.current.value;
    adminDetails.medicalCounselorEmail = emailRef.current.value;

    handleAdminSave(adminDetails);

    emailRef.current.value = "";
    nameRef.current.value = "";
  };

  return (
    <div className="create-admin-form-view">
      <h2>Admin Form</h2>
      <form class="scrollbar" onSubmit={handleSubmit}>
        <div className="row">
          <div className="field-container">
            <label htmlFor="name">Medical Counselor Name</label>
            <input
              type="text"
              id="name"
              ref={nameRef}
              className="form_text_input"
              placeholder="enter admin name"
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="email">Medical Counselor Email</label>
            <input
              type="text"
              id="email"
              ref={emailRef}
              className="form_text_input"
              placeholder="enter admin email id"
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <button type="submit">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;

import React, { useRef, useState } from "react";
import Switch from "react-switch";

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
    <section className="form_page">
      <form className="admin_form" onSubmit={handleSubmit}>
        <h2>Admin Form Save</h2>
        <div className="form_inputs">
          <div>
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
          <div>
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
        <button type="submit">Save</button>
      </form>
    </section>
  );
};

export default AdminForm;

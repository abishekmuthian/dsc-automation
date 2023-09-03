import React, { useRef, useState } from "react";
import Switch from "react-switch";

const AdminForm = ({ admin, handleAdminSave }) => {
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const adminDetails = {
      name: "",
      email: "",
      accessToken: "",
    };
    adminDetails.email = emailRef.current.value;
    adminDetails.name = nameRef.current.value;
    // console.log(adminDetails);
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
            <label htmlFor="name">Name</label>
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
            <label htmlFor="email">Email</label>
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

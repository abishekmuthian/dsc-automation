import React, { useRef, useState } from "react";
import Switch from "react-switch";

const AdminPage = ({
  admin,
  hanldeAdminSave,
  handleStudentToggle,
  onDeleteAdmin,
}) => {
  const [checked, setChecked] = useState(false);
  const serverBaseUrl =
    import.meta.env.VITE_SERVER_URI || "http://localhost:9000";

  const handleChange = (nextChecked) => {
    setChecked(nextChecked);
    handleStudentToggle({ ...admin, studentFormToggle: nextChecked });
  };

  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const adminDetails = {
      name: "",
      email: "",
    };
    adminDetails.email = emailRef.current.value;
    adminDetails.name = nameRef.current.value;
    console.log(adminDetails);
    hanldeAdminSave(adminDetails);

    emailRef.current.value = "";
    nameRef.current.value = "";
  };
  if (admin && admin.name)
    return (
      <div className="app-card">
        <div>
          <h2>
            Settings{" "}
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
  return (
    <section className="form_page">
      <form className="admin_form" onSubmit={handleSubmit}>
        <h2>Admin Form</h2>
        <div className="form_inputs">
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              ref={nameRef}
              className="form_text_input"
              placeholder="enter admin name"
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
            />
          </div>
        </div>
        <button type="submit">Save</button>
      </form>
    </section>
  );
};

export default AdminPage;

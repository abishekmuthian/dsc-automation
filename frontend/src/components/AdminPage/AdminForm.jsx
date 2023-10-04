import React, { useRef, useState } from "react";
import Switch from "react-switch";
import "../../styles/admin.scss";
import { z } from "zod";

const adminSchema = z.object({
  medicalCounselorName: z.string().min(3, "Enter atleast 3 characters").max(50),
  medicalCounselorEmail: z.string().email("Enter a valid email address"),
});

const AdminForm = ({ admin, handleAdminSave }) => {
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErros] = useState({
    medicalCounselorName: "",
    medicalCounselorEmail: "",
  });
  const clearErrorMessage = (e) => {
    const { name, value } = e.target;

    setFormErros({ ...formErrors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const adminDetails = {
      medicalCounselorName: "",
      medicalCounselorEmail: "",
    };

    let originalCounselorName = nameRef.current.value;
    let originalCounselorEmail = emailRef.current.value;

    adminDetails.medicalCounselorName = originalCounselorName.toUpperCase();
    adminDetails.medicalCounselorEmail = originalCounselorEmail.toUpperCase();

    const formData = {
      medicalCounselorName: originalCounselorName.toUpperCase(),
      medicalCounselorEmail: originalCounselorEmail.toUpperCase(),
    };

    try {
      const validateFormData = adminSchema.parse(formData);
      handleAdminSave(adminDetails);
      emailRef.current.value = "";
      nameRef.current.value = "";
    } catch (err) {
      const listOfErrors = {};
      for (let formFieldErr of err.errors) {
        if (formFieldErr.path) {
          listOfErrors[formFieldErr.path[0]] = formFieldErr.message;
        }
      }

      setFormErros({ ...listOfErrors });
      setErrorMessage("Enter valid admin details");
    }
  };

  return (
    <div className="create-admin-form-view">
      <h2>Admin Form</h2>
      {errorMessage && (
        <p className="error-message" style={{ color: "coral" }}>
          {errorMessage}
        </p>
      )}
      <form className="scrollbar" onSubmit={handleSubmit}>
        <div className="row">
          <div className="field-container">
            <label htmlFor="name">Medical Counselor Name</label>
            <input
              type="text"
              id="name"
              name="medicalCounselorName"
              ref={nameRef}
              className="form_text_input"
              placeholder="enter admin name"
              onChange={clearErrorMessage}
              required
            />
            {formErrors?.medicalCounselorName && (
              <p className="error-message" style={{ color: "coral" }}>
                {formErrors.medicalCounselorName}
              </p>
            )}
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="email">Medical Counselor Email</label>
            <input
              type="text"
              id="email"
              name="medicalCounselorEmail"
              ref={emailRef}
              className="form_text_input"
              placeholder="enter admin email id"
              onChange={clearErrorMessage}
              required
            />
            {formErrors?.medicalCounselorEmail && (
              <p className="error-message" style={{ color: "coral" }}>
                {formErrors.medicalCounselorEmail}
              </p>
            )}
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

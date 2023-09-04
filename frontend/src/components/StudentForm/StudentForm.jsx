import React, { useRef, useState } from "react";
import axios from "axios";
import StudentDetailSaved from "./StudentDetailSaved";

const StudentForm = ({ handleShowStudentForm }) => {
  console.log("student form invoked");
  const studentIdRef = useRef(null);
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const disabilityRef = useRef(null);
  const [disability, setDisability] = useState("");
  const [dataStored, setDataStored] = useState(false);
  const serverBaseUrl =
    import.meta.env.VITE_SERVER_URI || "http://localhost:9000";
  const disabilityOptions = [
    {
      label: "Attention-Deficit/Hyperactivity Disorder (AD/HD)",
      value: "Attention-Deficit/Hyperactivity Disorder (AD/HD)",
    },
    { label: "Anxiety Disorders", value: "Anxiety Disorders" },
    { label: "Autism Spectrum Disorder", value: "Autism Spectrum Disorder" },
    { label: "Blind/Low Vision", value: "Blind/Low Vision" },
    {
      label: "Deaf and Hearing Impairments",
      value: "Deaf and Hearing Impairments",
    },
    { label: "Reading Disorder", value: "Reading Disorder" },
    { label: "Mathematics Disorde", value: "Mathematics Disorde" },
    {
      label: "Written Expression Disorder",
      value: "Written Expression Disorder",
    },
    { label: "Communication Disorder", value: "Communication Disorder" },
    {
      label: "Medical & Chronic Health Related Impairments",
      value: "Medical & Chronic Health Related Impairments",
    },
    { label: "Mobility Impairments", value: "Mood Disorders" },
    {
      label: "Pervasive Developmental Disorder",
      value: "Pervasive Developmental Disorder",
    },
    { label: "Traumatic Brain Injury", value: "Traumatic Brain Injury" },
  ];

  const handleChange = (event) => {
    setDisability(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const studentInput = {
      studentId: "",
      name: "",
      email: "",
      disability: "",
    };
    studentInput.studentId = studentIdRef.current.value;
    studentInput.email = emailRef.current.value;
    studentInput.name = nameRef.current.value;
    studentInput.disability = disability;
    console.log("student Input: ", studentInput);
    const url = serverBaseUrl + "/add/student-input";
    axios
      .post(url, studentInput)
      .then((response) => {
        console.log("Add student Input", response.data);
        setDataStored(true);
      })
      .catch((err) => {
        setDataStored(false);
        console.log("Error saving student input");
      });

    emailRef.current.value = "";
    nameRef.current.value = "";
    studentIdRef.current.value = "";
    disabilityRef.current.value = "";
  };

  if (dataStored) return <StudentDetailSaved />;

  return (
    <section className="form_page">
      <button
        style={{ float: "right" }}
        onClick={() => handleShowStudentForm(false)}
      >
        Admin Login
      </button>
      <form className="student_form" onSubmit={handleSubmit}>
        <h2>Student Form</h2>
        <div className="form_inputs">
          <div>
            <label htmlFor="studentId">Student Id</label>
            <input
              type="text"
              id="studentId"
              ref={studentIdRef}
              className="form_text_input"
              placeholder="Student Id"
              required
            />
          </div>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              ref={nameRef}
              className="form_text_input"
              placeholder="Student full Name"
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
              placeholder="Email id"
              required
            />
          </div>
          <div>
            <label htmlFor="text">
              Disability
              <select onChange={handleChange} ref={disabilityRef} required>
                <option value="">All Categories</option>
                {disabilityOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {/* <div>
            <select onChange={handleChange} className="form-select">
              <option value="">All Categories</option>
              {disabilityOptions.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div> */}
        </div>
        <button type="submit">Save</button>
      </form>
    </section>
  );
};

export default StudentForm;

import React, { useRef, useState } from "react";
import axios from "axios";
import StudentDetailSaved from "./StudentDetailSaved";
import { z } from "zod";

import "../../styles/student.scss";

const studentSchema = z.object({
  studentId: z
    .string()
    .min(3, "Student ID must be greater than 3 characters")
    .max(15),
  email: z.string().email("Enter a valid email address"),
  name: z.string().min(3, "Enter atleast 3 characters").max(50),
  programme: z.string().min(2, "Enter atleast 2 characters").max(50),
  contact: z
    .string()
    .min(10, "Contact number must be 10 digits")
    .refine(
      (phone) => {
        const contactNumber = Number(phone);
        return isFinite(contactNumber);
      },
      {
        message: "Contact number should be a valid number",
      }
    ),
  guardian: z.string().min(3, "Enter atleast 3 characters").max(50),
  guardianContact: z
    .string()
    .min(10, "Contact number must be 10 digits")
    .refine(
      (phone) => {
        const contactNumber = Number(phone);
        return isFinite(contactNumber);
      },
      {
        message: "Contact number should be a valid number",
      }
    ),
  guardianEmail: z.string().email("Enter a valid email address"),
});

const StudentForm = ({}) => {
  const studentIdRef = useRef(null);
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const disabilityRef = useRef(null);
  const programmeRef = useRef(null);
  const dobRef = useRef(null);
  const otherRef = useRef(null);
  const otherDetailsRef = useRef(null);
  const contactRef = useRef(null);
  const guardianRef = useRef(null);
  const guardianContactRef = useRef(null);
  const guardianEmailRef = useRef(null);
  const genderRef = useRef(null);

  const [disability, setDisability] = useState("");
  const [dataStored, setDataStored] = useState(false);
  const [courseType, setCourseType] = useState("Full-Time");
  const [agree, setAgree] = useState(true);
  const [gender, setGender] = useState("");
  const [disabilityList, setDisabilityList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErros] = useState({
    studentId: "",
    name: "",
    programme: "",
    email: "",
    contact: "",
    guardian: "",
    guardianContact: "",
    guardianEmail: "",
  });

  const handleDisabilityChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      const newDisabilityList = [...disabilityList, value];
      setDisabilityList(newDisabilityList);
    }
  };
  const onCourseTypeChange = (e) => {
    setCourseType(e.target.value);
  };

  const onAgree = (e) => {
    setAgree(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };
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

  const clearErrorMessage = (e) => {
    const { name, value } = e.target;

    setFormErros({ ...formErrors, [name]: "" });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErros({
      studentId: "",
      name: "",
      programme: "",
      email: "",
      contact: "",
      guardian: "",
      guardianContact: "",
      guardianEmail: "",
    });
    const studentInput = {
      studentId: "",
      name: "",
      email: "",
      disability: "",
    };
    const formInputs = {
      studentId: "",
      name: "",
      email: "",
      disability: "",
      programme: "",
      courseType: "",
      dob: "",
      gender: "",
      contact: "",
      guardian: "",
      guardianContact: "",
      guardianEmail: "",
      other: "",
      otherDetails: "",
    };

    studentInput.studentId = studentIdRef.current.value;
    studentInput.email = emailRef.current.value;
    studentInput.name = nameRef.current.value;
    studentInput.disability = disability;

    let originalStudentId = studentIdRef.current.value;
    formInputs.studentId = originalStudentId.toUpperCase();
    let originalEmail = emailRef.current.value;
    formInputs.email = originalEmail.toUpperCase();
    formInputs.name = nameRef.current.value;
    formInputs.disability = disabilityList.join(",");
    formInputs.programme = programmeRef.current.value;
    formInputs.courseType = courseType;
    formInputs.dob = dobRef.current.value;
    formInputs.gender = gender;
    formInputs.contact = contactRef.current.value;
    formInputs.guardian = guardianRef.current.value;
    formInputs.guardianContact = guardianContactRef.current.value;
    formInputs.guardianEmail = guardianEmailRef.current.value;
    formInputs.other = otherRef.current.value;
    formInputs.otherDetails = otherDetailsRef.current.value;
    const formData = {
      studentId: originalStudentId.toUpperCase(),
      name: nameRef.current.value,
      email: originalEmail.toUpperCase(),
      contact: contactRef.current.value,
      programme: programmeRef.current.value,
      guardian: guardianRef.current.value,
      guardianContact: guardianContactRef.current.value,
      guardianEmail: guardianEmailRef.current.value,
    };

    try {
      const validateFormData = studentSchema.parse(formData);

      const url = serverBaseUrl + "/add/student-input";
      axios
        .post(url, formInputs)
        .then((response) => {
          if (response.status === 201) {
            setDataStored(true);
            emailRef.current.value = "";
            nameRef.current.value = "";
            studentIdRef.current.value = "";
          } else {
            if (response.data.message === "Unique Constraint Error") {
              setDataStored(false);
              setErrorMessage("Student Record already exists");
            } else {
              setDataStored(false);
              setErrorMessage("Server Error");
            }
          }
        })
        .catch((err) => {
          setDataStored(false);
          setErrorMessage("Student record save failed");
        });

      // disabilityRef.current.value = "";
    } catch (err) {
      // setFormErros(err.formErrors);

      const listOfErrors = {};
      for (let formFieldErr of err.errors) {
        if (formFieldErr.path) {
          listOfErrors[formFieldErr.path[0]] = formFieldErr.message;
        }
      }

      setFormErros({ ...listOfErrors });
      setErrorMessage("Check all the fields and enter valid input");
    }
  };

  if (dataStored) return <StudentDetailSaved />;

  return (
    <div className="create-student-form-view">
      <h2>Student Form</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form className="scrollbar" onSubmit={handleSubmit}>
        <div className="row">
          <div className="field-container">
            <label htmlFor="studentId">Student Id *</label>
            <input
              type="text"
              name="studentId"
              id="studentId"
              ref={studentIdRef}
              placeholder="Student Id"
              onChange={clearErrorMessage}
              required
            />
            {formErrors?.studentId && (
              <p className="error-message">{formErrors.studentId}</p>
            )}
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              ref={nameRef}
              placeholder="Student full Name"
              onChange={clearErrorMessage}
              required
            />
            {formErrors?.name && (
              <p className="error-message">{formErrors.name}</p>
            )}
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="email">Email *</label>
            <input
              type="text"
              id="email"
              name="email"
              ref={emailRef}
              placeholder="Email id"
              onChange={clearErrorMessage}
              required
            />
            {formErrors?.email && (
              <p className="error-message">{formErrors.email}</p>
            )}
          </div>
        </div>

        <div className="row">
          <div className="field-container">
            <label htmlFor="programme">Programme *</label>
            <input
              type="text"
              id="programme"
              name="programme"
              ref={programmeRef}
              className="form_text_input"
              placeholder="Programme"
              onChange={clearErrorMessage}
              required
            />
            {formErrors?.programme && (
              <p className="error-message">{formErrors.programme}</p>
            )}
          </div>
        </div>
        <div className="row">
          <div className="course-type">
            <label>Select Course Type *</label>
            <div className="radio-type">
              <input
                className="radio-button"
                type="radio"
                value="Full-Time"
                id="course-fulltime"
                name="courseType"
                checked={courseType === "Full-Time"}
                onChange={onCourseTypeChange}
              />
              <label className="radio-desc" htmlFor="course-fulltime">
                Full Time
              </label>
            </div>
            <div className="radio-type">
              <input
                className="radio-button"
                type="radio"
                value="Part-Time"
                name="courseType"
                id="course-parttime"
                checked={courseType === "Part-Time"}
                onChange={onCourseTypeChange}
              />
              <label className="radio-desc" htmlFor="course-parttime">
                Part Time
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="dob">Date Of Birth *</label>
            <input
              type="date"
              id="dob"
              ref={dobRef}
              className="form_text_input"
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="text">
              Gender
              <select onChange={handleGenderChange} ref={genderRef} required>
                <option value="">Select Gender *</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>
        </div>

        <div className="row">
          <div className="field-container">
            <label htmlFor="contact">Student Contact No</label>
            <input
              type="text"
              id="contact"
              name="contact"
              ref={contactRef}
              className="form_text_input"
              placeholder="Student contact number"
              onChange={clearErrorMessage}
              required
            />
            {formErrors?.contact && (
              <p className="error-message">{formErrors.contact}</p>
            )}
          </div>
        </div>

        <div className="row">
          <div className="field-container">
            <label htmlFor="guardian">Guardian's Name</label>
            <input
              type="text"
              id="guardian"
              name="guardian"
              ref={guardianRef}
              className="form_text_input"
              placeholder="Guardian's name"
              onChange={clearErrorMessage}
              required
            />
            {formErrors?.guardian && (
              <p className="error-message">{formErrors.guardian}</p>
            )}
          </div>
        </div>

        <div className="row">
          <div className="field-container">
            <label htmlFor="guardian-contact">
              Guardian's phone number (for emergencies)
            </label>
            <input
              type="text"
              id="guardian-contact"
              name="guardianContact"
              ref={guardianContactRef}
              className="form_text_input"
              placeholder="guardian contact number"
              onChange={clearErrorMessage}
              required
            />
            {formErrors?.guardianContact && (
              <p className="error-message">{formErrors.guardianContact}</p>
            )}
          </div>
        </div>

        <div className="row">
          <div className="field-container">
            <label htmlFor="guardian-email">Guardian's emaill address</label>
            <input
              type="text"
              id="guardian-email"
              name="guardianEmail"
              ref={guardianEmailRef}
              className="form_text_input"
              placeholder="guardian email"
              onChange={clearErrorMessage}
              required
            />
            {formErrors?.guardianEmail && (
              <p className="error-message">{formErrors.guardianEmail}</p>
            )}
          </div>
        </div>

        <div className="disability-check">
          <label htmlFor="">
            Nature of Student's Physical/Medical/Psychological Condition *
          </label>
          <div className="field-container">
            <div className="disability-checkbox">
              <input
                type="checkbox"
                name="disability"
                value="Attention-Deficit/Hyperactivity Disorder (AD/HD)"
                id="disbilityCheckBox-Attention"
                onChange={handleDisabilityChange}
              />
              <label htmlFor="disbilityCheckBox-Attention">
                Attention-Deficit/Hyperactivity Disorder (AD/HD)
              </label>
            </div>
            <div className="disability-checkbox">
              <input
                type="checkbox"
                name="disability"
                value="Anxiety Disorders"
                id="disbilityCheckBox-Anxiety"
                onChange={handleDisabilityChange}
              />
              <label htmlFor="disbilityCheckBox-Anxiety">
                Anxiety Disorders
              </label>
            </div>
            <div className="disability-checkbox">
              {" "}
              <input
                type="checkbox"
                name="disability"
                value="Autism Spectrum Disorder"
                id="disbilityCheckBox-Autism"
                onChange={handleDisabilityChange}
              />
              <label htmlFor="disbilityCheckBox-Autism">
                Autism Spectrum Disorder
              </label>
            </div>
            <div className="disability-checkbox">
              <input
                type="checkbox"
                name="disability"
                value="Blind/Low Vision"
                id="disbilityCheckBox-Blind"
                onChange={handleDisabilityChange}
              />
              <label htmlFor="disbilityCheckBox-Blind">Blind/Low Vision</label>
            </div>
            <div className="disability-checkbox">
              {" "}
              <input
                type="checkbox"
                name="disability"
                value="Deaf and Hearing Impairments"
                id="disbilityCheckBox-Deaf"
                onChange={handleDisabilityChange}
              />
              <label htmlFor="disbilityCheckBox-Deaf">
                Deaf and Hearing Impairments
              </label>
            </div>
            <div className="disability-checkbox">
              <input
                type="checkbox"
                name="disability"
                value="Reading Disorder"
                id="disbilityCheckBox-Reading"
                onChange={handleDisabilityChange}
              />
              <label htmlFor="disbilityCheckBox-Reading">
                Reading Disorder
              </label>
            </div>
            <div className="disability-checkbox">
              {" "}
              <input
                type="checkbox"
                name="disability"
                value="Mathematics Disorder"
                id="disbilityCheckBox-Mathematics"
                onChange={handleDisabilityChange}
              />
              <label htmlFor="disbilityCheckBox-Mathematics">
                Mathematics Disorder
              </label>
            </div>
            <div className="disability-checkbox">
              <input
                type="checkbox"
                name="disability"
                value="Written Expression Disorder"
                id="disbilityCheckBox-Written"
                onChange={handleDisabilityChange}
              />
              <label htmlFor="disbilityCheckBox-Written">
                Written Expression Disorder
              </label>
            </div>
            <div className="disability-checkbox">
              {" "}
              <input
                type="checkbox"
                name="disability"
                value="Communication Disorder"
                id="disbilityCheckBox-Communication"
                onChange={handleDisabilityChange}
              />
              <label htmlFor="disbilityCheckBox-Communication">
                Communication Disorder
              </label>
            </div>
            <div className="disability-checkbox">
              <input
                type="checkbox"
                name="disability"
                value="Medical & Chronic Health Related Impairments"
                id="disbilityCheckBox-Medical"
                onChange={handleDisabilityChange}
              />
              <label htmlFor="disbilityCheckBox-Medical">
                Medical & Chronic Health Related Impairments
              </label>
            </div>
            <div className="disability-checkbox">
              {" "}
              <input
                type="checkbox"
                name="disability"
                value="Mobility Impairments"
                id="disbilityCheckBox-Mobility"
                onChange={handleDisabilityChange}
              />
              <label htmlFor="disbilityCheckBox-Mobility">
                Mobility Impairments
              </label>
            </div>
            <div className="disability-checkbox">
              <input
                type="checkbox"
                name="disability"
                value="Pervasive Developmental Disorder"
                id="disbilityCheckBox-Pervasive"
                onChange={handleDisabilityChange}
              />
              <label htmlFor="disbilityCheckBox-Pervasive">
                Pervasive Developmental Disorder
              </label>
            </div>
            <div className="disability-checkbox">
              <input
                type="checkbox"
                name="disability"
                value="Traumatic Brain Injury"
                id="disbilityCheckBox-Traumatic"
                onChange={handleDisabilityChange}
              />
              <label htmlFor="disbilityCheckBox-Traumatic">
                Traumatic Brain Injury
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="field-container">
            <label htmlFor="other">
              If any 'other' apart from those listed above, please specify (else
              please write Not Applicable/NA)
            </label>
            <textarea
              ref={otherRef}
              name="other"
              rows={4}
              cols={40}
              id="other"
            />
          </div>
        </div>

        <div className="row">
          <div className="field-container">
            {" "}
            <label htmlFor="other-details">
              For how long have you been experiencing the aforementioned
              condition? / When was the issue first diagnosed?*
            </label>
            <textarea
              ref={otherDetailsRef}
              name="other-details"
              rows={4}
              cols={40}
              id="other-details"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="course-type">
            <label>
              Declaration & Agreement (Please click below after reading)
              <br />
              <br />I hereby declare that the information given by me in the
              Application is true, complete and correct to the best of my
              knowledge and belief and that nothing has been concealed or
              distorted.
            </label>
            <div className="radio-type">
              <input
                className="radio-button"
                type="radio"
                name="agree"
                id="agree"
                onChange={onAgree}
                required
              />
              <label className="radio-desc" htmlFor="agree">
                I agree with the above
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="field-container">
            <button type="submit">Save</button>{" "}
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;

import React, { useRef, useState } from "react";
import axios from "axios";
import StudentDetailSaved from "./StudentDetailSaved";

// import "./StudentForm.css";

import "../../styles/student.scss";

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
  const crossSchoolRef = useRef(null);
  const genderRef = useRef(null);
  const mandatoryRef = useRef(null);

  const [disability, setDisability] = useState("");
  const [dataStored, setDataStored] = useState(false);
  const [courseType, setCourseType] = useState("Full-Time");
  const [agree, setAgree] = useState(true);
  const [gender, setGender] = useState("");
  const [disabilityList, setDisabilityList] = useState([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
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
      other: "",
      otherDetails: "",
      crossSchool: "",
      mandatory: "",
    };
    studentInput.studentId = studentIdRef.current.value;
    studentInput.email = emailRef.current.value;
    studentInput.name = nameRef.current.value;
    studentInput.disability = disability;

    formInputs.studentId = studentIdRef.current.value;
    formInputs.email = emailRef.current.value;
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
    formInputs.crossSchool = crossSchoolRef.current.value;
    formInputs.mandatory = mandatoryRef.current.value;

    console.log("Form Inputs: ", formInputs);

    // console.log("student Input: ", studentInput);
    const url = serverBaseUrl + "/add/student-input";
    axios
      .post(url, formInputs)
      .then((response) => {
        console.log("Added form Inputs", response.data);
        setDataStored(true);
      })
      .catch((err) => {
        setDataStored(false);
        // console.log("Error saving student input");
      });

    emailRef.current.value = "";
    nameRef.current.value = "";
    studentIdRef.current.value = "";
    // disabilityRef.current.value = "";
  };

  if (dataStored) return <StudentDetailSaved />;

  return (
    <div className="create-student-form-view">
      <h2>Student Form</h2>
      <form className="student_form scrollbar" onSubmit={handleSubmit}>
        <div className="row">
          <div className="field-container">
            <label htmlFor="studentId">Student Id</label>
            <input
              type="text"
              id="studentId"
              ref={studentIdRef}
              placeholder="Student Id"
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              ref={nameRef}
              placeholder="Student full Name"
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="field-container">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              ref={emailRef}
              placeholder="Email id"
              required
            />
          </div>
        </div>
        {/* <div>
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
          </div> */}
        <div className="row">
          <div className="field-container">
            <label htmlFor="programme">Programme</label>
            <input
              type="text"
              id="programme"
              ref={programmeRef}
              className="form_text_input"
              placeholder="Programme"
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="course-type">
            <p>Select Course Type</p>
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
            <label htmlFor="dob">Date Of Birth</label>
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
                <option value="">Select Gender</option>
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
              ref={contactRef}
              className="form_text_input"
              placeholder="Student contact number"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="field-container">
            <label htmlFor="guardian">Guardian's Name</label>
            <input
              type="text"
              id="guardian"
              ref={guardianRef}
              className="form_text_input"
              placeholder="Guardian's name"
              required
            />
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
              ref={guardianContactRef}
              className="form_text_input"
              placeholder="guardian contact number"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="field-container">
            <label htmlFor="guardian-contact">Guardian's emaill address</label>
            <input
              type="text"
              id="guardian-contact"
              ref={guardianEmailRef}
              className="form_text_input"
              placeholder="guardian email"
              required
            />
          </div>
        </div>

        <div className="disability-check">
          <label htmlFor="">
            Nature of Student's Physical/Medical/Psychological Condition
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
              condition? / When was the issue first diagnosed?
            </label>
            <textarea
              ref={otherDetailsRef}
              name="other-details"
              rows={4}
              cols={40}
              id="other-details"
            />
          </div>
        </div>

        <div className="row">
          <div className="field-container">
            <label htmlFor="mandatory">
              [MANDATORY INFORMATION] Please provide the following information:
              1) COURSES opted for this semester 2) Whether CORE/ELECTIVE. 3)
              Name(s) of respective COURSE INSTRUCTORS in the following format:
              1) Qualitative Research Methods - CORE/ELECTIVE - Prof. XYZ 2)
              ..... *
            </label>
            <textarea
              ref={mandatoryRef}
              name="mandatory"
              id="mandatory"
              rows={4}
              cols={40}
            />
          </div>
        </div>

        <div className="row">
          <div className="field-container">
            <label htmlFor="cross-school">
              Cross Registered School Name & Course details, if any (Doubt)
            </label>
            <input
              type="text"
              id="cross-school"
              ref={crossSchoolRef}
              className="form_text_input"
              placeholder=""
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="course-type">
            <p>DECLARATION & AGREEMENT (PLEASE CLICK BELOW AFTER READING)</p>
            <div className="radio-type">
              <input
                className="radio-button"
                type="radio"
                name="agree"
                id="agree"
                onChange={onAgree}
              />
              <label className="radio-desc" htmlFor="agree">
                I agree with the above
              </label>
            </div>
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

export default StudentForm;

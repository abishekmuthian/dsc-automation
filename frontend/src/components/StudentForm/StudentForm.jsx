import React from "react";

const StudentForm = () => {
  return (
    <section className="form_page">
      <form className="student_form" onSubmit={handleSubmit}>
        <h2>Student Form</h2>
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

export default StudentForm;

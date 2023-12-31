# Disability Support Committee Automation

University disability support committees are under-resourced and find it challenging to serve all students.

Disability Support Committee Automation automates most common actions using nylas and AI.

## Video Demo

[![Disability Support Committee Autiomation Video Demo](/demo/Thumbnail.png)](https://youtu.be/hgOpYfrnOsQ)

## Screenshots

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/1.png)
Nylas hosted authentication handles login from multiple email service provider seamlessly.

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/2-0.png)
Admin form for the medical counselor.

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/2.png)
Student form for all the student details.

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/3-0.png)
Student form can be enabled by the admin.

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/3.png)
Student form for all the student details.

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/4.png)
Students can select multiple disabilities.

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/5.png)

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/6.png)
Admin can download the report with the student details.

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/7.png)
The student disability data is downloaded as .pdf.

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/8.png)
Meeting can be scheduled with the student and medical counselor by clicking on the schedule button.

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/9.png)
clicking notify counselor would send inclusive pedagogy suggestions generated by AI to the medical counselor.

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/10.png)
The student and the medical counselor would automatically get the event invites.

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/11-new.png)
Inclusive pedagogy suggestions generated by Chat GPT for the student, Sent to the medical counselor. (No personal information of the student is shared with Chat GPT)

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/12.png)

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/13.png)

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/14.png)

![nylas login](https://dsc-automation.s3.us-east-2.amazonaws.com/15.png)

## Deployment

The deployment instructions are in the `backend` and `frontend` folders.

## Usage

1. Open `localhost:3000`. This is **Admin instance**.

2. Login using email id, Microsoft account is recommended (For Google, GCP project needs to be setup in nylas).

Note: Microsoft email account might require [App Passwords](https://support.microsoft.com/en-us/account-billing/using-app-passwords-with-apps-that-don-t-support-two-step-verification-5896ed9b-4263-e681-128a-a6f2979a7944) to be setup with 2FA for logging into the application.

3. Enter the Medical Counselor name, email id (any email service provider) and enable the student form.

4. Open `localhost:3000` in a private browser instance or another browser. This is student instance.

5. Enter the student details along with the disabilities and save it.

6. Open the Admin instance and click Report button to download the student report in .pdf.

7. Click the Schedule button to schedule the meeting for the student with the medical counselor from next day onwards.

8. Invites would be automatically sent to all participants.

9. Click `Notify Counselor` to send `inclusive pedagogy` suggestions to the medical counselor.

10. Check the email of the medical counselor for the inclusive pedagogy suggestions.

## License

The MIT License (MIT)

Copyright (c) 2023 ABISHEK MUTHIAN, SAMARASAM SADASIVAM (Disability Support Committee Automation)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# Attendance-System-Backend
* The backend for a hardware system used to attend students using **RFID** and keep their attendance in Firebase realtime 
database to be accessible through the front-end whether web or mobile.

* This repository represents the **API** to be used by both:
  * the hardware that will attend students.
  * the front-end that will display students' attendance.

* The **API** is built using Firebase cloud functions and in NodeJS. It consists of 3 endpoints:
  * ` registerMe ` that can be used to register a new student and assign him/her a new **RFID**.
  * ` loginMe ` that can be used to login and get a student's attendance.
  * ` attendMe ` that is called from the hardware to attend students.
  
* The project is built on top of firebase and these services are employed to accomplish the task:
  * Authentication.
  * Realtime Database.
  * Cloud Functions.
  
* Aso used ` axios ` to talk to realtime database and authentication from the cloud functions.

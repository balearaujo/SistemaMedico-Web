**WEB-BASED PRESCRIPTION SYSTEM**

This repository contains the Web Systems Programming project for the fast and efficient management of prescriptions and patient records.

**1. ARCHITECTURE DESIGN AND SEPARATION OF RESPONSIBILITIES**

   For this project, we will use an architecture based on the MVC (Model-View-Controller) pattern implemented via a REST API. The separation of responsibilities will be as follows:
   * **Models:** These will be exclusively responsible for connecting to the MySQL database using prepared statements to prevent SQL injection. We will have models such as `PatientModel` (for registering and searching for patients), `AppointmentModel` (schedule), and `PrescriptionModel` (which will handle the logic for distinguishing controlled-substance prescriptions from general prescriptions).
   * **Controllers:** These will contain the business logic. For example, the `PrescriptionController` will receive the data, validate the information, and trigger the creation of the PDF; the `AuthController` will validate logins and lock the account after 5 failed attempts.
   * **Routes:** These will define the system’s endpoints (for example: `/api/patients`).
   * **Middleware:** These will act as security filters before data reaches the controllers. We will have an `authMiddleware` to verify that the session is active and a `roleMiddleware` to ensure that the secretary cannot issue prescriptions.

  **PROPOSED FOLDER STRUCTURE:**
  * `/docs`: Project documentation (PDFs, ER diagrams, use cases).
  * `/src/controllers`: Application business logic.
  * `/src/models`: Database queries and connections.
  * `/src/routes`: Definition of HTTP endpoints.
  * `/src/middlewares`: Security filters and role validation.

**3. SECURITY TESTS**
   In accordance with the security requirements outlined, these are the test cases planned to validate the system’s security:

| Test ID | Test Scenario | Expected Result |
| :--- | :--- | :--- |
| **SEC-01** | A user attempts to log in with an incorrect password 5 times in a row. | The system temporarily locks the account and denies access. |
| **SEC-02** | The secretary attempts to access the prescription issuance route via the URL. | The system rejects the request due to lack of permissions (role-based access control). |
| **SEC-03** | An attacker attempts to inject SQL code into the patient search function. | The system processes the text as a simple string thanks to prepared statements; no malicious code is executed. |
| **SEC-04** | A user leaves their session open and inactive for an extended period. | The system automatically expires the session and prompts the user to log in again. |
| **SEC-05** | An attempt is made to access the system via standard HTTP instead of HTTPS. | The system forces a redirect to HTTPS to protect data in transit. |

# 🏥 AarogyaCare — Hospital Management System

AarogyaCare is a full-stack **Hospital Management System** designed to simplify and manage day-to-day hospital operations through a centralized web application.

The system provides separate modules for managing patients, doctors, staff, appointments, admissions, pharmacy, laboratory tests, billing, inventory, and reports.

---

## 🌐 Project Overview

AarogyaCare provides a modern hospital administration dashboard where hospital administrators can manage important hospital records from a single platform.

The application follows a **React frontend + Django REST API + MongoDB** architecture.

### Architecture

```text
                    ┌─────────────────────────┐
                    │       AarogyaCare       │
                    │   Hospital Management    │
                    └────────────┬────────────┘
                                 │
                         React Frontend
                                 │
                         REST API / HTTP
                                 │
                         Django Backend
                                 │
                         Django REST Framework
                                 │
                              MongoDB
✨ Features
🔐 Authentication
User Signup
User Login
Authentication interface
Professional hospital-themed Login and Signup pages
Session information stored using browser local storage
Protected application workflow after login
📊 Dashboard

The AarogyaCare dashboard provides an overview of hospital activities.

Dashboard includes:
Total Patients
Total Doctors
Appointments
Admissions
Appointment status overview
Recent appointments
Department overview
Monthly patient statistics
Quick access to hospital services
Hospital system status
🏥 Hospital Management Modules

AarogyaCare contains the following major modules:

👨‍⚕️ Doctors

Manage hospital doctors.

Features:

Add doctor
View doctors
Update doctor
Delete doctor
Doctor ID
Name
Specialization
Qualification
Experience
Phone
Email
Address
Department
Joining date
🧑‍🤝‍🧑 Staff

Manage hospital staff records.

Features:

Add staff
View staff
Update staff
Delete staff
Staff ID
Staff information
Department
Contact details
Staff status
🧑‍🤝‍🧑 Patients

Manage patient information.

Features:

Add patient
View patients
Update patient
Delete patient
Patient ID
Patient details
Contact information
Registration information
Patient records
📅 Appointments

Manage patient appointments with doctors.

Features:

Create appointments
View appointments
Update appointments
Delete appointments
Appointment number
Patient information
Doctor information
Appointment date
Appointment status
🏨 Admissions

Manage hospital admissions.

Features:

Add admission
View admissions
Update admissions
Delete admissions
Admission number
Patient information
Admission date
Discharge information
Admission status
💊 Pharmacy

Manage hospital medicines and pharmacy inventory.

Features:

Add medicine
View medicines
Update medicine
Delete medicine
Medicine ID
Medicine name
Category
Manufacturer
Batch number
Manufacturing date
Expiry date
Price
Stock quantity
🧪 Laboratory

Manage laboratory tests and patient test records.

Features:

Add laboratory test
View laboratory tests
Update test records
Delete test records
Test ID
Patient information
Test name
Test details
Test status
Test date
💰 Billing

Manage hospital billing records.

Features:

Create billing records
View bills
Update bills
Delete bills
Patient billing information
Amount details
Payment status
Billing records
📦 Inventory

Manage hospital inventory.

Features:

Add inventory items
View inventory
Update inventory
Delete inventory
Item information
Quantity tracking
Stock management
Inventory status
📈 Reports

Provides access to hospital reports and administrative information.

Features:

View reports
Generate/manage report records
Hospital data overview
Administrative reporting
🖥️ User Interface

AarogyaCare uses a clean and professional hospital management interface.

Main Navigation
Dashboard
Departments
Doctors
Staff
Patients
Appointments
Admissions
Pharmacy
Laboratory
Billing
Inventory
Reports

The application includes a persistent hospital-themed sidebar for easy navigation between modules.

🛠️ Technologies Used
Frontend
React.js
JavaScript
HTML5
CSS3
Vite
React Router
REST API integration
Backend
Python
Django
Django REST Framework
Django CORS Headers
Database
MongoDB
MongoDB Compass
Development Tools
Visual Studio Code
Git
GitHub
Command Prompt
MongoDB Compass
📁 Project Structure
AarogyaCare-Hospital-Management-System/
│
├── backend/
│   │
│   ├── accounts/
│   ├── admissions/
│   ├── appointments/
│   ├── billing/
│   ├── departments/
│   ├── doctors/
│   ├── inventory/
│   ├── laboratory/
│   ├── patients/
│   ├── pharmacy/
│   ├── reports/
│   ├── staff/
│   │
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│
├── .gitignore
└── README.md
⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/rekhapeddineni/AarogyaCare-Hospital-Management-System.git

Move into the project:

cd AarogyaCare-Hospital-Management-System
🐍 Backend Setup

Move into the backend directory:

cd backend

Create a virtual environment:

python -m venv venv

Activate the virtual environment on Windows:

venv\Scripts\activate

Install the required Python packages:

pip install -r requirements.txt
🗄️ Configure MongoDB

Make sure MongoDB is installed and running.

The project uses MongoDB as the database.

You can use:

MongoDB Community Server
MongoDB Compass
MongoDB Atlas

Configure the MongoDB connection in the Django backend using environment variables.

Example:

MONGODB_URI=your_mongodb_connection_string
MONGODB_DATABASE=HospitalManagementSystem

Never commit database credentials, passwords, API keys, or secret keys to GitHub.

▶️ Run the Backend

From the backend directory:

python manage.py runserver

The backend will normally be available at:

http://127.0.0.1:8000/

API endpoints are available under:

http://127.0.0.1:8000/api/
⚛️ Frontend Setup

Open another terminal.

Move to the frontend directory:

cd frontend

Install Node dependencies:

npm install

Start the Vite development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173/
🔗 API Modules

The backend provides REST API endpoints for the major hospital modules.

/api/accounts/
/api/departments/
/api/doctors/
/api/staff/
/api/patients/
/api/appointments/
/api/admissions/
/api/pharmacy/
/api/laboratory/
/api/billing/
/api/inventory/
/api/reports/
🔄 CRUD Operations

AarogyaCare implements CRUD operations across the major management modules.

Create
  ↓
Read
  ↓
Update
  ↓
Delete

For example:

Patient
   │
   ├── Add Patient
   ├── View Patient
   ├── Edit Patient
   └── Delete Patient
🆔 Business IDs

The system uses meaningful business identifiers instead of exposing MongoDB ObjectIds to users wherever appropriate.

Examples:

Patient ID       → PAT001
Doctor ID        → DOC001
Staff ID         → STF001
Appointment No.  → APP001
Admission No.    → ADM001
Medicine ID      → MED001
Test ID          → LAB001

This makes records easier for hospital staff to identify and manage.

📊 Database

MongoDB is used for storing hospital management data.

Main collections include records for:

Patients
Doctors
Staff
Departments
Appointments
Admissions
Pharmacy
Laboratory
Billing
Inventory
Reports

MongoDB Compass can be used to view and manage the database during development.

🎨 Design

The application follows a professional healthcare dashboard design.

Design goals
Clean interface
Responsive layout
Easy navigation
Hospital-themed colors
Clear data tables
Dashboard statistics
User-friendly CRUD forms
Professional Login and Signup screens
🔒 Security Considerations

For production deployment:

Store secrets in environment variables
Never commit .env files
Never expose database credentials
Configure Django SECRET_KEY securely
Configure production ALLOWED_HOSTS
Configure CORS properly
Use HTTPS
Use secure authentication
Use production MongoDB credentials
Disable Django debug mode
🚀 Deployment

AarogyaCare can be deployed using a cloud architecture such as:

React / Vite
     │
     ▼
Frontend Hosting
     │
     ▼
Django REST API
     │
     ▼
Backend Hosting
     │
     ▼
MongoDB Atlas

The production deployment configuration can be added separately after local development is complete.

🧪 Testing Checklist

Before deployment, the following functionality should be tested:

Authentication
 Signup
 Login
 Navigation after login
Dashboard
 Statistics
 Appointments
 Patient statistics
 Department overview
Management Modules
 Doctors CRUD
 Staff CRUD
 Patients CRUD
 Appointments CRUD
 Admissions CRUD
 Pharmacy CRUD
 Laboratory CRUD
 Billing CRUD
 Inventory CRUD
 Reports
📸 Screenshots

Screenshots of the application can be added here.

Login

Add screenshot:

docs/screenshots/login.png
Signup
docs/screenshots/signup.png
Dashboard
docs/screenshots/dashboard.png
Doctors
docs/screenshots/doctors.png
Patients
docs/screenshots/patients.png
Pharmacy
docs/screenshots/pharmacy.png
Laboratory
docs/screenshots/laboratory.png
🎯 Project Objectives

The main objectives of AarogyaCare are:

Digitize hospital administration
Centralize hospital records
Reduce manual record management
Improve accessibility of patient information
Simplify doctor and staff management
Manage appointments efficiently
Track admissions
Manage pharmacy stock
Manage laboratory records
Manage billing information
Track hospital inventory
Provide useful administrative reports
🌟 Future Enhancements

Possible future improvements include:

Role-based access control
Admin / Doctor / Staff user roles
JWT authentication
Patient portal
Doctor portal
Online appointment booking
Prescription management
Electronic medical records
Automated email notifications
SMS notifications
Advanced analytics
PDF report generation
Online payments
Hospital revenue analytics
Cloud deployment
Automated backups
👩‍💻 Developer

Rekha Peddineni

MCA Student | Aspiring Python Developer

Skills
Python
Django
Django REST Framework
React.js
JavaScript
MongoDB
HTML
CSS
Git
GitHub
📌 Project Information

Project Name: AarogyaCare Hospital Management System

Project Type: Full-Stack Web Application

Domain: Healthcare / Hospital Management

Frontend: React + Vite

Backend: Django + Django REST Framework

Database: MongoDB

Version Control: Git + GitHub

📜 License

This project is currently intended for educational and portfolio purposes.

A license can be added later if the project is distributed publicly for reuse.

⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

🏥 AarogyaCare
Healthier Today, Better Tomorrow.
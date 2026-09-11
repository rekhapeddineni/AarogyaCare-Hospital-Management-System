import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API = "http://127.0.0.1:8000/api";

function Dashboard() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          patientsResponse,
          doctorsResponse,
          appointmentsResponse,
          admissionsResponse,
        ] = await Promise.all([
          fetch(`${API}/patients/`),
          fetch(`${API}/doctors/`),
          fetch(`${API}/appointments/`),

          // IMPORTANT:
          // Correct admissions API
          fetch(`${API}/admissions/admissions/`),
        ]);

        const patientsData = await patientsResponse.json();
        const doctorsData = await doctorsResponse.json();
        const appointmentsData = await appointmentsResponse.json();
        const admissionsData = await admissionsResponse.json();

        setPatients(
          Array.isArray(patientsData)
            ? patientsData
            : patientsData.results || []
        );

        setDoctors(
          Array.isArray(doctorsData)
            ? doctorsData
            : doctorsData.results || []
        );

        setAppointments(
          Array.isArray(appointmentsData)
            ? appointmentsData
            : appointmentsData.results || []
        );

        setAdmissions(
          Array.isArray(admissionsData)
            ? admissionsData
            : admissionsData.results || []
        );
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // =====================================================
  // DATE
  // =====================================================

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const todayString = today.toISOString().split("T")[0];

  // =====================================================
  // TODAY'S APPOINTMENTS
  // =====================================================

  const todayAppointments = appointments.filter((appointment) => {
    const date =
      appointment.appointment_date ||
      appointment.date ||
      appointment.appointmentDate ||
      appointment.created_at;

    if (!date) return false;

    return String(date).substring(0, 10) === todayString;
  });

  const displayAppointments =
    todayAppointments.length > 0
      ? todayAppointments.slice(0, 5)
      : appointments.slice(0, 5);

  // =====================================================
  // APPOINTMENT STATUS
  // =====================================================

  const completedAppointments = appointments.filter(
    (appointment) =>
      String(appointment.status || "").toLowerCase() === "completed"
  ).length;

  const pendingAppointments = appointments.filter((appointment) =>
    ["pending", "scheduled", "confirmed"].includes(
      String(appointment.status || "").toLowerCase()
    )
  ).length;

  const cancelledAppointments = appointments.filter(
    (appointment) =>
      String(appointment.status || "").toLowerCase() === "cancelled"
  ).length;

  const totalAppointments = appointments.length || 1;

  const completedPercentage = Math.round(
    (completedAppointments / totalAppointments) * 100
  );

  const pendingPercentage = Math.round(
    (pendingAppointments / totalAppointments) * 100
  );

  const cancelledPercentage = Math.round(
    (cancelledAppointments / totalAppointments) * 100
  );

  // =====================================================
  // MONTHLY PATIENT DATA
  // =====================================================

  const monthlyPatients = Array(12).fill(0);

  patients.forEach((patient) => {
    const date =
      patient.admission_date ||
      patient.created_at ||
      patient.registration_date ||
      patient.date_joined;

    if (!date) return;

    const parsedDate = new Date(date);

    if (!isNaN(parsedDate.getTime())) {
      monthlyPatients[parsedDate.getMonth()]++;
    }
  });

  const maxPatients = Math.max(...monthlyPatients, 1);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // =====================================================
  // DEPARTMENTS
  // =====================================================

  const departmentNames = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Gynecology",
    "Dermatology",
    "Pediatrics",
  ];

  const departmentCounts = departmentNames.map((department) => {
    return patients.filter((patient) => {
      const values = [
        patient.department,
        patient.department_name,
        patient.disease,
        patient.doctor_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return values.includes(department.toLowerCase());
    }).length;
  });

  const maxDepartmentPatients = Math.max(...departmentCounts, 1);

  // =====================================================
  // HELPERS
  // =====================================================

  const getPatientName = (appointment) => {
    return (
      appointment.patient_name ||
      appointment.patient ||
      appointment.name ||
      "Patient"
    );
  };

  const getDoctorName = (appointment) => {
    return appointment.doctor_name || appointment.doctor || "Doctor";
  };

  const getAppointmentTime = (appointment) => {
    return (
      appointment.appointment_time ||
      appointment.time ||
      appointment.appointmentTime ||
      "--:--"
    );
  };

  const getPatientId = (patient) => {
    return patient.patient_id || patient.id || "N/A";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="dashboard-container">

      {/* =================================================
          TOP HEADER
      ================================================= */}

      <div className="dashboard-topbar">

        <div>
          <h1>WELCOME, ADMIN</h1>

          <p className="hospital-name">
            AarogyaCare Hospital
          </p>

          <p className="dashboard-date">
            {formattedDate}
          </p>
        </div>

        <div className="topbar-actions">

          <button
            className="notification-button"
            title="Notifications"
          >
            🔔
          </button>

          <div className="admin-profile">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Admin</strong>
              <span>Hospital Administrator</span>
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          WELCOME SECTION WITH HOSPITAL IMAGE
      ================================================= */}

      <section className="welcome-banner">

        <div className="welcome-content">

          <span className="welcome-small">
            🏥 AAROGYACARE HOSPITAL
          </span>

          <h2>
            Your Health,
            <br />
            Our Priority
          </h2>

          <p>
            Manage patients, doctors, appointments and
            hospital services from one place.
          </p>

          <div className="welcome-buttons">

            <button
              className="primary-button"
              onClick={() => navigate("/appointments")}
            >
              + Book Appointment
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate("/doctors")}
            >
              👨‍⚕️ Find Doctor
            </button>

          </div>

        </div>

        {/* HOSPITAL IMAGE */}

        <div className="hospital-image-box">

          <img
            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=85"
            alt="Modern hospital"
          />

          <div className="image-overlay">
            <span>🏥</span>
            <div>
              <strong>AarogyaCare</strong>
              <small>Quality Healthcare</small>
            </div>
          </div>

        </div>

      </section>

      {/* =================================================
          EMERGENCY
      ================================================= */}

      <section className="emergency-card">

        <div className="emergency-icon">
          🚨
        </div>

        <div className="emergency-content">

          <h3>Emergency Assistance</h3>

          <p>
            Need immediate medical assistance?
            Our emergency services are available 24/7.
          </p>

        </div>

        <a
          href="tel:108"
          className="emergency-button"
        >
          📞 Emergency 108
        </a>

      </section>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="stats-grid">

        <div
          className="stat-card"
          onClick={() => navigate("/patients")}
        >
          <div className="stat-icon">
            👥
          </div>

          <div>
            <span>Total Patients</span>
            <h2>{patients.length}</h2>
            <small>Registered patients</small>
          </div>
        </div>

        <div
          className="stat-card"
          onClick={() => navigate("/doctors")}
        >
          <div className="stat-icon">
            👨‍⚕️
          </div>

          <div>
            <span>Total Doctors</span>
            <h2>{doctors.length}</h2>
            <small>Medical professionals</small>
          </div>
        </div>

        <div
          className="stat-card"
          onClick={() => navigate("/appointments")}
        >
          <div className="stat-icon">
            📅
          </div>

          <div>
            <span>Appointments</span>
            <h2>{appointments.length}</h2>
            <small>Total appointments</small>
          </div>
        </div>

        <div
          className="stat-card"
          onClick={() => navigate("/admissions")}
        >
          <div className="stat-icon">
            🏥
          </div>

          <div>
            <span>Admissions</span>
            <h2>{admissions.length}</h2>
            <small>Hospital admissions</small>
          </div>
        </div>

      </div>

      {/* =================================================
          ANALYTICS
      ================================================= */}

      <div className="analytics-grid">

        {/* PATIENT STATISTICS */}

        <div className="dashboard-card patient-chart-card">

          <div className="card-header">

            <div>
              <h3>Patient Statistics</h3>
              <p>Monthly patient registrations</p>
            </div>

            <span className="chart-icon">
              📊
            </span>

          </div>

          <div className="bar-chart">

            {monthlyPatients.map((value, index) => {

              const height =
                value === 0
                  ? 5
                  : Math.max((value / maxPatients) * 100, 8);

              return (
                <div
                  className="bar-column"
                  key={index}
                >

                  <div className="bar-value">
                    {value}
                  </div>

                  <div className="bar-wrapper">

                    <div
                      className="patient-bar"
                      style={{
                        height: `${height}%`,
                      }}
                    ></div>

                  </div>

                  <span>
                    {monthNames[index]}
                  </span>

                </div>
              );
            })}

          </div>

        </div>

        {/* APPOINTMENT STATUS */}

        <div className="dashboard-card status-card">

          <div className="card-header">

            <div>
              <h3>Appointment Status</h3>
              <p>Current appointment overview</p>
            </div>

            <span className="chart-icon">
              📅
            </span>

          </div>

          <div className="status-list">

            <div className="status-item">

              <div className="status-title">
                <span>Completed</span>
                <strong>
                  {completedPercentage}%
                </strong>
              </div>

              <div className="progress">

                <div
                  className="progress-completed"
                  style={{
                    width: `${completedPercentage}%`,
                  }}
                ></div>

              </div>

            </div>

            <div className="status-item">

              <div className="status-title">
                <span>Pending</span>
                <strong>
                  {pendingPercentage}%
                </strong>
              </div>

              <div className="progress">

                <div
                  className="progress-pending"
                  style={{
                    width: `${pendingPercentage}%`,
                  }}
                ></div>

              </div>

            </div>

            <div className="status-item">

              <div className="status-title">
                <span>Cancelled</span>
                <strong>
                  {cancelledPercentage}%
                </strong>
              </div>

              <div className="progress">

                <div
                  className="progress-cancelled"
                  style={{
                    width: `${cancelledPercentage}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>

          <div className="total-appointments">
            <strong>{appointments.length}</strong>
            <span>Total Appointments</span>
          </div>

        </div>

      </div>

      {/* =================================================
          LOWER GRID
      ================================================= */}

      <div className="lower-grid">

        {/* TODAY'S APPOINTMENTS */}

        <div className="dashboard-card appointments-card">

          <div className="card-header">

            <div>
              <h3>Today's Appointments</h3>

              <p>
                {todayAppointments.length > 0
                  ? "Scheduled for today"
                  : "Recent appointments"}
              </p>

            </div>

            <button
              className="view-all-button"
              onClick={() => navigate("/appointments")}
            >
              View All →
            </button>

          </div>

          <div className="appointment-list">

            {displayAppointments.length === 0 ? (

              <div className="empty-dashboard">
                <span>📅</span>
                <p>No appointments available</p>
              </div>

            ) : (

              displayAppointments.map(
                (appointment, index) => (

                  <div
                    className="appointment-row"
                    key={
                      appointment.id ||
                      appointment.appointment_number ||
                      index
                    }
                  >

                    <div className="appointment-time">
                      {getAppointmentTime(appointment)}
                    </div>

                    <div className="appointment-avatar">
                      👤
                    </div>

                    <div className="appointment-info">

                      <strong>
                        {getPatientName(appointment)}
                      </strong>

                      <span>
                        {getDoctorName(appointment)}
                      </span>

                    </div>

                    <span
                      className={`appointment-status ${
                        String(
                          appointment.status || "scheduled"
                        ).toLowerCase()
                      }`}
                    >
                      {appointment.status || "Scheduled"}
                    </span>

                  </div>

                )
              )

            )}

          </div>

        </div>

        {/* QUICK SERVICES */}

        <div className="dashboard-card services-card">

          <div className="card-header">

            <div>
              <h3>Quick Services</h3>
              <p>Hospital management shortcuts</p>
            </div>

            <span className="chart-icon">
              ⚡
            </span>

          </div>

          <div className="quick-services">

            <button
              onClick={() => navigate("/appointments")}
            >
              <span>📅</span>

              <div>
                <strong>Book Appointment</strong>
                <small>Schedule a patient visit</small>
              </div>

              <b>→</b>
            </button>

            <button
              onClick={() => navigate("/doctors")}
            >
              <span>👨‍⚕️</span>

              <div>
                <strong>Find a Doctor</strong>
                <small>View medical professionals</small>
              </div>

              <b>→</b>
            </button>

            <button
              onClick={() => navigate("/laboratory")}
            >
              <span>🧪</span>

              <div>
                <strong>Laboratory</strong>
                <small>Manage lab tests</small>
              </div>

              <b>→</b>
            </button>

            <button
              onClick={() => navigate("/pharmacy")}
            >
              <span>💊</span>

              <div>
                <strong>Pharmacy</strong>
                <small>Manage medicines</small>
              </div>

              <b>→</b>
            </button>

          </div>

        </div>

      </div>

      {/* =================================================
          DEPARTMENT OVERVIEW
      ================================================= */}

      <div className="dashboard-card departments-card">

        <div className="card-header">

          <div>
            <h3>Department Overview</h3>
            <p>Patients by department</p>
          </div>

          <button
            className="view-all-button"
            onClick={() => navigate("/departments")}
          >
            View Departments →
          </button>

        </div>

        <div className="department-grid">

          {departmentNames.map(
            (department, index) => {

              const count = departmentCounts[index];

              const width = Math.max(
                (count / maxDepartmentPatients) * 100,
                count > 0 ? 10 : 3
              );

              return (
                <div
                  className="department-item"
                  key={department}
                >

                  <div className="department-top">

                    <span>

                      {department === "Cardiology" && "❤️"}

                      {department === "Neurology" && "🧠"}

                      {department === "Orthopedics" && "🦴"}

                      {department === "Gynecology" && "👩‍⚕️"}

                      {department === "Dermatology" && "🩺"}

                      {department === "Pediatrics" && "👶"}

                      {" "}

                      {department}

                    </span>

                    <strong>
                      {count}
                    </strong>

                  </div>

                  <div className="department-progress">

                    <div
                      style={{
                        width: `${width}%`,
                      }}
                    ></div>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

      {/* =================================================
          RECENT PATIENTS
      ================================================= */}

      <div className="dashboard-card recent-patients-card">

        <div className="card-header">

          <div>
            <h3>Recent Patients</h3>
            <p>Recently registered patients</p>
          </div>

          <button
            className="view-all-button"
            onClick={() => navigate("/patients")}
          >
            View All →
          </button>

        </div>

        {patients.length === 0 ? (

          <div className="empty-dashboard">
            <span>👥</span>
            <p>No patients registered yet</p>
          </div>

        ) : (

          <div className="patients-table">

            <div className="table-header">
              <span>Patient</span>
              <span>Patient ID</span>
              <span>Age</span>
              <span>Gender</span>
              <span>Blood Group</span>
            </div>

            {patients
              .slice()
              .reverse()
              .slice(0, 5)
              .map((patient, index) => (

                <div
                  className="table-row"
                  key={
                    patient.id ||
                    patient.patient_id ||
                    index
                  }
                >

                  <div className="patient-name">

                    <div className="patient-avatar">

                      {String(
                        patient.first_name ||
                        patient.name ||
                        "P"
                      )
                        .charAt(0)
                        .toUpperCase()}

                    </div>

                    <strong>

                      {patient.first_name
                        ? `${patient.first_name} ${
                            patient.last_name || ""
                          }`
                        : patient.name || "Patient"}

                    </strong>

                  </div>

                  <span>
                    {getPatientId(patient)}
                  </span>

                  <span>
                    {patient.age || "N/A"}
                  </span>

                  <span>
                    {patient.gender || "N/A"}
                  </span>

                  <span className="blood-group">
                    {patient.blood_group ||
                      patient.bloodGroup ||
                      "N/A"}
                  </span>

                </div>

              ))}

          </div>

        )}

      </div>

      {/* =================================================
          HOSPITAL INFORMATION
      ================================================= */}

      <section className="hospital-info">

        <div className="info-item">

          <span>🏥</span>

          <div>
            <strong>AarogyaCare Hospital</strong>
            <small>
              Healthier Today, Better Tomorrow
            </small>
          </div>

        </div>

        <div className="info-item">

          <span>📞</span>

          <div>
            <strong>24/7 Help Desk</strong>
            <small>
              Available anytime
            </small>
          </div>

        </div>

        <div className="info-item">

          <span>🚑</span>

          <div>
            <strong>Emergency Services</strong>
            <small>
              Call 108 for emergency
            </small>
          </div>

        </div>

      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="dashboard-footer">

        <div>

          <strong>
            AarogyaCare Hospital
          </strong>

          <span>
            Healthier Today, Better Tomorrow
          </span>

        </div>

        <p>
          © {new Date().getFullYear()} AarogyaCare Hospital.
          All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Dashboard;
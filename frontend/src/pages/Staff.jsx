
import React, { useEffect, useState } from "react";
import "./Staff.css";

const API_URL = "http://127.0.0.1:8000/api/staff/staff/";

function Staff() {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: "",
    department: "",
    phone: "",
    email: "",
    salary: "",
    joining_date: "",
  });

  // =========================================================
  // FETCH STAFF
  // =========================================================

  const fetchStaff = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch staff");
      }

      const data = await response.json();

      setStaff(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setError("Unable to load staff records.");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================================
  // ADD / UPDATE STAFF
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      let response;

      if (editingId) {
        // UPDATE
        response = await fetch(`${API_URL}${editingId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        // ADD
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);

        const errorMessage =
          typeof data === "object"
            ? Object.values(data).flat().join(" ")
            : "Something went wrong.";

        setError(errorMessage);
        return;
      }

      if (editingId) {
        setMessage("Staff updated successfully.");
      } else {
        setMessage("Staff added successfully.");
      }

      resetForm();
      fetchStaff();
    } catch (error) {
      console.error("Submit error:", error);
      setError("Unable to connect to the server.");
    }
  };

  // =========================================================
  // EDIT STAFF
  // =========================================================

  const handleEdit = (person) => {
    setEditingId(person.staff_id);

    setFormData({
      first_name: person.first_name || "",
      last_name: person.last_name || "",
      role: person.role || "",
      department: person.department || "",
      phone: person.phone || "",
      email: person.email || "",
      salary: person.salary || "",
      joining_date: person.joining_date || "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // DELETE STAFF
  // =========================================================

  const handleDelete = async (staffId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff member?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}${staffId}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setMessage("Staff deleted successfully.");

      fetchStaff();
    } catch (error) {
      console.error("Delete error:", error);
      setError("Unable to delete staff member.");
    }
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      role: "",
      department: "",
      phone: "",
      email: "",
      salary: "",
      joining_date: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // =========================================================
  // CALCULATE STATS
  // =========================================================

  const totalStaff = staff.length;

  const nurses = staff.filter(
    (person) => person.role === "Nurse"
  ).length;

  const doctors = staff.filter(
    (person) => person.role === "Doctor"
  ).length;

  const otherStaff = totalStaff - nurses - doctors;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="staff-page">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>
          <h1>👨‍💼 Staff</h1>

          <p>
            Manage hospital staff and employee information
          </p>
        </div>

        {!showForm && (
          <button
            className="add-staff-btn"
            onClick={() => {
              setShowForm(true);
              setMessage("");
              setError("");
            }}
          >
            ➕ Add Staff
          </button>
        )}

      </div>

      {/* ================= MESSAGES ================= */}

      {message && (
        <div className="success-message">
          ✅ {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {/* ================= SUMMARY ================= */}

      <div className="staff-summary">

        <div className="summary-card">

          <div className="summary-icon">
            👨‍💼
          </div>

          <div className="summary-content">
            <h3>Total Staff</h3>
            <p className="summary-number">
              {totalStaff}
            </p>
          </div>

        </div>

        <div className="summary-card">

          <div className="summary-icon">
            👨‍⚕️
          </div>

          <div className="summary-content">
            <h3>Doctors</h3>
            <p className="summary-number">
              {doctors}
            </p>
          </div>

        </div>

        <div className="summary-card">

          <div className="summary-icon">
            👩‍⚕️
          </div>

          <div className="summary-content">
            <h3>Nurses</h3>
            <p className="summary-number">
              {nurses}
            </p>
          </div>

        </div>

        <div className="summary-card">

          <div className="summary-icon">
            🏥
          </div>

          <div className="summary-content">
            <h3>Other Staff</h3>
            <p className="summary-number">
              {otherStaff}
            </p>
          </div>

        </div>

      </div>

      {/* ================= FORM ================= */}

      {showForm && (

        <div className="staff-card">

          <div className="card-title">

            <h2>
              {editingId
                ? "✏️ Edit Staff"
                : "👨‍💼 Add New Staff"}
            </h2>

            <p>
              Enter the staff member details below
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* FIRST NAME */}

              <div className="form-group">

                <label>
                  👤 First Name
                </label>

                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                />

              </div>

              {/* LAST NAME */}

              <div className="form-group">

                <label>
                  👤 Last Name
                </label>

                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  required
                />

              </div>

              {/* ROLE */}

              <div className="form-group">

                <label>
                  💼 Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Role
                  </option>

                  <option value="Doctor">
                    Doctor
                  </option>

                  <option value="Nurse">
                    Nurse
                  </option>

                  <option value="Receptionist">
                    Receptionist
                  </option>

                  <option value="Pharmacist">
                    Pharmacist
                  </option>

                  <option value="Lab Technician">
                    Lab Technician
                  </option>

                  <option value="Administrator">
                    Administrator
                  </option>

                  <option value="Accountant">
                    Accountant
                  </option>

                  <option value="Ward Assistant">
                    Ward Assistant
                  </option>

                  <option value="Technician">
                    Technician
                  </option>

                </select>

              </div>

              {/* DEPARTMENT */}

              <div className="form-group">

                <label>
                  🏥 Department
                </label>

                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                  required
                />

              </div>

              {/* PHONE */}

              <div className="form-group">

                <label>
                  📞 Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />

              </div>

              {/* EMAIL */}

              <div className="form-group">

                <label>
                  ✉️ Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />

              </div>

              {/* SALARY */}

              <div className="form-group">

                <label>
                  💰 Salary
                </label>

                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Enter salary"
                  min="0"
                  required
                />

              </div>

              {/* JOINING DATE */}

              <div className="form-group">

                <label>
                  📅 Joining Date
                </label>

                <input
                  type="date"
                  name="joining_date"
                  value={formData.joining_date}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* BUTTONS */}

            <div className="form-buttons">

              <button
                type="submit"
                className="save-btn"
              >
                {editingId
                  ? "Update Staff"
                  : "Add Staff"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}

      {/* ================= STAFF LIST ================= */}

      <div className="staff-card">

        <div className="list-header">

          <div>

            <h2>
              👨‍💼 Staff Records
            </h2>

            <p>
              Registered hospital staff members
            </p>

          </div>

        </div>

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>🆔 ID</th>

                <th>👤 Staff Name</th>

                <th>💼 Role</th>

                <th>🏥 Department</th>

                <th>📞 Phone</th>

                <th>✉️ Email</th>

                <th>💰 Salary</th>

                <th>📅 Joining Date</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {staff.length === 0 ? (

                <tr>

                  <td
                    colSpan="9"
                    className="no-data"
                  >
                    No staff records found
                  </td>

                </tr>

              ) : (

                staff.map((person) => (

                  <tr key={person.staff_id}>

                    {/* STAFF ID */}

                    <td>
                      <strong>
                        {person.staff_id}
                      </strong>
                    </td>

                    {/* STAFF NAME */}

                    <td className="staff-name">
                      👤 {person.first_name}{" "}
                      {person.last_name}
                    </td>

                    {/* ROLE */}

                    <td>
                      💼 {person.role}
                    </td>

                    {/* DEPARTMENT */}

                    <td>
                      🏥{" "}
                      {person.department_name ||
                        person.department ||
                        "Not Assigned"}
                    </td>

                    {/* PHONE */}

                    <td>
                      📞 {person.phone}
                    </td>

                    {/* EMAIL */}

                    <td>
                      ✉️ {person.email}
                    </td>

                    {/* SALARY */}

                    <td>
                      ₹{person.salary}
                    </td>

                    {/* JOINING DATE */}

                    <td>
                      📅 {person.joining_date}
                    </td>

                    {/* ACTIONS */}

                    <td>

                      <div className="action-buttons">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(person)
                          }
                          title="Edit"
                        >
                          ✏️
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              person.staff_id
                            )
                          }
                          title="Delete"
                        >
                          🗑️
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Staff;


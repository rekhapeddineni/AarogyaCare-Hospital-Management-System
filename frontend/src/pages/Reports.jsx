import React, { useEffect, useState } from "react";
import "./Reports.css";

const API_URL = "https://aarogyacare-backend.onrender.com/api/reports/reports/";

function Reports() {
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    report_name: "",
    report_type: "Patients",
    generated_by: "",
    generated_date: "",
    description: "",
  });

  // =====================================================
  // FETCH REPORTS
  // =====================================================
  const fetchReports = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setReports(data);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load reports.");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // RESET FORM
  // =====================================================
  const resetForm = () => {
    setFormData({
      report_name: "",
      report_type: "Patients",
      generated_by: "",
      generated_date: "",
      description: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // =====================================================
  // ADD REPORT
  // =====================================================
  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        throw new Error("Failed to add report");
      }

      setMessage("Report added successfully.");
      setError("");

      resetForm();
      fetchReports();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to add report.");
    }
  };

  // =====================================================
  // EDIT REPORT
  // =====================================================
  const handleEdit = (report) => {
    setFormData({
      report_name: report.report_name || "",
      report_type: report.report_type || "Patients",
      generated_by: report.generated_by || "",
      generated_date: report.generated_date || "",
      description: report.description || "",
    });

    setEditingId(report.report_id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // UPDATE REPORT
  // =====================================================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}${editingId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        throw new Error("Failed to update report");
      }

      setMessage("Report updated successfully.");
      setError("");

      resetForm();
      fetchReports();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to update report.");
    }
  };

  // =====================================================
  // DELETE REPORT
  // =====================================================
  const handleDelete = async (reportId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}${reportId}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete report");
      }

      setMessage("Report deleted successfully.");
      setError("");

      fetchReports();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to delete report.");
    }
  };

  // =====================================================
  // STATISTICS
  // =====================================================
  const totalReports = reports.length;

  const patientReports = reports.filter(
    (report) => report.report_type === "Patients"
  ).length;

  const doctorReports = reports.filter(
    (report) => report.report_type === "Doctors"
  ).length;

  const otherReports = reports.filter(
    (report) =>
      report.report_type !== "Patients" &&
      report.report_type !== "Doctors"
  ).length;

  // =====================================================
  // TYPE ICON
  // =====================================================
  const getTypeIcon = (type) => {
    switch (type) {
      case "Patients":
        return "👥";

      case "Doctors":
        return "👨‍⚕️";

      case "Appointments":
        return "📅";

      case "Admissions":
        return "🏥";

      case "Pharmacy":
        return "💊";

      case "Laboratory":
        return "🧪";

      case "Billing":
        return "💳";

      case "Inventory":
        return "📦";

      default:
        return "📁";
    }
  };

  return (
    <div className="reports-page">

      {/* =================================================
          HEADER
      ================================================= */}
      <div className="reports-header">

        <div className="reports-title">

          <div className="reports-title-icon">
            📊
          </div>

          <div>
            <h1>Reports</h1>
            <p>Generate and manage hospital reports</p>
          </div>

        </div>

        <button
          className="add-report-btn"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
        >
          ➕ Add Report
        </button>

      </div>


      {/* =================================================
          MESSAGE
      ================================================= */}
      {message && (
        <div className="reports-message success">
          ✅ {message}
        </div>
      )}

      {error && (
        <div className="reports-message error">
          ❌ {error}
        </div>
      )}


      {/* =================================================
          FORM
      ================================================= */}
      {showForm && (
        <div className="report-form-card">

          <div className="form-header">
            <div className="form-header-icon">
              📄
            </div>

            <div>
              <h2>
                {editingId ? "Edit Report" : "Add New Report"}
              </h2>

              <p>
                {editingId
                  ? "Update report information"
                  : "Enter report details"}
              </p>
            </div>
          </div>


          <form
            onSubmit={editingId ? handleUpdate : handleAdd}
          >

            <div className="form-grid">

              <div className="form-group">
                <label>📄 Report Name</label>

                <input
                  type="text"
                  name="report_name"
                  value={formData.report_name}
                  onChange={handleChange}
                  placeholder="Enter report name"
                  required
                />
              </div>


              <div className="form-group">
                <label>📊 Report Type</label>

                <select
                  name="report_type"
                  value={formData.report_type}
                  onChange={handleChange}
                  required
                >
                  <option value="Patients">Patients</option>
                  <option value="Doctors">Doctors</option>
                  <option value="Appointments">
                    Appointments
                  </option>
                  <option value="Admissions">
                    Admissions
                  </option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Laboratory">
                    Laboratory
                  </option>
                  <option value="Billing">Billing</option>
                  <option value="Inventory">
                    Inventory
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>


              <div className="form-group">
                <label>👤 Generated By</label>

                <input
                  type="text"
                  name="generated_by"
                  value={formData.generated_by}
                  onChange={handleChange}
                  placeholder="Enter generated by"
                  required
                />
              </div>


              <div className="form-group">
                <label>📅 Generated Date</label>

                <input
                  type="date"
                  name="generated_date"
                  value={formData.generated_date}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="form-group full-width">
                <label>📝 Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter report description"
                  rows="4"
                />
              </div>

            </div>


            <div className="form-buttons">

              <button
                type="submit"
                className="save-btn"
              >
                {editingId
                  ? "💾 Update Report"
                  : "💾 Save Report"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
              >
                ❌ Cancel
              </button>

            </div>

          </form>

        </div>
      )}


      {/* =================================================
          STAT CARDS
      ================================================= */}
      <div className="reports-stats">

        <div className="stat-card total">

          <div className="stat-icon">
            📊
          </div>

          <div>
            <h2>{totalReports}</h2>
            <p>Total Reports</p>
          </div>

        </div>


        <div className="stat-card patients">

          <div className="stat-icon">
            👥
          </div>

          <div>
            <h2>{patientReports}</h2>
            <p>Patient Reports</p>
          </div>

        </div>


        <div className="stat-card doctors">

          <div className="stat-icon">
            👨‍⚕️
          </div>

          <div>
            <h2>{doctorReports}</h2>
            <p>Doctor Reports</p>
          </div>

        </div>


        <div className="stat-card others">

          <div className="stat-icon">
            📁
          </div>

          <div>
            <h2>{otherReports}</h2>
            <p>Other Reports</p>
          </div>

        </div>

      </div>


      {/* =================================================
          REPORT RECORDS
      ================================================= */}
      <div className="reports-records">

        <div className="records-header">

          <div className="records-title">

            <div className="records-icon">
              📄
            </div>

            <div>
              <h2>Report Records</h2>
              <p>Hospital reports available in the system</p>
            </div>

          </div>

          <div className="search-icon">
            🔍
          </div>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}
        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  🆔 ID
                </th>

                <th>
                  📄 Report Name
                </th>

                <th>
                  🏷️ Type
                </th>

                <th>
                  👤 Generated By
                </th>

                <th>
                  📅 Date
                </th>

                <th>
                  📝 Description
                </th>

                <th>
                  ⚙️ Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {reports.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="empty-row"
                  >
                    📭 No reports available
                  </td>

                </tr>

              ) : (

                reports.map((report) => (

                  <tr key={report.report_id}>

                    {/* ID */}
                    <td>

                      <span className="id-badge">
                        {report.report_id}
                      </span>

                    </td>


                    {/* REPORT NAME */}
                    <td>

                      <div className="report-name-cell">

                        <div className="small-image report-image">
                          {getTypeIcon(report.report_type)}
                        </div>

                        <strong>
                          {report.report_name}
                        </strong>

                      </div>

                    </td>


                    {/* TYPE */}
                    <td>

                      <span className="type-badge">

                        <span className="type-icon">
                          {getTypeIcon(report.report_type)}
                        </span>

                        {report.report_type}

                      </span>

                    </td>


                    {/* GENERATED BY */}
                    <td>

                      <div className="info-cell">

                        <div className="small-image user-image">
                          👤
                        </div>

                        <span>
                          {report.generated_by}
                        </span>

                      </div>

                    </td>


                    {/* DATE */}
                    <td>

                      <div className="info-cell">

                        <div className="small-image date-image">
                          📅
                        </div>

                        <span>
                          {report.generated_date}
                        </span>

                      </div>

                    </td>


                    {/* DESCRIPTION */}
                    <td>

                      <div className="description-cell">

                        <div className="small-image description-image">
                          📝
                        </div>

                        <span>
                          {report.description ||
                            "No description"}
                        </span>

                      </div>

                    </td>


                    {/* ACTIONS */}
                    <td>

                      <div className="action-buttons">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(report)
                          }
                          title="Edit"
                        >
                          ✏️
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              report.report_id
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

export default Reports;

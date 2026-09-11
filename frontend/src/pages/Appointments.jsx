import React, { useEffect, useState } from "react";
import "./Appointments.css";

const API_URL = "http://127.0.0.1:8000/api/appointments/";

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const emptyForm = {
        patient_name: "",
        doctor_name: "",
        department: "",
        appointment_date: "",
        appointment_time: "",
        reason: "",
        status: "Confirmed",
    };

    const [formData, setFormData] = useState(emptyForm);

    // =========================
    // GET - Fetch Appointments
    // =========================
    const fetchAppointments = async () => {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Unable to fetch appointments");
            }

            const data = await response.json();

            console.log("Appointments:", data);

            setAppointments(data);
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Unable to load appointments.");
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // =========================
    // Handle Form Changes
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =========================
    // POST - Add / PUT - Update
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;

            if (editingId !== null) {
                // UPDATE
                response = await fetch(
                    `${API_URL}${editingId}/`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    }
                );
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

            if (!response.ok) {
                const errorData = await response.json();

                console.log("Backend error:", errorData);

                alert(
                    "Please check all the entered details."
                );

                return;
            }

            await response.json();

            alert(
                editingId !== null
                    ? "Appointment updated successfully!"
                    : "Appointment added successfully!"
            );

            resetForm();
            await fetchAppointments();

        } catch (error) {
            console.error("Save error:", error);
            alert("Something went wrong.");
        }
    };

    // =========================
    // EDIT
    // =========================
    const handleEdit = (appointment) => {

        // MongoDB internal ID is used for API request
        setEditingId(appointment.id);

        setFormData({
            patient_name: appointment.patient_name || "",
            doctor_name: appointment.doctor_name || "",
            department: appointment.department || "",
            appointment_date:
                appointment.appointment_date || "",
            appointment_time:
                appointment.appointment_time
                    ? appointment.appointment_time.substring(0, 5)
                    : "",
            reason: appointment.reason || "",
            status: appointment.status || "Confirmed",
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================
    // DELETE
    // =========================
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this appointment?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}${id}/`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to delete appointment"
                );
            }

            alert(
                "Appointment deleted successfully!"
            );

            await fetchAppointments();

        } catch (error) {
            console.error("Delete error:", error);
            alert("Unable to delete appointment.");
        }
    };

    // =========================
    // RESET / CANCEL FORM
    // =========================
    const resetForm = () => {
        setFormData(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="appointments-page">

            {/* ================= HEADER ================= */}

            <div className="page-header">

                <div>

                    <h1>
                        📅 Appointments
                    </h1>

                    <p>
                        Manage patient appointments and schedules
                    </p>

                </div>

                {!showForm && (

                    <button
                        type="button"
                        className="add-appointment-btn"
                        onClick={() =>
                            setShowForm(true)
                        }
                    >
                        ➕ Add Appointment
                    </button>

                )}

            </div>

            {/* ================= TOTAL APPOINTMENTS ================= */}

            <div className="appointment-summary">

                <div className="summary-card">

                    <div className="summary-icon">
                        📅
                    </div>

                    <div className="summary-content">

                        <h3>
                            Total Appointments
                        </h3>

                        <p className="summary-number">
                            {appointments.length}
                        </p>

                    </div>

                </div>

            </div>

            {/* ================= FORM ================= */}

            {showForm && (

                <div className="appointment-card">

                    <div className="card-title">

                        <h2>

                            {editingId !== null
                                ? "✏️ Edit Appointment"
                                : "➕ Add New Appointment"}

                        </h2>

                        <p>

                            {editingId !== null
                                ? "Update appointment information"
                                : "Enter the appointment details below"}

                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                    >

                        <div className="form-grid">

                            {/* PATIENT */}

                            <div className="form-group">

                                <label>
                                    👤 Patient Name
                                </label>

                                <input
                                    type="text"
                                    name="patient_name"
                                    value={
                                        formData.patient_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter patient name"
                                    required
                                />

                            </div>

                            {/* DOCTOR */}

                            <div className="form-group">

                                <label>
                                    👨‍⚕️ Doctor Name
                                </label>

                                <input
                                    type="text"
                                    name="doctor_name"
                                    value={
                                        formData.doctor_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter doctor name"
                                    required
                                />

                            </div>

                            {/* DEPARTMENT */}

                            <div className="form-group">

                                <label>
                                    🏥 Department
                                </label>

                                <input
                                    type="text"
                                    name="department"
                                    value={
                                        formData.department
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter department"
                                    required
                                />

                            </div>

                            {/* DATE */}

                            <div className="form-group">

                                <label>
                                    📅 Appointment Date
                                </label>

                                <input
                                    type="date"
                                    name="appointment_date"
                                    value={
                                        formData.appointment_date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* TIME */}

                            <div className="form-group">

                                <label>
                                    ⏰ Appointment Time
                                </label>

                                <input
                                    type="time"
                                    name="appointment_time"
                                    value={
                                        formData.appointment_time
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* STATUS */}

                            <div className="form-group">

                                <label>
                                    📌 Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="Confirmed">
                                        ✅ Confirmed
                                    </option>

                                    <option value="Pending">
                                        ⏳ Pending
                                    </option>

                                    <option value="Completed">
                                        ✔️ Completed
                                    </option>

                                    <option value="Cancelled">
                                        ❌ Cancelled
                                    </option>

                                </select>

                            </div>

                            {/* REASON */}

                            <div className="form-group full-width">

                                <label>
                                    📝 Reason
                                </label>

                                <textarea
                                    name="reason"
                                    value={
                                        formData.reason
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter reason for appointment"
                                    rows="3"
                                    required
                                />

                            </div>

                        </div>

                        {/* FORM BUTTONS */}

                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="save-btn"
                            >

                                {editingId !== null
                                    ? "✏️ Update Appointment"
                                    : "💾 Add Appointment"}

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

            {/* ================= APPOINTMENT LIST ================= */}

            <div className="appointment-card">

                <div className="list-header">

                    <div>

                        <h2>
                            📋 Appointment List
                        </h2>

                        <p>
                            View and manage all appointments
                        </p>

                    </div>

                </div>

                {/* TABLE */}

                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    🆔 ID
                                </th>

                                <th>
                                    👤 Patient
                                </th>

                                <th>
                                    👨‍⚕️ Doctor
                                </th>

                                <th>
                                    🏥 Department
                                </th>

                                <th>
                                    📅 Date
                                </th>

                                <th>
                                    ⏰ Time
                                </th>

                                <th>
                                    📝 Reason
                                </th>

                                <th>
                                    📌 Status
                                </th>

                                <th>
                                    ⚙️ Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {appointments.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="no-data"
                                    >
                                        📅 No appointments found
                                    </td>

                                </tr>

                            ) : (

                                appointments.map(
                                    (appointment) => (

                                        <tr
                                            key={
                                                appointment.id
                                            }
                                        >

                                            {/* ID */}
<td>{appointment.appointment_number}</td>

                                            {/* PATIENT */}

                                            <td>

                                                <div className="appointment-cell">

                                                    <span className="appointment-icon">
                                                        👤
                                                    </span>

                                                    <span>
                                                        {
                                                            appointment.patient_name
                                                        }
                                                    </span>

                                                </div>

                                            </td>

                                            {/* DOCTOR */}

                                            <td>

                                                <div className="appointment-cell">

                                                    <span className="appointment-icon">
                                                        👨‍⚕️
                                                    </span>

                                                    <span>
                                                        {
                                                            appointment.doctor_name
                                                        }
                                                    </span>

                                                </div>

                                            </td>

                                            {/* DEPARTMENT */}

                                            <td>

                                                <div className="appointment-cell">

                                                    <span className="appointment-icon">
                                                        🏥
                                                    </span>

                                                    <span>
                                                        {
                                                            appointment.department
                                                        }
                                                    </span>

                                                </div>

                                            </td>

                                            {/* DATE */}

                                            <td>

                                                <div className="appointment-cell">

                                                    <span className="appointment-icon">
                                                        📅
                                                    </span>

                                                    <span>
                                                        {
                                                            appointment.appointment_date
                                                        }
                                                    </span>

                                                </div>

                                            </td>

                                            {/* TIME */}

                                            <td>

                                                <div className="appointment-cell">

                                                    <span className="appointment-icon">
                                                        ⏰
                                                    </span>

                                                    <span>
                                                        {
                                                            appointment.appointment_time
                                                        }
                                                    </span>

                                                </div>

                                            </td>

                                            {/* REASON */}

                                            <td className="reason-cell">

                                                <span>
                                                    📝{" "}
                                                    {
                                                        appointment.reason
                                                    }
                                                </span>

                                            </td>

                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={`status-badge ${
                                                        appointment.status
                                                            ?.toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                "-"
                                                            )
                                                    }`}
                                                >

                                                    {appointment.status ===
                                                    "Confirmed"
                                                        ? "✅"
                                                        : appointment.status ===
                                                          "Pending"
                                                        ? "⏳"
                                                        : appointment.status ===
                                                          "Completed"
                                                        ? "✔️"
                                                        : "❌"}

                                                    {" "}

                                                    {
                                                        appointment.status
                                                    }

                                                </span>

                                            </td>

                                            {/* ACTIONS */}

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        type="button"
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            handleEdit(
                                                                appointment
                                                            )
                                                        }
                                                        title="Edit Appointment"
                                                    >
                                                        ✏️
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                appointment.id
                                                            )
                                                        }
                                                        title="Delete Appointment"
                                                    >
                                                        🗑️
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Appointments;
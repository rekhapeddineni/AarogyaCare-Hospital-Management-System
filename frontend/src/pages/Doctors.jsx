
import React, { useEffect, useState } from "react";
import "./Doctors.css";

const API_URL = "https://aarogyacare-backend.onrender.com/api/doctors/";

function Doctors() {
    const emptyForm = {
        doctor_id: "",
        doctor_name: "",
        specialization: "",
        qualification: "",
        experience: "",
        phone: "",
        email: "",
        address: "",
        department: "",
        joining_date: "",
    };

    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [showForm, setShowForm] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // =========================
    // FETCH DOCTORS
    // =========================

    const fetchDoctors = async () => {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch doctors");
            }

            const data = await response.json();

            setDoctors(data);
        } catch (error) {
            console.error("Fetch error:", error);

            setMessage(
                "❌ Cannot connect to Django. Make sure the backend is running."
            );
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =========================
    // OPEN ADD FORM
    // =========================

    const openAddForm = () => {
        setEditingDoctor(null);
        setFormData(emptyForm);
        setMessage("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================
    // EDIT DOCTOR
    // =========================

    const handleEdit = (doctor) => {
        console.log("Editing doctor:", doctor);

        setEditingDoctor(doctor);

        setFormData({
            doctor_id: doctor.doctor_id || "",
            doctor_name: doctor.doctor_name || "",
            specialization: doctor.specialization || "",
            qualification: doctor.qualification || "",
            experience: doctor.experience || "",
            phone: doctor.phone || "",
            email: doctor.email || "",
            address: doctor.address || "",
            department: doctor.department || "",
            joining_date: doctor.joining_date || "",
        });

        setMessage("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================
    // CLOSE FORM
    // =========================

    const closeForm = () => {
        setShowForm(false);
        setEditingDoctor(null);
        setFormData(emptyForm);
        setMessage("");
    };

    // =========================
    // ADD / UPDATE DOCTOR
    // =========================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            /*
             * IMPORTANT:
             * Django views.py contains:
             *
             * lookup_field = "doctor_id"
             *
             * Therefore UPDATE URL must use:
             *
             * /api/doctors/DOC001/
             *
             * NOT:
             *
             * /api/doctors/<mongo object id>/
             */

            const url = editingDoctor
                ? `${API_URL}${editingDoctor.doctor_id}/`
                : API_URL;

            const method = editingDoctor ? "PUT" : "POST";

            console.log("Request URL:", url);
            console.log("Request method:", method);
            console.log("Request data:", formData);

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            console.log("Server response:", data);

            if (!response.ok) {
                const errorMessage =
                    typeof data === "object"
                        ? Object.entries(data)
                              .map(
                                  ([field, errors]) =>
                                      `${field}: ${
                                          Array.isArray(errors)
                                              ? errors.join(", ")
                                              : errors
                                      }`
                              )
                              .join(" | ")
                        : "Unable to save doctor.";

                setMessage(`❌ ${errorMessage}`);

                return;
            }

            setMessage(
                editingDoctor
                    ? "✅ Doctor updated successfully!"
                    : "✅ Doctor added successfully!"
            );

            await fetchDoctors();

            setFormData(emptyForm);
            setEditingDoctor(null);
            setShowForm(false);
        } catch (error) {
            console.error("Connection error:", error);

            setMessage(
                "❌ Cannot connect to Django. Make sure the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // DELETE DOCTOR
    // =========================

    const handleDelete = async (doctor) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete Dr. ${doctor.doctor_name}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setMessage("");

            /*
             * IMPORTANT:
             * Django uses doctor_id as lookup field.
             *
             * Therefore DELETE must use:
             *
             * /api/doctors/DOC001/
             */

            const response = await fetch(
                `${API_URL}${doctor.doctor_id}/`,
                {
                    method: "DELETE",
                }
            );

            console.log(
                "Delete status:",
                response.status
            );

            if (!response.ok) {
                let errorData = {};

                try {
                    errorData = await response.json();
                } catch {
                    errorData = {};
                }

                console.error(
                    "Delete error:",
                    errorData
                );

                setMessage(
                    "❌ Failed to delete doctor."
                );

                return;
            }

            setMessage(
                "✅ Doctor deleted successfully!"
            );

            await fetchDoctors();

            /*
             * If the doctor being deleted is currently
             * being edited, close the form.
             *
             * Compare doctor_id because doctor_id is
             * our lookup field.
             */

            if (
                editingDoctor?.doctor_id ===
                doctor.doctor_id
            ) {
                closeForm();
            }
        } catch (error) {
            console.error(
                "Delete error:",
                error
            );

            setMessage(
                "❌ Cannot connect to Django. Make sure the backend is running."
            );
        }
    };

    return (
        <div className="doctors-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="doctors-header">

                <div>
                    <h1>
                        👨‍⚕️ Doctors Management
                    </h1>

                    <p>
                        Manage doctor information and
                        professional records
                    </p>
                </div>

                <button
                    className={`add-doctor-btn ${
                        showForm ? "active" : ""
                    }`}
                    onClick={
                        showForm
                            ? closeForm
                            : openAddForm
                    }
                >
                    <span>
                        {showForm ? "✕" : "➕"}
                    </span>

                    {showForm
                        ? "Close Form"
                        : "Add Doctor"}
                </button>

            </div>

            {/* =========================
                STATISTICS
            ========================= */}

            <div className="doctor-stat-card">

                <div className="doctor-stat-icon">
                    👨‍⚕️
                </div>

                <div>
                    <p>
                        Total Doctors
                    </p>

                    <h2>
                        {doctors.length}
                    </h2>
                </div>

            </div>

            {/* =========================
                MESSAGE
            ========================= */}

            {message && (
                <div
                    className={`doctor-message ${
                        message.includes(
                            "successfully"
                        )
                            ? "success"
                            : "error"
                    }`}
                >
                    {message}
                </div>
            )}

            {/* =========================
                ADD / EDIT FORM
            ========================= */}

            {showForm && (

                <div className="doctor-form-card">

                    <div className="doctor-form-header">

                        <h2>
                            {editingDoctor
                                ? "✏️ Edit Doctor"
                                : "👨‍⚕️ Add New Doctor"}
                        </h2>

                        <p>
                            {editingDoctor
                                ? "Update the doctor's information below"
                                : "Enter the doctor's professional details below"}
                        </p>

                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* =========================
                            PROFESSIONAL INFORMATION
                        ========================= */}

                        <div className="doctor-form-section">

                            <h3>
                                👨‍⚕️ Professional Information
                            </h3>

                            <div className="doctor-form-grid">

                                {/* DOCTOR ID */}

                                <div className="doctor-form-group">

                                    <label>
                                        🆔 Doctor ID
                                    </label>

                                    <input
                                        type="text"
                                        name="doctor_id"
                                        value={
                                            formData.doctor_id
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter doctor ID"
                                        required
                                    />

                                </div>

                                {/* DOCTOR NAME */}

                                <div className="doctor-form-group">

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

                                {/* SPECIALIZATION */}

                                <div className="doctor-form-group">

                                    <label>
                                        🩺 Specialization
                                    </label>

                                    <input
                                        type="text"
                                        name="specialization"
                                        value={
                                            formData.specialization
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Cardiologist"
                                        required
                                    />

                                </div>

                                {/* QUALIFICATION */}

                                <div className="doctor-form-group">

                                    <label>
                                        🎓 Qualification
                                    </label>

                                    <input
                                        type="text"
                                        name="qualification"
                                        value={
                                            formData.qualification
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. MBBS, MD"
                                        required
                                    />

                                </div>

                                {/* EXPERIENCE */}

                                <div className="doctor-form-group">

                                    <label>
                                        ⏳ Experience (Years)
                                    </label>

                                    <input
                                        type="number"
                                        name="experience"
                                        value={
                                            formData.experience
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter years"
                                        min="0"
                                        required
                                    />

                                </div>

                                {/* DEPARTMENT */}

                                <div className="doctor-form-group">

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

                            </div>

                        </div>

                        {/* =========================
                            CONTACT INFORMATION
                        ========================= */}

                        <div className="doctor-form-section">

                            <h3>
                                📞 Contact Information
                            </h3>

                            <div className="doctor-form-grid">

                                {/* PHONE */}

                                <div className="doctor-form-group">

                                    <label>
                                        📞 Phone
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={
                                            formData.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter phone number"
                                        required
                                    />

                                </div>

                                {/* EMAIL */}

                                <div className="doctor-form-group">

                                    <label>
                                        ✉️ Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter email address"
                                        required
                                    />

                                </div>

                                {/* ADDRESS */}

                                <div className="doctor-form-group full-width">

                                    <label>
                                        🏠 Address
                                    </label>

                                    <input
                                        type="text"
                                        name="address"
                                        value={
                                            formData.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter address"
                                        required
                                    />

                                </div>

                            </div>

                        </div>

                        {/* =========================
                            JOINING INFORMATION
                        ========================= */}

                        <div className="doctor-form-section">

                            <h3>
                                📅 Joining Information
                            </h3>

                            <div className="doctor-form-grid">

                                <div className="doctor-form-group">

                                    <label>
                                        📅 Joining Date
                                    </label>

                                    <input
                                        type="date"
                                        name="joining_date"
                                        value={
                                            formData.joining_date
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                            </div>

                        </div>

                        {/* =========================
                            BUTTONS
                        ========================= */}

                        <div className="doctor-form-actions">

                            <button
                                type="button"
                                className="doctor-cancel-btn"
                                onClick={closeForm}
                            >
                                ✕ Cancel
                            </button>

                            <button
                                type="submit"
                                className="doctor-save-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "⏳ Saving..."
                                    : editingDoctor
                                    ? "✏️ Update Doctor"
                                    : "💾 Save Doctor"}
                            </button>

                        </div>

                    </form>

                </div>

            )}

            {/* =========================
                DOCTOR TABLE
            ========================= */}

            <div className="doctor-table-card">

                <div className="doctor-table-header">

                    <div>

                        <h2>
                            👨‍⚕️ Doctor Records
                        </h2>

                        <p>
                            Registered doctors in the
                            hospital
                        </p>

                    </div>

                    <span className="doctor-record-count">
                        {doctors.length} Records
                    </span>

                </div>

                {/* =========================
                    EMPTY STATE
                ========================= */}

                {doctors.length === 0 ? (

                    <div className="doctor-empty-state">

                        <div>
                            👨‍⚕️
                        </div>

                        <h3>
                            No doctors found
                        </h3>

                        <p>
                            Add your first doctor to
                            get started.
                        </p>

                    </div>

                ) : (

                    <div className="doctor-table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        👨‍⚕️ Doctor
                                    </th>

                                    <th>
                                        🩺 Specialization
                                    </th>

                                    <th>
                                        🎓 Qualification
                                    </th>

                                    <th>
                                        ⏳ Experience
                                    </th>

                                    <th>
                                        📞 Phone
                                    </th>

                                    <th>
                                        🏥 Department
                                    </th>

                                    <th>
                                        📅 Joining Date
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {doctors.map(
                                    (doctor) => (

                                        <tr
                                            key={
                                                doctor.doctor_id
                                            }
                                        >

                                            {/* ID */}

                                            <td>

                                                <span className="doctor-id-badge">
                                                    {
                                                        doctor.doctor_id
                                                    }
                                                </span>

                                            </td>

                                            {/* DOCTOR */}

                                            <td>

                                                <div className="doctor-name">

                                                    <div className="doctor-avatar">
                                                        👨‍⚕️
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            Dr.{" "}
                                                            {
                                                                doctor.doctor_name
                                                            }
                                                        </strong>

                                                        <small>
                                                            ✉️{" "}
                                                            {
                                                                doctor.email
                                                            }
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* SPECIALIZATION */}

                                            <td>

                                                <span className="specialization-badge">

                                                    🩺{" "}
                                                    {
                                                        doctor.specialization
                                                    }

                                                </span>

                                            </td>

                                            {/* QUALIFICATION */}

                                            <td>

                                                🎓{" "}
                                                {
                                                    doctor.qualification
                                                }

                                            </td>

                                            {/* EXPERIENCE */}

                                            <td>

                                                <span className="experience-badge">

                                                    ⏳{" "}
                                                    {
                                                        doctor.experience
                                                    }{" "}
                                                    years

                                                </span>

                                            </td>

                                            {/* PHONE */}

                                            <td>

                                                📞{" "}
                                                {
                                                    doctor.phone
                                                }

                                            </td>

                                            {/* DEPARTMENT */}

                                            <td>

                                                🏥{" "}
                                                {
                                                    doctor.department
                                                }

                                            </td>

                                            {/* JOINING DATE */}

                                            <td>

                                                📅{" "}
                                                {
                                                    doctor.joining_date
                                                }

                                            </td>

                                            {/* ACTIONS */}

                                            <td>

                                                <div className="doctor-actions">

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        className="doctor-edit-btn"
                                                        onClick={() =>
                                                            handleEdit(
                                                                doctor
                                                            )
                                                        }
                                                        title="Edit Doctor"
                                                    >
                                                        ✏️
                                                    </button>

                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        className="doctor-delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                doctor
                                                            )
                                                        }
                                                        title="Delete Doctor"
                                                    >
                                                        🗑️
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Doctors;


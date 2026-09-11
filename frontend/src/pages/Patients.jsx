
import React, { useEffect, useState } from "react";
import "./Patients.css";

const API_URL = "https://aarogyacare-backend.onrender.com/api/patients/";

function Patients() {
    const emptyForm = {
        patient_id: "",
        first_name: "",
        last_name: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        blood_group: "",
        address: "",
        disease: "",
        doctor_name: "",
        admission_date: "",
    };

    const [patients, setPatients] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState(emptyForm);

    // =====================================================
    // FETCH PATIENTS
    // =====================================================

    const fetchPatients = async () => {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch patients");
            }

            const data = await response.json();

            console.log("Patients:", data);

            setPatients(data);
        } catch (error) {
            console.error("Fetch error:", error);

            setMessage(
                "❌ Cannot connect to Django. Make sure the backend is running."
            );
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // OPEN ADD FORM
    // =====================================================

    const openAddForm = () => {
        setEditingPatient(null);
        setFormData(emptyForm);
        setMessage("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =====================================================
    // EDIT PATIENT
    // =====================================================

    const handleEdit = (patient) => {
        console.log("Editing patient:", patient);

        setEditingPatient(patient);

        setFormData({
            patient_id: patient.patient_id || "",
            first_name: patient.first_name || "",
            last_name: patient.last_name || "",
            age: patient.age ?? "",
            gender: patient.gender || "",
            phone: patient.phone || "",
            email: patient.email || "",
            blood_group: patient.blood_group || "",
            address: patient.address || "",
            disease: patient.disease || "",
            doctor_name: patient.doctor_name || "",
            admission_date: patient.admission_date || "",
        });

        setMessage("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {
        setShowForm(false);
        setEditingPatient(null);
        setFormData(emptyForm);
        setMessage("");
    };

    // =====================================================
    // ADD / UPDATE PATIENT
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            // IMPORTANT:
            // Backend uses lookup_field = "patient_id"
            // Therefore UPDATE uses PAT001 instead of Mongo ObjectId.

            const url = editingPatient
                ? `${API_URL}${editingPatient.patient_id}/`
                : API_URL;

            const method = editingPatient ? "PUT" : "POST";

            console.log("Request URL:", url);
            console.log("Request Method:", method);

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
                              .map(([field, errors]) => {
                                  const errorText = Array.isArray(errors)
                                      ? errors.join(", ")
                                      : errors;

                                  return `${field}: ${errorText}`;
                              })
                              .join(" | ")
                        : "Unable to save patient.";

                setMessage(`❌ ${errorMessage}`);

                return;
            }

            if (editingPatient) {
                setMessage("✅ Patient updated successfully!");
            } else {
                setMessage("✅ Patient added successfully!");
            }

            await fetchPatients();

            setFormData(emptyForm);
            setEditingPatient(null);
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

    // =====================================================
    // DELETE PATIENT
    // =====================================================

    const handleDelete = async (patient) => {
        const patientName =
            `${patient.first_name || ""} ${patient.last_name || ""}`.trim();

        const confirmed = window.confirm(
            `Are you sure you want to delete ${patientName || patient.patient_id}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setMessage("");

            // IMPORTANT:
            // Backend uses lookup_field = "patient_id"
            // Therefore DELETE uses PAT001.

            const url = `${API_URL}${patient.patient_id}/`;

            console.log("Delete URL:", url);

            const response = await fetch(url, {
                method: "DELETE",
            });

            if (!response.ok) {
                let data = {};

                try {
                    data = await response.json();
                } catch {
                    data = {};
                }

                console.error("Delete error:", data);

                setMessage("❌ Failed to delete patient.");

                return;
            }

            setMessage("✅ Patient deleted successfully!");

            await fetchPatients();

            if (
                editingPatient &&
                editingPatient.patient_id === patient.patient_id
            ) {
                closeForm();
            }
        } catch (error) {
            console.error("Delete connection error:", error);

            setMessage(
                "❌ Cannot connect to Django. Make sure the backend is running."
            );
        }
    };

    return (
        <div className="patients-page">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div className="patients-page-header">

                <div>
                    <h1>👤 Patients Management</h1>

                    <p>
                        Manage patient information and medical records
                    </p>
                </div>

                <button
                    className={`add-patient-btn ${
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
                        : "Add Patient"}
                </button>

            </div>

            {/* =====================================================
                TOTAL PATIENTS
            ===================================================== */}

            <div className="patient-stat-card">

                <div className="stat-icon">
                    👤
                </div>

                <div>
                    <p>Total Patients</p>

                    <h2>
                        {patients.length}
                    </h2>
                </div>

            </div>

            {/* =====================================================
                MESSAGE
            ===================================================== */}

            {message && (
                <div
                    className={`patient-message ${
                        message.includes("successfully")
                            ? "success"
                            : "error"
                    }`}
                >
                    {message}
                </div>
            )}

            {/* =====================================================
                ADD / EDIT FORM
            ===================================================== */}

            {showForm && (
                <div className="patient-form-card">

                    <div className="form-header">

                        <div>

                            <h2>
                                {editingPatient
                                    ? "✏️ Edit Patient"
                                    : "👤 Add New Patient"}
                            </h2>

                            <p>
                                {editingPatient
                                    ? "Update the patient's information below"
                                    : "Enter the patient's details below"}
                            </p>

                        </div>

                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* =================================================
                            PERSONAL INFORMATION
                        ================================================= */}

                        <div className="form-section">

                            <h3>
                                👤 Personal Information
                            </h3>

                            <div className="form-grid">

                                {/* Patient ID */}

                                <div className="form-group">

                                    <label>
                                        🆔 Patient ID
                                    </label>

                                    <input
                                        type="text"
                                        name="patient_id"
                                        value={formData.patient_id}
                                        onChange={handleChange}
                                        placeholder="Enter patient ID"
                                        required
                                    />

                                </div>

                                {/* First Name */}

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

                                {/* Last Name */}

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

                                {/* Age */}

                                <div className="form-group">

                                    <label>
                                        🎂 Age
                                    </label>

                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="Enter age"
                                        min="0"
                                        required
                                    />

                                </div>

                                {/* Gender */}

                                <div className="form-group">

                                    <label>
                                        ⚧️ Gender
                                    </label>

                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select gender
                                        </option>

                                        <option value="male">
                                            Male
                                        </option>

                                        <option value="female">
                                            Female
                                        </option>

                                        <option value="other">
                                            Other
                                        </option>

                                    </select>

                                </div>

                                {/* Blood Group */}

                                <div className="form-group">

                                    <label>
                                        🩸 Blood Group
                                    </label>

                                    <select
                                        name="blood_group"
                                        value={formData.blood_group}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select blood group
                                        </option>

                                        <option value="a+">
                                            A+
                                        </option>

                                        <option value="a-">
                                            A-
                                        </option>

                                        <option value="b+">
                                            B+
                                        </option>

                                        <option value="b-">
                                            B-
                                        </option>

                                        <option value="ab+">
                                            AB+
                                        </option>

                                        <option value="ab-">
                                            AB-
                                        </option>

                                        <option value="o+">
                                            O+
                                        </option>

                                        <option value="o-">
                                            O-
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            CONTACT INFORMATION
                        ================================================= */}

                        <div className="form-section">

                            <h3>
                                📞 Contact Information
                            </h3>

                            <div className="form-grid">

                                {/* Phone */}

                                <div className="form-group">

                                    <label>
                                        📞 Phone
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

                                {/* Email */}

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

                                {/* Address */}

                                <div className="form-group full-width">

                                    <label>
                                        🏠 Address
                                    </label>

                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter address"
                                        required
                                    />

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            MEDICAL INFORMATION
                        ================================================= */}

                        <div className="form-section">

                            <h3>
                                🏥 Medical Information
                            </h3>

                            <div className="form-grid">

                                {/* Disease */}

                                <div className="form-group">

                                    <label>
                                        🩺 Disease
                                    </label>

                                    <input
                                        type="text"
                                        name="disease"
                                        value={formData.disease}
                                        onChange={handleChange}
                                        placeholder="Enter disease"
                                        required
                                    />

                                </div>

                                {/* Doctor */}

                                <div className="form-group">

                                    <label>
                                        👨‍⚕️ Doctor Name
                                    </label>

                                    <input
                                        type="text"
                                        name="doctor_name"
                                        value={formData.doctor_name}
                                        onChange={handleChange}
                                        placeholder="Enter doctor name"
                                        required
                                    />

                                </div>

                                {/* Admission Date */}

                                <div className="form-group">

                                    <label>
                                        📅 Admission Date
                                    </label>

                                    <input
                                        type="date"
                                        name="admission_date"
                                        value={formData.admission_date}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            FORM BUTTONS
                        ================================================= */}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={closeForm}
                            >
                                ✕ Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-patient-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "⏳ Saving..."
                                    : editingPatient
                                    ? "✏️ Update Patient"
                                    : "💾 Save Patient"}
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* =====================================================
                PATIENT TABLE
            ===================================================== */}

            <div className="patient-table-card">

                <div className="table-header">

                    <div>

                        <h2>
                            👤 Patient Records
                        </h2>

                        <p>
                            Registered patients in the hospital
                        </p>

                    </div>

                    <span className="record-count">
                        {patients.length} Records
                    </span>

                </div>

                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {patients.length === 0 ? (

                    <div className="empty-state">

                        <div>
                            👤
                        </div>

                        <h3>
                            No patients found
                        </h3>

                        <p>
                            Add your first patient to get started.
                        </p>

                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>
                                        👤 Patient
                                    </th>

                                    <th>
                                        🎂 Age
                                    </th>

                                    <th>
                                        ⚧️ Gender
                                    </th>

                                    <th>
                                        📞 Phone
                                    </th>

                                    <th>
                                        🩸 Blood Group
                                    </th>

                                    <th>
                                        🩺 Disease
                                    </th>

                                    <th>
                                        👨‍⚕️ Doctor
                                    </th>

                                    <th>
                                        📅 Admission
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {patients.map((patient) => (

                                    <tr
                                        key={
                                            patient.id ||
                                            patient.patient_id
                                        }
                                    >

                                        {/* PATIENT ID */}

                                        <td>
                                            {patient.patient_id}
                                        </td>

                                        {/* PATIENT NAME */}

                                        <td>

                                            <div className="patient-name">

                                                <div className="patient-avatar">
                                                    👤
                                                </div>

                                                <div>

                                                    <strong>
                                                        {patient.first_name}{" "}
                                                        {patient.last_name}
                                                    </strong>

                                                    <small>
                                                        ✉️{" "}
                                                        {patient.email}
                                                    </small>

                                                </div>

                                            </div>

                                        </td>

                                        {/* AGE */}

                                        <td>
                                            🎂 {patient.age}
                                        </td>

                                        {/* GENDER */}

                                        <td>

                                            <span className="gender-badge">
                                                ⚧️{" "}
                                                {patient.gender}
                                            </span>

                                        </td>

                                        {/* PHONE */}

                                        <td>
                                            📞 {patient.phone}
                                        </td>

                                        {/* BLOOD GROUP */}

                                        <td>

                                            <span className="blood-badge">
                                                🩸{" "}
                                                {patient.blood_group}
                                            </span>

                                        </td>

                                        {/* DISEASE */}

                                        <td>
                                            🩺 {patient.disease}
                                        </td>

                                        {/* DOCTOR */}

                                        <td>
                                            👨‍⚕️{" "}
                                            {patient.doctor_name}
                                        </td>

                                        {/* ADMISSION DATE */}

                                        <td>
                                            📅{" "}
                                            {patient.admission_date}
                                        </td>

                                        {/* ACTIONS */}

                                        <td>

                                            <div className="patient-actions">

                                                <button
                                                    type="button"
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        handleEdit(
                                                            patient
                                                        )
                                                    }
                                                    title="Edit Patient"
                                                >
                                                    ✏️
                                                </button>

                                                <button
                                                    type="button"
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            patient
                                                        )
                                                    }
                                                    title="Delete Patient"
                                                >
                                                    🗑️
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Patients;


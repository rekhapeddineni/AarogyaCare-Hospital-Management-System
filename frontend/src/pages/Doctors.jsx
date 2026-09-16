import React, { useEffect, useState } from "react";
import "./Doctors.css";

const API_URL =
    "https://aarogyacare-backend.onrender.com/api/doctors/";

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
    keywords: "",
    joining_date: "",
};

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const loadDoctors = async () => {
        try {
            setLoading(true);

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to load doctors");
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                setDoctors(data);
            } else if (Array.isArray(data.results)) {
                setDoctors(data.results);
            } else {
                setDoctors([]);
            }
        } catch (error) {
            console.error(error);
            setMessage("Unable to load doctors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDoctors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleAdd = () => {
        setFormData(emptyForm);
        setEditingId(null);
        setShowForm(true);
        setMessage("");
    };

    const handleEdit = (doctor) => {
        setFormData({
            doctor_id: doctor.doctor_id || "",
            doctor_name: doctor.doctor_name || "",
            specialization: doctor.specialization || "",
            qualification: doctor.qualification || "",
            experience: doctor.experience ?? "",
            phone: doctor.phone || "",
            email: doctor.email || "",
            address: doctor.address || "",
            department: doctor.department || "",
            keywords: doctor.keywords || "",
            joining_date: doctor.joining_date || "",
        });

        setEditingId(doctor.doctor_id);
        setShowForm(true);
        setMessage("");
    };

    const handleDelete = async (doctorId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this doctor?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}${doctorId}/`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            setMessage(
                "✓ Doctor record has been deleted successfully."
            );

            await loadDoctors();
        } catch (error) {
            console.error(error);
            setMessage("Unable to delete doctor");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const dataToSend = {
                ...formData,
                experience:
                    formData.experience === ""
                        ? null
                        : Number(formData.experience),
            };

            let response;

            if (editingId) {
                response = await fetch(
                    `${API_URL}${editingId}/`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(dataToSend),
                    }
                );
            } else {
                response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSend),
                });
            }

            if (!response.ok) {
                const errorData = await response
                    .json()
                    .catch(() => null);

                console.error("Backend error:", errorData);

                throw new Error("Save failed");
            }

            setMessage(
                editingId
                    ? "✓ Doctor profile has been updated successfully."
                    : "✓ Doctor profile has been added successfully."
            );

            setFormData(emptyForm);
            setEditingId(null);
            setShowForm(false);

            await loadDoctors();
        } catch (error) {
            console.error(error);
            setMessage("Unable to save doctor");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(emptyForm);
        setEditingId(null);
        setShowForm(false);
        setMessage("");
    };

    const displayDoctorName = (name) => {
        if (!name) {
            return "";
        }

        if (name.toLowerCase().startsWith("dr.")) {
            return name;
        }

        return `Dr. ${name}`;
    };

    const totalDoctors = doctors.length;

    const departmentCount = new Set(
        doctors
            .map((doctor) => doctor.department)
            .filter(Boolean)
    ).size;

    const experiencedDoctors = doctors.filter(
        (doctor) => Number(doctor.experience || 0) >= 5
    ).length;

    return (
        <div className="doctors-page">

            <div className="doctors-header">
                <div>
                    <h1>Doctors</h1>
                    <p>
                        Manage doctors and their professional information
                    </p>
                </div>

                <button
                    className="add-doctor-btn"
                    onClick={handleAdd}
                >
                    ➕ Add Doctor
                </button>
            </div>

            {message && (
                <div className="doctor-message">
                    {message}
                </div>
            )}

            <div className="doctor-stats">

                <div className="doctor-stat-card">
                    <div className="doctor-stat-icon">
                        👨‍⚕️
                    </div>

                    <div>
                        <h3>{totalDoctors}</h3>
                        <p>Total Doctors</p>
                    </div>
                </div>

                <div className="doctor-stat-card">
                    <div className="doctor-stat-icon">
                        🏥
                    </div>

                    <div>
                        <h3>{departmentCount}</h3>
                        <p>Departments</p>
                    </div>
                </div>

                <div className="doctor-stat-card">
                    <div className="doctor-stat-icon">
                        ⭐
                    </div>

                    <div>
                        <h3>{experiencedDoctors}</h3>
                        <p>Experienced Doctors</p>
                    </div>
                </div>

            </div>

            {showForm && (
                <div className="doctor-form-card">

                    <div className="doctor-form-header">
                        <div>
                            <h2>
                                {editingId
                                    ? "Edit Doctor"
                                    : "Add Doctor"}
                            </h2>

                            <p>
                                Enter doctor information below
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="doctor-form-section">

                            <h3>Basic Information</h3>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>Doctor ID</label>

                                    <input
                                        type="text"
                                        name="doctor_id"
                                        value={formData.doctor_id}
                                        onChange={handleChange}
                                        placeholder="DOC001"
                                        required
                                        disabled={!!editingId}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Doctor Name</label>

                                    <input
                                        type="text"
                                        name="doctor_name"
                                        value={formData.doctor_name}
                                        onChange={handleChange}
                                        placeholder="Dr. Sreelakshmi Rao"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Specialization</label>

                                    <input
                                        type="text"
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        placeholder="Cardiology"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Qualification</label>

                                    <input
                                        type="text"
                                        name="qualification"
                                        value={formData.qualification}
                                        onChange={handleChange}
                                        placeholder="MBBS MD"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Experience</label>

                                    <input
                                        type="number"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        placeholder="10"
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Department</label>

                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        placeholder="Cardiology"
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="doctor-form-section">

                            <h3>Contact Information</h3>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>Phone</label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="9876543210"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email</label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="doctor@gmail.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Address</label>

                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Hyderabad, Telangana"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Joining Date</label>

                                    <input
                                        type="date"
                                        name="joining_date"
                                        value={formData.joining_date}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="doctor-form-section">

                            <h3>Chatbot Keywords</h3>

                            <div className="form-group">

                                <label>Keywords</label>

                                <input
                                    type="text"
                                    name="keywords"
                                    value={formData.keywords}
                                    onChange={handleChange}
                                    placeholder="heart, cardiac, chest pain"
                                />

                                <small>
                                    Enter symptoms or diseases separated
                                    by commas.
                                </small>

                            </div>
                        </div>

                        <div className="form-actions">

                            <button
                                type="submit"
                                className="save-doctor-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : editingId
                                    ? "✓ Update Doctor"
                                    : "✓ Save Doctor"}
                            </button>

                            <button
                                type="button"
                                className="cancel-doctor-btn"
                                onClick={handleCancel}
                            >
                                ✕ Cancel
                            </button>

                        </div>

                    </form>
                </div>
            )}

            <div className="doctor-table-card">

                <div className="doctor-table-header">

                    <div>
                        <h2>Doctor Records</h2>

                        <p>
                            Registered doctors in the hospital
                        </p>
                    </div>

                    <span>
                        {doctors.length} Records
                    </span>

                </div>

                <div className="doctor-table-container">

                    {loading && doctors.length === 0 ? (

                        <div className="doctor-message">
                            Loading doctors...
                        </div>

                    ) : (

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Doctor</th>
                                    <th>Specialization</th>
                                    <th>Qualification</th>
                                    <th>Experience</th>
                                    <th>Department</th>
                                    <th>Contact</th>
                                    <th>Joining Date</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {doctors.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="9"
                                            style={{
                                                textAlign: "center",
                                                padding: "30px",
                                            }}
                                        >
                                            No doctors found
                                        </td>

                                    </tr>

                                ) : (

                                    doctors.map((doctor) => (

                                        <tr
                                            key={doctor.doctor_id}
                                        >

                                            <td>
                                                <strong>
                                                    {doctor.doctor_id}
                                                </strong>
                                            </td>

                                            <td>

                                                <div className="doctor-name">

                                                    <div className="doctor-avatar">
                                                        👨‍⚕️
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {displayDoctorName(
                                                                doctor.doctor_name
                                                            )}
                                                        </strong>

                                                        <small>
                                                            ✉️{" "}
                                                            {doctor.email}
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>

                                            <td>
                                                🩺{" "}
                                                {doctor.specialization}
                                            </td>

                                            <td>
                                                🎓{" "}
                                                {doctor.qualification}
                                            </td>

                                            <td>
                                                ⏳{" "}
                                                {doctor.experience} years
                                            </td>

                                            <td>
                                                🏥{" "}
                                                {doctor.department}
                                            </td>

                                            <td>
                                                📞{" "}
                                                {doctor.phone}
                                            </td>

                                            <td>
                                                📅{" "}
                                                {doctor.joining_date}
                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        type="button"
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            handleEdit(
                                                                doctor
                                                            )
                                                        }
                                                        title="Edit Doctor"
                                                    >
                                                        ✏️
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                doctor.doctor_id
                                                            )
                                                        }
                                                        title="Delete Doctor"
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

                    )}

                </div>

            </div>

        </div>
    );
}

export default Doctors;
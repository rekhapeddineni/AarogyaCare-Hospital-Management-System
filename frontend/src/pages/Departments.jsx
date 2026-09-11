
import React, { useEffect, useState } from "react";
import "./Departments.css";

const API_URL = "https://aarogyacare-backend.onrender.com/api/departments/";

function Departments() {
    const emptyForm = {
        department_id: "",
        department_name: "",
        head_of_department: "",
        phone: "",
        location: "",
        description: "",
    };

    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [showForm, setShowForm] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // =========================
    // FETCH DEPARTMENTS
    // =========================

    const fetchDepartments = async () => {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch departments");
            }

            const data = await response.json();

            setDepartments(data);
        } catch (error) {
            console.error("Fetch error:", error);

            setMessage(
                "❌ Cannot connect to Django. Make sure the backend is running."
            );
        }
    };

    useEffect(() => {
        fetchDepartments();
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
        setEditingDepartment(null);
        setFormData(emptyForm);
        setMessage("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================
    // EDIT DEPARTMENT
    // =========================

    const handleEdit = (department) => {
        console.log("Editing department:", department);

        setEditingDepartment(department);

        setFormData({
            department_id: department.department_id || "",
            department_name: department.department_name || "",
            head_of_department:
                department.head_of_department || "",
            phone: department.phone || "",
            location: department.location || "",
            description: department.description || "",
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
        setEditingDepartment(null);
        setFormData(emptyForm);
        setMessage("");
    };

    // =========================
    // ADD / UPDATE DEPARTMENT
    // =========================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            /*
             * IMPORTANT:
             * Department backend does NOT contain:
             *
             * lookup_field = "department_id"
             *
             * Therefore Django uses its default "id"
             * for UPDATE.
             *
             * Example:
             *
             * /api/departments/65abc123.../
             */

            const url = editingDepartment
                ? `${API_URL}${editingDepartment.id}/`
                : API_URL;

            const method = editingDepartment ? "PUT" : "POST";

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
                        : "Unable to save department.";

                setMessage(`❌ ${errorMessage}`);

                return;
            }

            setMessage(
                editingDepartment
                    ? "✅ Department updated successfully!"
                    : "✅ Department added successfully!"
            );

            await fetchDepartments();

            setFormData(emptyForm);
            setEditingDepartment(null);
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
    // DELETE DEPARTMENT
    // =========================

    const handleDelete = async (department) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${department.department_name}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setMessage("");

            /*
             * IMPORTANT:
             * Django uses default "id" lookup.
             *
             * Therefore DELETE must use:
             *
             * /api/departments/<id>/
             */

            const response = await fetch(
                `${API_URL}${department.id}/`,
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
                    "❌ Failed to delete department."
                );

                return;
            }

            setMessage(
                "✅ Department deleted successfully!"
            );

            await fetchDepartments();

            /*
             * If the department being deleted is currently
             * being edited, close the form.
             */

            if (
                editingDepartment?.id ===
                department.id
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
        <div className="departments-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="departments-header">

                <div>

                    <h1>
                        🏥 Departments Management
                    </h1>

                    <p>
                        Manage hospital departments and
                        organizational records
                    </p>

                </div>

                <button
                    className={`add-department-btn ${
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
                        : "Add Department"}

                </button>

            </div>

            {/* =========================
                STATISTICS
            ========================= */}

            <div className="department-stat-card">

                <div className="department-stat-icon">
                    🏥
                </div>

                <div>

                    <p>
                        Total Departments
                    </p>

                    <h2>
                        {departments.length}
                    </h2>

                </div>

            </div>

            {/* =========================
                MESSAGE
            ========================= */}

            {message && (

                <div
                    className={`department-message ${
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

                <div className="department-form-card">

                    <div className="department-form-header">

                        <h2>
                            {editingDepartment
                                ? "✏️ Edit Department"
                                : "🏥 Add New Department"}
                        </h2>

                        <p>
                            {editingDepartment
                                ? "Update the department information below"
                                : "Enter the department details below"}
                        </p>

                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* =========================
                            DEPARTMENT INFORMATION
                        ========================= */}

                        <div className="department-form-section">

                            <h3>
                                🏥 Department Information
                            </h3>

                            <div className="department-form-grid">

                                {/* DEPARTMENT ID */}

                                <div className="department-form-group">

                                    <label>
                                        🆔 Department ID
                                    </label>

                                    <input
                                        type="text"
                                        name="department_id"
                                        value={
                                            formData.department_id
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter department ID"
                                        required
                                    />

                                </div>

                                {/* DEPARTMENT NAME */}

                                <div className="department-form-group">

                                    <label>
                                        🏥 Department Name
                                    </label>

                                    <input
                                        type="text"
                                        name="department_name"
                                        value={
                                            formData.department_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Cardiology"
                                        required
                                    />

                                </div>

                                {/* HEAD OF DEPARTMENT */}

                                <div className="department-form-group">

                                    <label>
                                        👨‍⚕️ Head of Department
                                    </label>

                                    <input
                                        type="text"
                                        name="head_of_department"
                                        value={
                                            formData.head_of_department
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter department head"
                                        required
                                    />

                                </div>

                                {/* LOCATION */}

                                <div className="department-form-group">

                                    <label>
                                        📍 Location
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={
                                            formData.location
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. First Floor"
                                        required
                                    />

                                </div>

                            </div>

                        </div>

                        {/* =========================
                            CONTACT INFORMATION
                        ========================= */}

                        <div className="department-form-section">

                            <h3>
                                📞 Contact Information
                            </h3>

                            <div className="department-form-grid">

                                {/* PHONE */}

                                <div className="department-form-group">

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

                            </div>

                        </div>

                        {/* =========================
                            DESCRIPTION
                        ========================= */}

                        <div className="department-form-section">

                            <h3>
                                📝 Department Description
                            </h3>

                            <div className="department-form-grid">

                                <div className="department-form-group full-width">

                                    <label>
                                        📝 Description
                                    </label>

                                    <input
                                        type="text"
                                        name="description"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter department description"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* =========================
                            BUTTONS
                        ========================= */}

                        <div className="department-form-actions">

                            <button
                                type="button"
                                className="department-cancel-btn"
                                onClick={closeForm}
                            >
                                ✕ Cancel
                            </button>

                            <button
                                type="submit"
                                className="department-save-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "⏳ Saving..."
                                    : editingDepartment
                                    ? "✏️ Update Department"
                                    : "💾 Save Department"}
                            </button>

                        </div>

                    </form>

                </div>

            )}

            {/* =========================
                DEPARTMENT TABLE
            ========================= */}

            <div className="department-table-card">

                <div className="department-table-header">

                    <div>

                        <h2>
                            🏥 Department Records
                        </h2>

                        <p>
                            Registered departments in the
                            hospital
                        </p>

                    </div>

                    <span className="department-record-count">
                        {departments.length} Records
                    </span>

                </div>

                {/* =========================
                    EMPTY STATE
                ========================= */}

                {departments.length === 0 ? (

                    <div className="department-empty-state">

                        <div>
                            🏥
                        </div>

                        <h3>
                            No departments found
                        </h3>

                        <p>
                            Add your first department to
                            get started.
                        </p>

                    </div>

                ) : (

                    <div className="department-table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        🏥 Department
                                    </th>

                                    <th>
                                        👨‍⚕️ Head
                                    </th>

                                    <th>
                                        📞 Phone
                                    </th>

                                    <th>
                                        📍 Location
                                    </th>

                                    <th>
                                        📝 Description
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {departments.map(
                                    (department) => (

                                        <tr
                                            key={
                                                department.id
                                            }
                                        >

                                            {/* ID */}

                                            <td>

                                                <span className="department-id-badge">

                                                    {
                                                        department.department_id
                                                    }

                                                </span>

                                            </td>

                                            {/* DEPARTMENT */}

                                            <td>

                                                <div className="department-name">

                                                    <div className="department-avatar">
                                                        🏥
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                department.department_name
                                                            }
                                                        </strong>

                                                        <small>
                                                            📝 Department
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* HEAD */}

                                            <td>

                                                <span className="department-head-badge">

                                                    👨‍⚕️{" "}
                                                    {
                                                        department.head_of_department
                                                    }

                                                </span>

                                            </td>

                                            {/* PHONE */}

                                            <td>

                                                📞{" "}
                                                {
                                                    department.phone
                                                }

                                            </td>

                                            {/* LOCATION */}

                                            <td>

                                                <span className="department-location-badge">

                                                    📍{" "}
                                                    {
                                                        department.location
                                                    }

                                                </span>

                                            </td>

                                            {/* DESCRIPTION */}

                                            <td>

                                                📝{" "}
                                                {
                                                    department.description
                                                }

                                            </td>

                                            {/* ACTIONS */}

                                            <td>

                                                <div className="department-actions">

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        className="department-edit-btn"
                                                        onClick={() =>
                                                            handleEdit(
                                                                department
                                                            )
                                                        }
                                                        title="Edit Department"
                                                    >
                                                        ✏️
                                                    </button>

                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        className="department-delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                department
                                                            )
                                                        }
                                                        title="Delete Department"
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

export default Departments;


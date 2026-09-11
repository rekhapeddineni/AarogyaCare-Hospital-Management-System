import React, { useEffect, useState } from "react";
import "./Admissions.css";

// =========================================================
// API URLS
// =========================================================

const ADMISSIONS_API =
    "http://127.0.0.1:8000/api/admissions/admissions/";

const PATIENTS_API =
    "http://127.0.0.1:8000/api/patients/";


// =========================================================
// EMPTY FORM
// =========================================================

const emptyForm = {
    patient: "",
    doctor: "",
    admission_date: "",
    discharge_date: "",
    room_number: "",
    bed_number: "",
    admission_type: "",
    status: "Admitted",
    reason: "",
    notes: "",
};


// =========================================================
// COMPONENT
// =========================================================

function Admissions() {

    const [admissions, setAdmissions] =
        useState([]);

    const [patients, setPatients] =
        useState([]);

    const [showForm, setShowForm] =
        useState(false);

    const [editingAdmission, setEditingAdmission] =
        useState(null);

    const [formData, setFormData] =
        useState(emptyForm);

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");


    // =====================================================
    // FETCH ADMISSIONS
    // =====================================================

    const fetchAdmissions = async () => {

        try {

            const response =
                await fetch(ADMISSIONS_API);

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch admissions"
                );
            }

            const data =
                await response.json();

            console.log(
                "Admissions:",
                data
            );

            setAdmissions(data);

        } catch (error) {

            console.error(
                "Admissions error:",
                error
            );

            setMessage(
                "❌ Unable to load admissions."
            );
        }
    };


    // =====================================================
    // FETCH PATIENTS
    // =====================================================

    const fetchPatients = async () => {

        try {

            const response =
                await fetch(PATIENTS_API);

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch patients"
                );
            }

            const data =
                await response.json();

            setPatients(data);

        } catch (error) {

            console.error(
                "Patients error:",
                error
            );

            setMessage(
                "❌ Unable to load patients."
            );
        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchAdmissions();
        fetchPatients();

    }, []);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(
            previous => ({
                ...previous,
                [name]: value
            })
        );
    };


    // =====================================================
    // GET PATIENT NAME
    // =====================================================

    const getPatientName = (admission) => {

        if (!admission.patient_details) {

            if (!admission.patient) {

                return "Patient not assigned";
            }

            return "Patient information unavailable";
        }


        const firstName =
            String(
                admission.patient_details.first_name || ""
            ).trim();


        const lastName =
            String(
                admission.patient_details.last_name || ""
            ).trim();


        if (!firstName && !lastName) {

            return "Patient";
        }


        if (!lastName) {

            return firstName;
        }


        if (!firstName) {

            return lastName;
        }


        // =============================================
        // FIX:
        //
        // Rahul Kumar + Kumar
        //
        // becomes:
        //
        // Rahul Kumar
        // =============================================

        if (
            firstName
                .toLowerCase()
                .endsWith(
                    ` ${lastName.toLowerCase()}`
                )
        ) {

            return firstName;
        }


        return `${firstName} ${lastName}`;
    };


    // =====================================================
    // GET PATIENT ID
    // =====================================================

    const getPatientId = (admission) => {

        if (
            admission.patient_details &&
            admission.patient_details.patient_id
        ) {

            return admission.patient_details.patient_id;
        }

        return "-";
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {

            return "-";
        }

        const parts =
            date.split("-");

        if (parts.length !== 3) {

            return date;
        }

        return (
            `${parts[2]}-${parts[1]}-${parts[0]}`
        );
    };


    // =====================================================
    // OPEN ADD FORM
    // =====================================================

    const openAddForm = () => {

        setEditingAdmission(null);

        setFormData({
            ...emptyForm
        });

        setMessage("");

        setShowForm(true);
    };


    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {

        setShowForm(false);

        setEditingAdmission(null);

        setFormData({
            ...emptyForm
        });

        setMessage("");
    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (admission) => {

        setEditingAdmission(admission);


        let patientValue = "";


        if (admission.patient_details) {

            patientValue =
                admission.patient_details.patient_id || "";

        } else {

            patientValue =
                admission.patient || "";
        }


        setFormData({

            patient:
                patientValue,

            doctor:
                admission.doctor || "",

            admission_date:
                admission.admission_date || "",

            discharge_date:
                admission.discharge_date || "",

            room_number:
                admission.room_number || "",

            bed_number:
                admission.bed_number || "",

            admission_type:
                admission.admission_type || "",

            status:
                admission.status || "Admitted",

            reason:
                admission.reason || "",

            notes:
                admission.notes || ""
        });


        setMessage("");

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setLoading(true);

        setMessage("");


        try {

            let url =
                ADMISSIONS_API;

            let method =
                "POST";


            // =========================================
            // EDIT
            // =========================================

            if (editingAdmission) {

                url =
                    `${ADMISSIONS_API}${editingAdmission.admission_id}/`;

                method =
                    "PUT";
            }


            const dataToSend = {

                patient:
                    formData.patient,

                doctor:
                    formData.doctor || "",

                admission_date:
                    formData.admission_date,

                discharge_date:
                    formData.discharge_date || null,

                room_number:
                    formData.room_number || "",

                bed_number:
                    formData.bed_number || "",

                admission_type:
                    formData.admission_type || "",

                status:
                    formData.status,

                reason:
                    formData.reason || "",

                notes:
                    formData.notes || ""
            };


            console.log(
                "Sending:",
                dataToSend
            );


            const response =
                await fetch(
                    url,
                    {
                        method,

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                dataToSend
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                console.error(
                    "Server error:",
                    data
                );

                setMessage(
                    "❌ Failed to save admission."
                );

                return;
            }


            setMessage(
                editingAdmission
                    ? "✅ Admission updated successfully!"
                    : "✅ Admission added successfully!"
            );


            await fetchAdmissions();


            setFormData({
                ...emptyForm
            });

            setEditingAdmission(null);

            setShowForm(false);

        } catch (error) {

            console.error(
                "Submit error:",
                error
            );

            setMessage(
                "❌ Cannot connect to Django."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (admission) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${admission.admission_number || "this admission"}?`
            );


        if (!confirmed) {

            return;
        }


        try {

            const response =
                await fetch(
                    `${ADMISSIONS_API}${admission.admission_id}/`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                setMessage(
                    "❌ Failed to delete admission."
                );

                return;
            }


            setMessage(
                "✅ Admission deleted successfully!"
            );


            await fetchAdmissions();

        } catch (error) {

            console.error(
                "Delete error:",
                error
            );

            setMessage(
                "❌ Cannot connect to Django."
            );
        }
    };


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div className="admissions-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="admissions-header">

                <div>

                    <h1>
                        Admissions Management
                    </h1>

                    <p>
                        Manage patient admissions
                        and hospital stays
                    </p>

                </div>


                <button
                    className="add-admission-btn"
                    onClick={
                        showForm
                            ? closeForm
                            : openAddForm
                    }
                >

                    <span>

                        {showForm
                            ? "✕"
                            : "+"}

                    </span>


                    {showForm
                        ? "Close Form"
                        : "Add Admission"}

                </button>

            </div>


            {/* =================================================
                STAT CARD
            ================================================= */}

            <div className="admission-stat-card">

                <div className="admission-stat-icon">
                    🛏️
                </div>


                <div>

                    <p>
                        Total Admissions
                    </p>

                    <h2>
                        {admissions.length}
                    </h2>

                </div>

            </div>


            {/* =================================================
                MESSAGE
            ================================================= */}

            {message && (

                <div
                    className={`admission-message ${
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


            {/* =================================================
                FORM
            ================================================= */}

            {showForm && (

                <div className="admission-form-card">

                    <div className="admission-form-header">

                        <h2>

                            {editingAdmission
                                ? "Edit Admission"
                                : "Add New Admission"}

                        </h2>

                        <p>
                            Enter the patient's
                            admission details
                        </p>

                    </div>


                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >


                        {/* =====================================
                            PATIENT
                        ===================================== */}

                        <div className="admission-form-section">

                            <h3>
                                Patient Information
                            </h3>


                            <div className="admission-form-grid">

                                <div className="admission-form-group full-width">

                                    <label>
                                        👤 Patient
                                    </label>


                                    <select
                                        name="patient"
                                        value={
                                            formData.patient
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    >

                                        <option value="">
                                            Select patient
                                        </option>


                                        {patients.map(
                                            patient => {

                                                const first =
                                                    String(
                                                        patient.first_name || ""
                                                    ).trim();


                                                const last =
                                                    String(
                                                        patient.last_name || ""
                                                    ).trim();


                                                let name =
                                                    first;


                                                if (
                                                    last &&
                                                    !first
                                                        .toLowerCase()
                                                        .endsWith(
                                                            ` ${last.toLowerCase()}`
                                                        )
                                                ) {

                                                    name =
                                                        `${first} ${last}`;
                                                }


                                                return (

                                                    <option
                                                        key={
                                                            patient.patient_id
                                                        }
                                                        value={
                                                            patient.patient_id
                                                        }
                                                    >

                                                        {
                                                            patient.patient_id
                                                        }

                                                        {" - "}

                                                        {
                                                            name
                                                        }

                                                    </option>
                                                );
                                            }
                                        )}

                                    </select>

                                </div>

                            </div>

                        </div>


                        {/* =====================================
                            MEDICAL INFORMATION
                        ===================================== */}

                        <div className="admission-form-section">

                            <h3>
                                Medical Information
                            </h3>


                            <div className="admission-form-grid">


                                <div className="admission-form-group">

                                    <label>
                                        👨‍⚕️ Doctor
                                    </label>


                                    <input
                                        type="text"
                                        name="doctor"
                                        value={
                                            formData.doctor
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter doctor name"
                                    />

                                </div>


                                <div className="admission-form-group">

                                    <label>
                                        🏥 Admission Type
                                    </label>


                                    <select
                                        name="admission_type"
                                        value={
                                            formData.admission_type
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="">
                                            Select type
                                        </option>

                                        <option value="Emergency">
                                            Emergency
                                        </option>

                                        <option value="General">
                                            General
                                        </option>

                                        <option value="Surgery">
                                            Surgery
                                        </option>

                                        <option value="ICU">
                                            ICU
                                        </option>

                                        <option value="Maternity">
                                            Maternity
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>


                        {/* =====================================
                            ADMISSION DETAILS
                        ===================================== */}

                        <div className="admission-form-section">

                            <h3>
                                Admission Details
                            </h3>


                            <div className="admission-form-grid">


                                <div className="admission-form-group">

                                    <label>
                                        📅 Admission Date
                                    </label>


                                    <input
                                        type="date"
                                        name="admission_date"
                                        value={
                                            formData.admission_date
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="admission-form-group">

                                    <label>
                                        🚪 Discharge Date
                                    </label>


                                    <input
                                        type="date"
                                        name="discharge_date"
                                        value={
                                            formData.discharge_date
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div className="admission-form-group">

                                    <label>
                                        🚪 Room Number
                                    </label>


                                    <input
                                        type="text"
                                        name="room_number"
                                        value={
                                            formData.room_number
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter room number"
                                    />

                                </div>


                                <div className="admission-form-group">

                                    <label>
                                        🛏️ Bed Number
                                    </label>


                                    <input
                                        type="text"
                                        name="bed_number"
                                        value={
                                            formData.bed_number
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter bed number"
                                    />

                                </div>


                                <div className="admission-form-group">

                                    <label>
                                        🔵 Status
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

                                        <option value="Admitted">
                                            Admitted
                                        </option>

                                        <option value="Discharged">
                                            Discharged
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>


                        {/* =====================================
                            REASON
                        ===================================== */}

                        <div className="admission-form-section">

                            <h3>
                                Admission Reason
                            </h3>


                            <div className="admission-form-grid">


                                <div className="admission-form-group full-width">

                                    <label>
                                        🩺 Reason
                                    </label>


                                    <textarea
                                        name="reason"
                                        value={
                                            formData.reason
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter reason for admission"
                                        rows="4"
                                    />

                                </div>


                                <div className="admission-form-group full-width">

                                    <label>
                                        📝 Notes
                                    </label>


                                    <textarea
                                        name="notes"
                                        value={
                                            formData.notes
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter additional notes"
                                        rows="4"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* =====================================
                            BUTTONS
                        ===================================== */}

                        <div className="admission-form-actions">

                            <button
                                type="button"
                                className="admission-cancel-btn"
                                onClick={
                                    closeForm
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="admission-save-btn"
                                disabled={loading}
                            >

                                {loading
                                    ? "Saving..."
                                    : editingAdmission
                                    ? "Update Admission"
                                    : "Save Admission"}

                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* =================================================
                RECORDS
            ================================================= */}

            <div className="admission-table-card">

                <div className="admission-table-header">

                    <div>

                        <h2>
                            Admission Records
                        </h2>

                        <p>
                            Registered patient
                            admissions in the hospital
                        </p>

                    </div>


                    <span className="admission-record-count">

                        {admissions.length}
                        {" "}
                        Records

                    </span>

                </div>


                {admissions.length === 0 ? (

                    <div className="admission-empty-state">

                        <div className="admission-empty-icon">
                            🛏️
                        </div>

                        <h3>
                            No admissions found
                        </h3>

                        <p>
                            Add your first patient
                            admission to get started.
                        </p>

                    </div>

                ) : (

                    <div className="admission-table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Admission ID
                                    </th>

                                    <th>
                                        Patient
                                    </th>

                                    <th>
                                        Doctor
                                    </th>

                                    <th>
                                        Admission Date
                                    </th>

                                    <th>
                                        Discharge Date
                                    </th>

                                    <th>
                                        Room
                                    </th>

                                    <th>
                                        Bed
                                    </th>

                                    <th>
                                        Admission Type
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {admissions.map(
                                    admission => (

                                        <tr
                                            key={
                                                admission.admission_id
                                            }
                                        >


                                            {/* =================================
                                                ADMISSION ID
                                            ================================= */}

                                            <td>

                                                <strong>
                                                    {
                                                        admission.admission_number ||
                                                        "Pending"
                                                    }
                                                </strong>

                                            </td>


                                            {/* =================================
                                                PATIENT
                                            ================================= */}

                                            <td>

                                                <div className="patient-name">

                                                    <div className="patient-avatar">
                                                        👤
                                                    </div>


                                                    <div>

                                                        <strong>

                                                            {
                                                                getPatientName(
                                                                    admission
                                                                )
                                                            }

                                                        </strong>


                                                        <small>

                                                            {getPatientId(
                                                                admission
                                                            ) !== "-"
                                                                ? `Patient ID: ${getPatientId(
                                                                      admission
                                                                  )}`
                                                                : "Patient information unavailable"}

                                                        </small>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* =================================
                                                DOCTOR
                                            ================================= */}

                                            <td>

                                                <div className="admission-cell">

                                                    <span className="admission-icon">
                                                        👨‍⚕️
                                                    </span>

                                                    <span>
                                                        {
                                                            admission.doctor ||
                                                            "-"
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            {/* =================================
                                                ADMISSION DATE
                                            ================================= */}

                                            <td>

                                                <div className="admission-cell">

                                                    <span className="admission-icon">
                                                        📅
                                                    </span>

                                                    <span>
                                                        {formatDate(
                                                            admission.admission_date
                                                        )}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* =================================
                                                DISCHARGE DATE
                                            ================================= */}

                                            <td>

                                                <div className="admission-cell">

                                                    <span className="admission-icon">
                                                        🚪
                                                    </span>

                                                    <span>
                                                        {formatDate(
                                                            admission.discharge_date
                                                        )}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* =================================
                                                ROOM
                                            ================================= */}

                                            <td>

                                                <div className="admission-cell">

                                                    <span className="admission-icon">
                                                        🏥
                                                    </span>

                                                    <span>
                                                        {
                                                            admission.room_number ||
                                                            "-"
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            {/* =================================
                                                BED
                                            ================================= */}

                                            <td>

                                                <div className="admission-cell">

                                                    <span className="admission-icon">
                                                        🛏️
                                                    </span>

                                                    <span>
                                                        {
                                                            admission.bed_number ||
                                                            "-"
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            {/* =================================
                                                TYPE
                                            ================================= */}

                                            <td>

                                                <div className="admission-cell">

                                                    <span className="admission-icon">
                                                        📋
                                                    </span>

                                                    <span>
                                                        {
                                                            admission.admission_type ||
                                                            "-"
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            {/* =================================
                                                STATUS
                                            ================================= */}

                                            <td>

                                                <div className="admission-cell">

                                                    <span className="admission-icon">
                                                        🔵
                                                    </span>


                                                    <span
                                                        className={`admission-status ${
                                                            admission.status ===
                                                            "Admitted"
                                                                ? "admitted"
                                                                : "discharged"
                                                        }`}
                                                    >

                                                        {
                                                            admission.status ||
                                                            "-"
                                                        }

                                                    </span>

                                                </div>

                                            </td>


                                            {/* =================================
                                                ACTIONS
                                            ================================= */}

                                            <td>

                                                <div className="admission-actions">

                                                    <button
                                                        type="button"
                                                        className="admission-edit-btn"
                                                        onClick={() =>
                                                            handleEdit(
                                                                admission
                                                            )
                                                        }
                                                        title="Edit"
                                                    >
                                                        ✏️
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="admission-delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                admission
                                                            )
                                                        }
                                                        title="Delete"
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


export default Admissions;
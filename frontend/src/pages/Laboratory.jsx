
import React, { useEffect, useState } from "react";
import "./Laboratory.css";

const API_URL =
    "https://aarogyacare-backend.onrender.com/api/laboratory/labtests/";

const PATIENTS_URL =
    "https://aarogyacare-backend.onrender.com/api/patients/";

function Laboratory() {

    const [tests, setTests] = useState([]);
    const [patients, setPatients] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingTest, setEditingTest] = useState(null);

    const [formData, setFormData] = useState({
        patient_id: "",
        test_name: "",
        doctor: "",
        department: "",
        test_date: "",
        result: "",
        amount: "",
        technician: "",
        status: "Pending",
    });

    // =========================================================
    // GET LAB TEST ID
    // =========================================================

    const getTestId = (test) => {
        return test?.test_id || null;
    };

    // =========================================================
    // FETCH LAB TESTS
    // =========================================================

    const fetchTests = async () => {

        try {

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch laboratory tests"
                );
            }

            const data = await response.json();

            const testList = Array.isArray(data)
                ? data
                : data.results || [];

            console.log(
                "Laboratory tests:",
                testList
            );

            setTests(testList);

        } catch (error) {

            console.error(
                "Error fetching tests:",
                error
            );

        }
    };

    // =========================================================
    // FETCH PATIENTS
    // =========================================================

    const fetchPatients = async () => {

        try {

            const response = await fetch(PATIENTS_URL);

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch patients"
                );
            }

            const data = await response.json();

            const patientList = Array.isArray(data)
                ? data
                : data.results || [];

            setPatients(patientList);

        } catch (error) {

            console.error(
                "Error fetching patients:",
                error
            );

        }
    };

    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {

        fetchTests();
        fetchPatients();

    }, []);

    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // =========================================================
    // OPEN ADD FORM
    // =========================================================

    const openAddForm = () => {

        setEditingTest(null);

        setFormData({
            patient_id: "",
            test_name: "",
            doctor: "",
            department: "",
            test_date: "",
            result: "",
            amount: "",
            technician: "",
            status: "Pending",
        });

        setShowForm(true);
    };

    // =========================================================
    // EDIT TEST
    // =========================================================

    const handleEdit = (test) => {

        console.log(
            "Editing test:",
            test
        );

        const testId = getTestId(test);

        console.log(
            "Test ID:",
            testId
        );

        if (!testId) {

            alert(
                "Test ID is missing. Please check the backend."
            );

            return;
        }

        setEditingTest(test);

        setFormData({
            patient_id: test.patient_id || "",
            test_name: test.test_name || "",
            doctor: test.doctor || "",
            department: test.department || "",
            test_date: test.test_date || "",
            result: test.result || "",
            amount: test.amount || "",
            technician: test.technician || "",
            status: test.status || "Pending",
        });

        setShowForm(true);
    };

    // =========================================================
    // SAVE / UPDATE TEST
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const dataToSend = {
                patient_id: formData.patient_id,
                test_name: formData.test_name,
                doctor: formData.doctor,
                department: formData.department,
                test_date: formData.test_date,
                result: formData.result,
                amount: formData.amount,
                technician: formData.technician,
                status: formData.status,
            };

            console.log(
                "Sending data:",
                dataToSend
            );

            let response;

            // =================================================
            // ADD
            // =================================================

            if (!editingTest) {

                response = await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                dataToSend
                            ),
                    }
                );

            }

            // =================================================
            // UPDATE
            // =================================================

            else {

                const testId =
                    getTestId(editingTest);

                console.log(
                    "Updating:",
                    testId
                );

                if (!testId) {

                    alert(
                        "Test ID is missing. Cannot update."
                    );

                    return;
                }

                response = await fetch(
                    `${API_URL}${testId}/`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                dataToSend
                            ),
                    }
                );
            }

            let responseData = {};

            try {

                responseData =
                    await response.json();

            } catch {

                responseData = {};

            }

            console.log(
                "Backend response:",
                responseData
            );

            if (!response.ok) {

                console.error(
                    "Backend error:",
                    responseData
                );

                alert(
                    "Unable to save laboratory test.\n\n" +
                    JSON.stringify(
                        responseData
                    )
                );

                return;
            }

            alert(
                editingTest
                    ? "Laboratory test updated successfully!"
                    : "Laboratory test added successfully!"
            );

            setShowForm(false);
            setEditingTest(null);

            setFormData({
                patient_id: "",
                test_name: "",
                doctor: "",
                department: "",
                test_date: "",
                result: "",
                amount: "",
                technician: "",
                status: "Pending",
            });

            fetchTests();

        } catch (error) {

            console.error(
                "Error saving laboratory test:",
                error
            );

            alert(
                "Unable to save laboratory test."
            );
        }
    };

    // =========================================================
    // DELETE TEST
    // =========================================================

    const handleDelete = async (test) => {

        const testId =
            getTestId(test);

        console.log(
            "Deleting:",
            testId
        );

        if (!testId) {

            alert(
                "Test ID is missing. Cannot delete this test."
            );

            return;
        }

        const confirmDelete =
            window.confirm(
                `Are you sure you want to delete ${testId}?`
            );

        if (!confirmDelete) {
            return;
        }

        try {

            const response =
                await fetch(
                    `${API_URL}${testId}/`,
                    {
                        method: "DELETE",
                    }
                );

            if (!response.ok) {

                let errorData = {};

                try {
                    errorData =
                        await response.json();
                } catch {
                    errorData = {};
                }

                console.error(
                    "Delete error:",
                    errorData
                );

                alert(
                    "Unable to delete laboratory test."
                );

                return;
            }

            alert(
                "Laboratory test deleted successfully!"
            );

            fetchTests();

        } catch (error) {

            console.error(
                "Error deleting test:",
                error
            );

            alert(
                "Unable to delete laboratory test."
            );
        }
    };

    // =========================================================
    // CLOSE FORM
    // =========================================================

    const closeForm = () => {

        setShowForm(false);
        setEditingTest(null);

    };

    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="laboratory-page">

            {/* HEADER */}

            <div className="laboratory-header">

                <div>

                    <h1>
                        🧪 Laboratory
                    </h1>

                    <p>
                        Manage laboratory tests and patient reports
                    </p>

                </div>

                <button
                    className="add-test-btn"
                    onClick={openAddForm}
                >
                    ➕ Add Test
                </button>

            </div>


            {/* TOTAL TESTS */}

            <div className="lab-summary">

                <div className="lab-summary-card">

                    <div className="lab-summary-icon">
                        🧪
                    </div>

                    <div>

                        <h3>
                            Total Tests
                        </h3>

                        <p>
                            {tests.length}
                        </p>

                    </div>

                </div>

            </div>


            {/* FORM */}

            {showForm && (

                <div className="lab-form-container">

                    <div className="lab-form-header">

                        <h2>
                            {editingTest
                                ? "✏️ Edit Laboratory Test"
                                : "➕ Add Laboratory Test"}
                        </h2>

                        <button
                            className="close-form-btn"
                            onClick={closeForm}
                        >
                            ✕
                        </button>

                    </div>


                    <form onSubmit={handleSubmit}>

                        <div className="lab-form-grid">

                            {/* PATIENT */}

                            <div className="form-group">

                                <label>
                                    Patient
                                </label>

                                <select
                                    name="patient_id"
                                    value={
                                        formData.patient_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Patient
                                    </option>

                                    {patients.map(
                                        (patient) => (

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
                                                    patient.first_name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* TEST NAME */}

                            <div className="form-group">

                                <label>
                                    Test Name
                                </label>

                                <input
                                    type="text"
                                    name="test_name"
                                    value={
                                        formData.test_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Complete Blood Count"
                                    required
                                />

                            </div>


                            {/* DOCTOR */}

                            <div className="form-group">

                                <label>
                                    Doctor
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
                                    placeholder="Dr. Arun Kumar"
                                    required
                                />

                            </div>


                            {/* DEPARTMENT */}

                            <div className="form-group">

                                <label>
                                    Department
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
                                    placeholder="General Medicine"
                                    required
                                />

                            </div>


                            {/* TEST DATE */}

                            <div className="form-group">

                                <label>
                                    Test Date
                                </label>

                                <input
                                    type="date"
                                    name="test_date"
                                    value={
                                        formData.test_date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* RESULT */}

                            <div className="form-group">

                                <label>
                                    Result
                                </label>

                                <input
                                    type="text"
                                    name="result"
                                    value={
                                        formData.result
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Normal / Pending"
                                />

                            </div>


                            {/* AMOUNT */}

                            <div className="form-group">

                                <label>
                                    Amount
                                </label>

                                <input
                                    type="number"
                                    name="amount"
                                    value={
                                        formData.amount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="500"
                                    min="0"
                                    step="0.01"
                                    required
                                />

                            </div>


                            {/* TECHNICIAN */}

                            <div className="form-group">

                                <label>
                                    Technician
                                </label>

                                <input
                                    type="text"
                                    name="technician"
                                    value={
                                        formData.technician
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Priya"
                                    required
                                />

                            </div>


                            {/* STATUS */}

                            <div className="form-group">

                                <label>
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="Pending">
                                        🟡 Pending
                                    </option>

                                    <option value="Completed">
                                        🟢 Completed
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* BUTTONS */}

                        <div className="form-buttons">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={closeForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-btn"
                            >
                                {editingTest
                                    ? "💾 Update Test"
                                    : "💾 Save Test"}
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* LABORATORY RECORDS */}

            <div className="laboratory-records">

                <div className="records-header">

                    <div>

                        <h2>
                            🧪 Laboratory Records
                        </h2>

                        <p>
                            Registered laboratory tests in the hospital
                        </p>

                    </div>

                </div>


                <div className="table-container">

                    <table className="laboratory-table">

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>🧪 Test Name</th>

                                <th>👤 Patient</th>

                                <th>👨‍⚕️ Doctor</th>

                                <th>🏥 Department</th>

                                <th>📅 Test Date</th>

                                <th>📋 Result</th>

                                <th>💰 Amount</th>

                                <th>🧑‍🔬 Technician</th>

                                <th>📌 Status</th>

                                <th>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {tests.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="11"
                                        className="no-data"
                                    >
                                        No laboratory tests found.
                                    </td>

                                </tr>

                            ) : (

                                tests.map((test) => {

                                    const testId =
                                        getTestId(test);

                                    return (

                                        <tr
                                            key={
                                                testId ||
                                                test.test_name
                                            }
                                        >

                                            {/* ID */}

                                            <td>

                                                <strong>
                                                    #
                                                    {
                                                        testId ||
                                                        "N/A"
                                                    }
                                                </strong>

                                            </td>


                                            {/* TEST NAME */}

                                            <td>

                                                <span className="entity-cell">

                                                    🧪

                                                    <span>
                                                        {
                                                            test.test_name
                                                        }
                                                    </span>

                                                </span>

                                            </td>


                                            {/* PATIENT */}

                                            <td>

                                                <span className="entity-cell">

                                                    👤

                                                    <span>
                                                        {
                                                            test.patient_name ||
                                                            test.patient_id ||
                                                            "N/A"
                                                        }
                                                    </span>

                                                </span>

                                            </td>


                                            {/* DOCTOR */}

                                            <td>

                                                <span className="entity-cell">

                                                    👨‍⚕️

                                                    <span>
                                                        {
                                                            test.doctor ||
                                                            "N/A"
                                                        }
                                                    </span>

                                                </span>

                                            </td>


                                            {/* DEPARTMENT */}

                                            <td>

                                                <span className="entity-cell">

                                                    🏥

                                                    <span>
                                                        {
                                                            test.department ||
                                                            "N/A"
                                                        }
                                                    </span>

                                                </span>

                                            </td>


                                            {/* TEST DATE */}

                                            <td>

                                                <span className="entity-cell">

                                                    📅

                                                    <span>
                                                        {
                                                            test.test_date
                                                        }
                                                    </span>

                                                </span>

                                            </td>


                                            {/* RESULT */}

                                            <td>

                                                <span className="entity-cell">

                                                    📋

                                                    <span>
                                                        {
                                                            test.result ||
                                                            "Pending"
                                                        }
                                                    </span>

                                                </span>

                                            </td>


                                            {/* AMOUNT */}

                                            <td>

                                                <span className="entity-cell">

                                                    💰

                                                    <span>
                                                        ₹
                                                        {
                                                            test.amount ||
                                                            "0"
                                                        }
                                                    </span>

                                                </span>

                                            </td>


                                            {/* TECHNICIAN */}

                                            <td>

                                                <span className="entity-cell">

                                                    🧑‍🔬

                                                    <span>
                                                        {
                                                            test.technician ||
                                                            "N/A"
                                                        }
                                                    </span>

                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        test.status ===
                                                        "Completed"
                                                            ? "status-badge completed"
                                                            : "status-badge pending"
                                                    }
                                                >
                                                    {
                                                        test.status ||
                                                        "Pending"
                                                    }
                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            handleEdit(
                                                                test
                                                            )
                                                        }
                                                    >
                                                        ✏️
                                                    </button>

                                                    <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                test
                                                            )
                                                        }
                                                    >
                                                        🗑️
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                })

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Laboratory;


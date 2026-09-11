import React, { useEffect, useState } from "react";
import "./Billing.css";

const API_URL = "https://aarogyacare-backend.onrender.com/api/billing/";

function Billing() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // FORM DATA
  // =========================

  const [formData, setFormData] = useState({
    patient_name: "",
    doctor_name: "",
    consultation_fee: "",
    medicine_charges: "",
    lab_charges: "",
    room_charges: "",
    other_charges: "",
    payment_method: "",
    payment_status: "Pending",
    bill_date: "",
  });

  // =========================
  // FETCH BILLING DATA
  // =========================

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch billing records");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setBills(data);
      } else {
        setBills([]);
        setError("Invalid billing data received from server.");
      }
    } catch (err) {
      console.error("Fetch billing error:", err);
      setError("Unable to load billing records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // ADD / UPDATE BILL
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const dataToSend = {
        patient_name: formData.patient_name,
        doctor_name: formData.doctor_name,
        consultation_fee: formData.consultation_fee || "0",
        medicine_charges: formData.medicine_charges || "0",
        lab_charges: formData.lab_charges || "0",
        room_charges: formData.room_charges || "0",
        other_charges: formData.other_charges || "0",
        payment_method: formData.payment_method,
        payment_status: formData.payment_status,
        bill_date: formData.bill_date,
      };

      let response;

      // =========================
      // UPDATE
      // =========================

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
      }

      // =========================
      // CREATE
      // =========================

      else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        console.error("Server error:", data);
        throw new Error("Unable to save billing record.");
      }

      if (editingId) {
        setMessage("Bill updated successfully.");
      } else {
        setMessage(
          `${data.bill_id || "Bill"} created successfully.`
        );
      }

      resetForm();

      // Get fresh data from MongoDB
      await fetchBills();

    } catch (err) {
      console.error("Save billing error:", err);
      setError(err.message || "Unable to save billing record.");
    }
  };

  // =========================
  // EDIT BILL
  // =========================

  const handleEdit = (bill) => {
    setEditingId(bill.bill_id);

    setFormData({
      patient_name: bill.patient_name || "",
      doctor_name: bill.doctor_name || "",
      consultation_fee: bill.consultation_fee || "",
      medicine_charges: bill.medicine_charges || "",
      lab_charges: bill.lab_charges || "",
      room_charges: bill.room_charges || "",
      other_charges: bill.other_charges || "",
      payment_method: bill.payment_method || "",
      payment_status: bill.payment_status || "Pending",
      bill_date: bill.bill_date || "",
    });

    setShowForm(true);
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE BILL
  // =========================

  const handleDelete = async (billId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${billId}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}${billId}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to delete bill.");
      }

      setMessage(`${billId} deleted successfully.`);

      // Get fresh data from MongoDB
      await fetchBills();

    } catch (err) {
      console.error("Delete billing error:", err);
      setError(err.message || "Unable to delete bill.");
    }
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setFormData({
      patient_name: "",
      doctor_name: "",
      consultation_fee: "",
      medicine_charges: "",
      lab_charges: "",
      room_charges: "",
      other_charges: "",
      payment_method: "",
      payment_status: "Pending",
      bill_date: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // =========================
  // STATISTICS
  // =========================

  const totalBills = bills.length;

  const paidBills = bills.filter(
    (bill) => bill.payment_status === "Paid"
  ).length;

  const pendingBills = bills.filter(
    (bill) => bill.payment_status === "Pending"
  ).length;

  const totalAmount = bills.reduce(
    (total, bill) =>
      total + Number(bill.total_amount || 0),
    0
  );

  // =========================
  // RETURN
  // =========================

  return (
    <div className="billing-page">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>
          <h1>💳 Billing</h1>

          <p>
            Manage patient bills and payment records
          </p>
        </div>

        {!showForm && (
          <button
            className="add-bill-btn"
            onClick={() => {
              setShowForm(true);
              setMessage("");
              setError("");
            }}
          >
            ➕ Create Bill
          </button>
        )}

      </div>

      {/* ================= MESSAGES ================= */}

      {message && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "15px",
            borderRadius: "8px",
            background: "#dcfce7",
            color: "#166534",
            fontWeight: "600",
          }}
        >
          ✅ {message}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "15px",
            borderRadius: "8px",
            background: "#fee2e2",
            color: "#991b1b",
            fontWeight: "600",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* ================= STATISTICS ================= */}

      <div className="billing-summary">

        {/* TOTAL BILLS */}

        <div className="summary-card">

          <div className="summary-icon">
            💰
          </div>

          <div className="summary-content">

            <h3>
              Total Bills
            </h3>

            <p className="summary-number">
              {totalBills}
            </p>

          </div>

        </div>

        {/* PAID BILLS */}

        <div className="summary-card">

          <div className="summary-icon paid-icon">
            ✅
          </div>

          <div className="summary-content">

            <h3>
              Paid Bills
            </h3>

            <p className="summary-number">
              {paidBills}
            </p>

          </div>

        </div>

        {/* PENDING BILLS */}

        <div className="summary-card">

          <div className="summary-icon pending-icon">
            ⏳
          </div>

          <div className="summary-content">

            <h3>
              Pending Bills
            </h3>

            <p className="summary-number">
              {pendingBills}
            </p>

          </div>

        </div>

        {/* TOTAL AMOUNT */}

        <div className="summary-card">

          <div className="summary-icon amount-icon">
            💵
          </div>

          <div className="summary-content">

            <h3>
              Total Amount
            </h3>

            <p className="summary-number">
              ₹{totalAmount.toFixed(2)}
            </p>

          </div>

        </div>

      </div>

      {/* ================= FORM ================= */}

      {showForm && (

        <div className="billing-card">

          <div className="card-title">

            <h2>
              {editingId !== null
                ? "Edit Bill"
                : "Create New Bill"}
            </h2>

            <p>
              Enter the billing details below
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* PATIENT */}

              <div className="form-group">

                <label>
                  👤 Patient Name
                </label>

                <input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleChange}
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
                  value={formData.doctor_name}
                  onChange={handleChange}
                  placeholder="Enter doctor name"
                  required
                />

              </div>

              {/* CONSULTATION FEE */}

              <div className="form-group">

                <label>
                  💰 Consultation Fee
                </label>

                <input
                  type="number"
                  name="consultation_fee"
                  value={formData.consultation_fee}
                  onChange={handleChange}
                  placeholder="Enter consultation fee"
                  min="0"
                  step="0.01"
                  required
                />

              </div>

              {/* MEDICINE CHARGES */}

              <div className="form-group">

                <label>
                  💊 Medicine Charges
                </label>

                <input
                  type="number"
                  name="medicine_charges"
                  value={formData.medicine_charges}
                  onChange={handleChange}
                  placeholder="Enter medicine charges"
                  min="0"
                  step="0.01"
                  required
                />

              </div>

              {/* LAB CHARGES */}

              <div className="form-group">

                <label>
                  🧪 Lab Charges
                </label>

                <input
                  type="number"
                  name="lab_charges"
                  value={formData.lab_charges}
                  onChange={handleChange}
                  placeholder="Enter lab charges"
                  min="0"
                  step="0.01"
                  required
                />

              </div>

              {/* ROOM CHARGES */}

              <div className="form-group">

                <label>
                  🛏️ Room Charges
                </label>

                <input
                  type="number"
                  name="room_charges"
                  value={formData.room_charges}
                  onChange={handleChange}
                  placeholder="Enter room charges"
                  min="0"
                  step="0.01"
                  required
                />

              </div>

              {/* OTHER CHARGES */}

              <div className="form-group">

                <label>
                  📋 Other Charges
                </label>

                <input
                  type="number"
                  name="other_charges"
                  value={formData.other_charges}
                  onChange={handleChange}
                  placeholder="Enter other charges"
                  min="0"
                  step="0.01"
                  required
                />

              </div>

              {/* BILL DATE */}

              <div className="form-group">

                <label>
                  📅 Bill Date
                </label>

                <input
                  type="date"
                  name="bill_date"
                  value={formData.bill_date}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* PAYMENT METHOD */}

              <div className="form-group">

                <label>
                  💳 Payment Method
                </label>

                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select payment method
                  </option>

                  <option value="Cash">
                    Cash
                  </option>

                  <option value="Card">
                    Card
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="Insurance">
                    Insurance
                  </option>

                </select>

              </div>

              {/* PAYMENT STATUS */}

              <div className="form-group">

                <label>
                  📌 Payment Status
                </label>

                <select
                  name="payment_status"
                  value={formData.payment_status}
                  onChange={handleChange}
                  required
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Paid">
                    Paid
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

            </div>

            

            {/* FORM BUTTONS */}

            <div className="form-buttons">

              <button
                type="submit"
                className="save-btn"
              >
                {editingId !== null
                  ? "Update Bill"
                  : "Create Bill"}
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

      {/* ================= BILL LIST ================= */}

      <div className="billing-card">

        <div className="list-header">

          <div>

            <h2>
              💳 Billing Records
            </h2>

            <p>
              Registered patient billing records
            </p>

          </div>

          <span className="record-count">
            {bills.length} Records
          </span>

        </div>

        {/* ================= TABLE ================= */}

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>👤 Patient</th>
                <th>👨‍⚕️ Doctor</th>
                <th>📅 Bill Date</th>
                <th>💰 Total Amount</th>
                <th>💳 Payment</th>
                <th>📌 Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="8"
                    className="no-data"
                  >
                    ⏳ Loading billing records...
                  </td>

                </tr>

              ) : bills.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="no-data"
                  >
                    No billing records found
                  </td>

                </tr>

              ) : (

                bills.map((bill) => (

                  <tr key={bill.bill_id}>

                    {/* BILL ID */}

                    <td>
                      <strong>
                        {bill.bill_id}
                      </strong>
                    </td>

                    {/* PATIENT */}

                    <td>
                      👤 {bill.patient_name}
                    </td>

                    {/* DOCTOR */}

                    <td>
                      👨‍⚕️ {bill.doctor_name}
                    </td>

                    {/* BILL DATE */}

                    <td>
                      📅 {bill.bill_date}
                    </td>

                    {/* TOTAL */}

                    <td>
                      <strong>
                        ₹{Number(
                          bill.total_amount || 0
                        ).toFixed(2)}
                      </strong>
                    </td>

                    {/* PAYMENT */}

                    <td>
                      💳 {bill.payment_method}
                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={`status-badge ${
                          (bill.payment_status || "")
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                        }`}
                      >
                        📌 {bill.payment_status}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td>

                      <div className="action-buttons">

                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(bill)
                          }
                          title="Edit"
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              bill.bill_id
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

export default Billing;

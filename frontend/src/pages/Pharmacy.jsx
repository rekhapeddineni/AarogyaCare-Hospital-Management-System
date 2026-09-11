import React, { useEffect, useState } from "react";
import "./Pharmacy.css";

const API_URL = "https://aarogyacare-backend.onrender.com/api/pharmacy/medicines/";

function Pharmacy() {

    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState(null);

    const [formData, setFormData] = useState({
        medicine_name: "",
        category: "",
        manufacturer: "",
        batch_number: "",
        manufacturing_date: "",
        expiry_date: "",
        price: "",
        stock_quantity: "",
        stock_status: "Good Stock",
    });


    // =========================================================
    // FETCH MEDICINES
    // =========================================================

    const fetchMedicines = async () => {

        try {

            setLoading(true);

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch medicines");
            }

            const data = await response.json();

            setMedicines(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Error fetching medicines:",
                error
            );

            setMedicines([]);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchMedicines();
    }, []);


    // =========================================================
    // HANDLE INPUT CHANGE
    // =========================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };


    // =========================================================
    // ADD / UPDATE MEDICINE
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const url = editingMedicine
                ? `${API_URL}${editingMedicine.medicine_id}/`
                : API_URL;

            const method = editingMedicine
                ? "PUT"
                : "POST";


            const response = await fetch(url, {

                method: method,

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({

                    medicine_name:
                        formData.medicine_name,

                    category:
                        formData.category,

                    manufacturer:
                        formData.manufacturer,

                    batch_number:
                        formData.batch_number,

                    manufacturing_date:
                        formData.manufacturing_date,

                    expiry_date:
                        formData.expiry_date,

                    price:
                        formData.price,

                    stock_quantity:
                        Number(
                            formData.stock_quantity
                        ),

                    stock_status:
                        formData.stock_status,
                }),
            });


            if (!response.ok) {

                const errorData =
                    await response.json();

                console.error(
                    "Backend error:",
                    errorData
                );

                alert(
                    "Unable to save medicine."
                );

                return;
            }


            alert(
                editingMedicine
                    ? "Medicine updated successfully!"
                    : "Medicine added successfully!"
            );


            resetForm();

            fetchMedicines();

        } catch (error) {

            console.error(
                "Error saving medicine:",
                error
            );

            alert(
                "Something went wrong."
            );
        }
    };


    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = (medicine) => {

        setEditingMedicine(medicine);

        setFormData({

            medicine_name:
                medicine.medicine_name || "",

            category:
                medicine.category || "",

            manufacturer:
                medicine.manufacturer || "",

            batch_number:
                medicine.batch_number || "",

            manufacturing_date:
                medicine.manufacturing_date || "",

            expiry_date:
                medicine.expiry_date || "",

            price:
                medicine.price || "",

            stock_quantity:
                medicine.stock_quantity || "",

            stock_status:
                medicine.stock_status || "Good Stock",
        });


        setShowForm(true);


        window.scrollTo({

            top: 0,

            behavior: "smooth",

        });
    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (medicineId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this medicine?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(
                `${API_URL}${medicineId}/`,
                {
                    method: "DELETE",
                }
            );


            if (!response.ok) {
                throw new Error(
                    "Failed to delete medicine"
                );
            }


            alert(
                "Medicine deleted successfully!"
            );


            fetchMedicines();

        } catch (error) {

            console.error(
                "Error deleting medicine:",
                error
            );

            alert(
                "Unable to delete medicine."
            );
        }
    };


    // =========================================================
    // RESET FORM
    // =========================================================

    const resetForm = () => {

        setFormData({

            medicine_name: "",
            category: "",
            manufacturer: "",
            batch_number: "",
            manufacturing_date: "",
            expiry_date: "",
            price: "",
            stock_quantity: "",
            stock_status: "Good Stock",

        });


        setEditingMedicine(null);

        setShowForm(false);
    };


    // =========================================================
    // STATISTICS
    // =========================================================

    const totalMedicines =
        medicines.length;


    const totalStock =
        medicines.reduce(
            (total, medicine) =>
                total +
                Number(
                    medicine.stock_quantity || 0
                ),
            0
        );


    const lowStock =
        medicines.filter(
            (medicine) =>
                medicine.stock_status ===
                "Low Stock"
        ).length;


    // =========================================================
    // STOCK CLASS
    // =========================================================

    const getStockClass = (status) => {

        if (status === "Low Stock") {
            return "stock-badge low";
        }

        if (status === "Medium Stock") {
            return "stock-badge medium";
        }

        return "stock-badge good";
    };


    // =========================================================
    // STATUS ICON
    // =========================================================

    const getStatusIcon = (status) => {

        if (status === "Low Stock") {
            return "🔴";
        }

        if (status === "Medium Stock") {
            return "🟡";
        }

        return "🟢";
    };


    // =========================================================
    // RETURN
    // =========================================================

    return (

        <div className="pharmacy-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="pharmacy-header">

                <div>

                    <h1>
                        💊 Pharmacy Management
                    </h1>

                    <p>
                        Manage medicines, stock and pharmacy records
                    </p>

                </div>


                <button
                    className="add-medicine-btn"
                    onClick={() => {

                        if (showForm) {

                            resetForm();

                        } else {

                            setShowForm(true);

                        }

                    }}
                >

                    ➕{" "}
                    {showForm
                        ? "Close Form"
                        : "Add Medicine"}

                </button>

            </div>



            {/* =================================================
                FORM
            ================================================= */}

            {showForm && (

                <div className="medicine-form-card">


                    <div className="form-heading">

                        <h2>

                            {editingMedicine
                                ? "Edit Medicine"
                                : "Add Medicine"}

                        </h2>

                        <p>
                            Enter medicine information
                        </p>

                    </div>


                    <form onSubmit={handleSubmit}>


                        <div className="form-grid">


                            {/* MEDICINE NAME */}

                            <div className="form-group">

                                <label>
                                    Medicine Name
                                </label>

                                <input
                                    type="text"
                                    name="medicine_name"
                                    value={
                                        formData.medicine_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter medicine name"
                                    required
                                />

                            </div>


                            {/* CATEGORY */}

                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <input
                                    type="text"
                                    name="category"
                                    value={
                                        formData.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. Tablets"
                                    required
                                />

                            </div>


                            {/* MANUFACTURER */}

                            <div className="form-group">

                                <label>
                                    Manufacturer
                                </label>

                                <input
                                    type="text"
                                    name="manufacturer"
                                    value={
                                        formData.manufacturer
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter manufacturer"
                                    required
                                />

                            </div>


                            {/* BATCH */}

                            <div className="form-group">

                                <label>
                                    Batch Number
                                </label>

                                <input
                                    type="text"
                                    name="batch_number"
                                    value={
                                        formData.batch_number
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter batch number"
                                    required
                                />

                            </div>


                            {/* MANUFACTURING DATE */}

                            <div className="form-group">

                                <label>
                                    Manufacturing Date
                                </label>

                                <input
                                    type="date"
                                    name="manufacturing_date"
                                    value={
                                        formData.manufacturing_date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* EXPIRY DATE */}

                            <div className="form-group">

                                <label>
                                    Expiry Date
                                </label>

                                <input
                                    type="date"
                                    name="expiry_date"
                                    value={
                                        formData.expiry_date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* PRICE */}

                            <div className="form-group">

                                <label>
                                    Price
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter price"
                                    required
                                />

                            </div>


                            {/* STOCK QUANTITY */}

                            <div className="form-group">

                                <label>
                                    Stock Quantity
                                </label>

                                <input
                                    type="number"
                                    name="stock_quantity"
                                    value={
                                        formData.stock_quantity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter stock quantity"
                                    min="0"
                                    required
                                />

                            </div>


                            {/* STOCK STATUS */}

                            <div className="form-group">

                                <label>
                                    Stock Status
                                </label>

                                <select
                                    name="stock_status"
                                    value={
                                        formData.stock_status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="Good Stock">
                                        🟢 Good Stock
                                    </option>

                                    <option value="Medium Stock">
                                        🟡 Medium Stock
                                    </option>

                                    <option value="Low Stock">
                                        🔴 Low Stock
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

                                {editingMedicine
                                    ? "Update Medicine"
                                    : "Save Medicine"}

                            </button>


                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={
                                    resetForm
                                }
                            >

                                Cancel

                            </button>


                        </div>


                    </form>

                </div>

            )}



            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="pharmacy-stats">


                <div className="stat-card">

                    <div className="stat-icon">
                        💊
                    </div>

                    <div className="stat-content">

                        <span>
                            Total Medicines
                        </span>

                        <strong>
                            {totalMedicines}
                        </strong>

                    </div>

                </div>



                <div className="stat-card">

                    <div className="stat-icon">
                        📦
                    </div>

                    <div className="stat-content">

                        <span>
                            Total Stock
                        </span>

                        <strong>
                            {totalStock}
                        </strong>

                    </div>

                </div>



                <div className="stat-card">

                    <div className="stat-icon">
                        ⚠️
                    </div>

                    <div className="stat-content">

                        <span>
                            Low Stock
                        </span>

                        <strong>
                            {lowStock}
                        </strong>

                    </div>

                </div>


            </div>



            {/* =================================================
                MEDICINE RECORDS
            ================================================= */}

            <div className="medicine-records-card">


                <div className="records-header">

                    <div>

                        <h2>
                            💊 Medicine Records
                        </h2>

                        <p>
                            Medicines available in the hospital pharmacy
                        </p>

                    </div>


                    <span className="record-count">
                        {totalMedicines} Records
                    </span>

                </div>



                {/* LOADING */}

                {loading ? (

                    <div className="message">
                        Loading medicines...
                    </div>


                ) : medicines.length === 0 ? (

                    <div className="message">
                        No medicines available.
                    </div>


                ) : (

                    <div className="table-wrapper">


                        <table className="medicine-table">


                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>
                                        💊 Medicine
                                    </th>

                                    <th>
                                        🏷️ Category
                                    </th>

                                    <th>
                                        🏭 Manufacturer
                                    </th>

                                    <th>
                                        📦 Batch
                                    </th>

                                    <th>
                                        📦 Stock
                                    </th>

                                    <th>
                                        💰 Price
                                    </th>

                                    <th>
                                        📅 Manufacturing
                                    </th>

                                    <th>
                                        📅 Expiry
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


                                {medicines.map(
                                    (medicine) => {

                                        const stock =
                                            Number(
                                                medicine.stock_quantity ||
                                                0
                                            );


                                        return (

                                            <tr
                                                key={
                                                    medicine.medicine_id
                                                }
                                            >


                                                {/* ID */}

                                                <td>

                                                    <span className="medicine-id">

                                                        {
                                                            medicine.medicine_id
                                                        }

                                                    </span>

                                                </td>



                                                {/* MEDICINE */}

                                                <td>

                                                    <div className="medicine-info">

                                                        <div className="medicine-avatar">

                                                            💊

                                                        </div>

                                                        <div className="medicine-text">

                                                            <strong>

                                                                {
                                                                    medicine.medicine_name
                                                                }

                                                            </strong>

                                                        </div>

                                                    </div>

                                                </td>



                                                {/* CATEGORY */}

                                                <td>

                                                    <span className="category-badge">

                                                        🏷️{" "}

                                                        {
                                                            medicine.category
                                                        }

                                                    </span>

                                                </td>



                                                {/* MANUFACTURER */}

                                                <td>

                                                    <span className="manufacturer">

                                                        {
                                                            medicine.manufacturer
                                                        }

                                                    </span>

                                                </td>



                                                {/* BATCH */}

                                                <td>

                                                    <span className="batch-number">

                                                        {
                                                            medicine.batch_number
                                                        }

                                                    </span>

                                                </td>



                                                {/* STOCK */}

                                                <td>

                                                    <span
                                                        className={getStockClass(
                                                            medicine.stock_status
                                                        )}
                                                    >

                                                        📦{" "}
                                                        {stock}

                                                    </span>

                                                </td>



                                                {/* PRICE */}

                                                <td>

                                                    <span className="price">

                                                        ₹
                                                        {Number(
                                                            medicine.price ||
                                                            0
                                                        ).toFixed(2)}

                                                    </span>

                                                </td>



                                                {/* MANUFACTURING */}

                                                <td>

                                                    <span className="date">

                                                        📅{" "}

                                                        {
                                                            medicine.manufacturing_date ||
                                                            "-"
                                                        }

                                                    </span>

                                                </td>



                                                {/* EXPIRY */}

                                                <td>

                                                    <span className="date">

                                                        📅{" "}

                                                        {
                                                            medicine.expiry_date ||
                                                            "-"
                                                        }

                                                    </span>

                                                </td>



                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={getStockClass(
                                                            medicine.stock_status
                                                        )}
                                                    >

                                                        {getStatusIcon(
                                                            medicine.stock_status
                                                        )}{" "}

                                                        {
                                                            medicine.stock_status ||
                                                            "Good Stock"
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
                                                                    medicine
                                                                )
                                                            }
                                                            title="Edit"
                                                        >

                                                            ✏️

                                                        </button>


                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    medicine.medicine_id
                                                                )
                                                            }
                                                            title="Delete"
                                                        >

                                                            🗑️

                                                        </button>

                                                    </div>

                                                </td>


                                            </tr>

                                        );

                                    }
                                )}


                            </tbody>

                        </table>

                    </div>

                )}


            </div>


        </div>
    );
}


export default Pharmacy;

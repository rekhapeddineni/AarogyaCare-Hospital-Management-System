
import React, { useEffect, useState } from "react";
import "./Inventory.css";


// =========================================================
// API URL
// =========================================================

const API_URL = "http://127.0.0.1:8000/api/inventory/inventory/";


// =========================================================
// EMPTY FORM
// =========================================================

const emptyForm = {
  item_name: "",
  category: "",
  quantity: "",
  unit_price: "",
  supplier: "",
  purchase_date: "",
  expiry_date: "",
};


// =========================================================
// INVENTORY COMPONENT
// =========================================================

function Inventory() {

  // -------------------------------------------------------
  // STATES
  // -------------------------------------------------------

  const [inventory, setInventory] = useState([]);

  const [formData, setFormData] = useState(emptyForm);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");


  // =======================================================
  // FETCH INVENTORY
  // =======================================================

  const fetchInventory = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch inventory data");
      }

      const data = await response.json();

      if (Array.isArray(data)) {

        setInventory(data);

      } else {

        setInventory([]);

        setError("Invalid inventory data received from server.");

      }

    } catch (err) {

      console.error("Inventory fetch error:", err);

      setError(
        "Unable to connect to the inventory server."
      );

    } finally {

      setLoading(false);

    }
  };


  // =======================================================
  // LOAD DATA WHEN PAGE OPENS
  // =======================================================

  useEffect(() => {

    fetchInventory();

  }, []);


  // =======================================================
  // FORM INPUT CHANGE
  // =======================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // =======================================================
  // GET STATUS
  // =======================================================

  const getStatus = (quantity) => {

    const qty = Number(quantity);

    if (qty === 0) {
      return "Out of Stock";
    }

    if (qty <= 50) {
      return "Low Stock";
    }

    return "Available";

  };


  // =======================================================
  // STATUS CLASS
  // =======================================================

  const getStatusClass = (quantity) => {

    const status = getStatus(quantity);

    if (status === "Available") {
      return "status-available";
    }

    if (status === "Low Stock") {
      return "status-low";
    }

    return "status-out";

  };


  // =======================================================
  // ADD / UPDATE INVENTORY
  // =======================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    // -----------------------------------------------------
    // Basic validation
    // -----------------------------------------------------

    if (
      !formData.item_name ||
      !formData.category ||
      !formData.quantity ||
      !formData.unit_price ||
      !formData.supplier ||
      !formData.purchase_date
    ) {

      setError("Please fill all required fields.");

      return;
    }


    // -----------------------------------------------------
    // Prepare data
    // -----------------------------------------------------

    const dataToSend = {

      item_name: formData.item_name,

      category: formData.category,

      quantity: Number(formData.quantity),

      unit_price: Number(formData.unit_price),

      supplier: formData.supplier,

      purchase_date: formData.purchase_date,

      expiry_date:
        formData.expiry_date || null,

    };


    try {

      // ===================================================
      // UPDATE
      // ===================================================

      if (editingId) {

        const response = await fetch(
          `${API_URL}${editingId}/`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(dataToSend),
          }
        );


        if (!response.ok) {

          const errorData = await response.json();

          console.error(
            "Update error:",
            errorData
          );

          throw new Error(
            "Failed to update inventory"
          );
        }


        setMessage(
          "Inventory updated successfully."
        );

      }

      // ===================================================
      // ADD
      // ===================================================

      else {

        const response = await fetch(
          API_URL,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(dataToSend),
          }
        );


        if (!response.ok) {

          const errorData = await response.json();

          console.error(
            "Add error:",
            errorData
          );

          throw new Error(
            "Failed to add inventory"
          );
        }


        setMessage(
          "Inventory added successfully."
        );

      }


      // ---------------------------------------------------
      // Refresh table from MongoDB
      // ---------------------------------------------------

      await fetchInventory();


      // ---------------------------------------------------
      // Reset form
      // ---------------------------------------------------

      setFormData(emptyForm);

      setEditingId(null);

      setShowForm(false);


      // ---------------------------------------------------
      // Hide message after 3 seconds
      // ---------------------------------------------------

      setTimeout(() => {
        setMessage("");
      }, 3000);


    } catch (err) {

      console.error(
        "Inventory submit error:",
        err
      );

      setError(
        "Unable to save inventory. Please check the backend."
      );

    }

  };


  // =======================================================
  // EDIT INVENTORY
  // =======================================================

  const handleEdit = (item) => {

    setEditingId(item.inventory_id);

    setFormData({

      item_name:
        item.item_name || "",

      category:
        item.category || "",

      quantity:
        item.quantity ?? "",

      unit_price:
        item.unit_price ?? "",

      supplier:
        item.supplier || "",

      purchase_date:
        item.purchase_date || "",

      expiry_date:
        item.expiry_date || "",

    });

    setShowForm(true);

    setMessage("");

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // =======================================================
  // DELETE INVENTORY
  // =======================================================

  const handleDelete = async (inventoryId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this inventory item?"
    );


    if (!confirmed) {
      return;
    }


    setMessage("");

    setError("");


    try {

      const response = await fetch(
        `${API_URL}${inventoryId}/`,
        {
          method: "DELETE",
        }
      );


      if (!response.ok) {

        throw new Error(
          "Failed to delete inventory"
        );

      }


      setMessage(
        "Inventory deleted successfully."
      );


      // ---------------------------------------------------
      // Refresh data from MongoDB
      // ---------------------------------------------------

      await fetchInventory();


      setTimeout(() => {
        setMessage("");
      }, 3000);


    } catch (err) {

      console.error(
        "Delete error:",
        err
      );

      setError(
        "Unable to delete inventory."
      );

    }

  };


  // =======================================================
  // CANCEL EDIT
  // =======================================================

  const handleCancel = () => {

    setFormData(emptyForm);

    setEditingId(null);

    setShowForm(false);

    setMessage("");

    setError("");

  };


  // =======================================================
  // FILTER INVENTORY
  // =======================================================

  const filteredInventory = inventory.filter(
    (item) => {

      const search =
        searchTerm.toLowerCase();

      return (

        String(
          item.inventory_id || ""
        )
          .toLowerCase()
          .includes(search)

        ||

        String(
          item.item_name || ""
        )
          .toLowerCase()
          .includes(search)

        ||

        String(
          item.category || ""
        )
          .toLowerCase()
          .includes(search)

        ||

        String(
          item.supplier || ""
        )
          .toLowerCase()
          .includes(search)

      );

    }
  );


  // =======================================================
  // STATISTICS
  // =======================================================

  const totalItems =
    inventory.length;


  const availableItems =
    inventory.filter(
      (item) =>
        Number(item.quantity) > 50
    ).length;


  const lowStockItems =
    inventory.filter(
      (item) =>
        Number(item.quantity) > 0 &&
        Number(item.quantity) <= 50
    ).length;


  const totalQuantity =
    inventory.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div className="inventory-page">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="inventory-header">

        <div>

          <h1>
            📦 Inventory
          </h1>

          <p>
            Manage hospital inventory, stock and supplies
          </p>

        </div>


        <button
          className="add-inventory-btn"
          onClick={() => {

            setShowForm(true);

            setEditingId(null);

            setFormData(emptyForm);

            setMessage("");

            setError("");

          }}
        >
          ➕ Add Inventory
        </button>

      </div>


      {/* ==================================================
          SUCCESS MESSAGE
      ================================================== */}

      {message && (

        <div className="success-message">

          ✅ {message}

        </div>

      )}


      {/* ==================================================
          ERROR MESSAGE
      ================================================== */}

      {error && (

        <div className="error-message">

          ⚠️ {error}

        </div>

      )}


      {/* ==================================================
          ADD / EDIT FORM
      ================================================== */}

      {showForm && (

        <div className="inventory-form-card">

          <div className="form-header">

            <h2>

              {editingId
                ? "✏️ Edit Inventory"
                : "➕ Add Inventory"}

            </h2>

          </div>


          <form
            onSubmit={handleSubmit}
            className="inventory-form"
          >


            {/* Item Name */}

            <div className="form-group">

              <label>
                Item Name *
              </label>

              <input
                type="text"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                placeholder="Enter item name"
                required
              />

            </div>


            {/* Category */}

            <div className="form-group">

              <label>
                Category *
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
                required
              />

            </div>


            {/* Quantity */}

            <div className="form-group">

              <label>
                Quantity *
              </label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="0"
                required
              />

            </div>


            {/* Price */}

            <div className="form-group">

              <label>
                Unit Price *
              </label>

              <input
                type="number"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
              />

            </div>


            {/* Supplier */}

            <div className="form-group">

              <label>
                Supplier *
              </label>

              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                placeholder="Enter supplier"
                required
              />

            </div>


            {/* Purchase Date */}

            <div className="form-group">

              <label>
                Purchase Date *
              </label>

              <input
                type="date"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleChange}
                required
              />

            </div>


            {/* Expiry Date */}

            <div className="form-group">

              <label>
                Expiry Date
              </label>

              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
              />

            </div>


            {/* Buttons */}

            <div className="form-buttons">

              <button
                type="submit"
                className="save-btn"
              >

                {editingId
                  ? "💾 Update Inventory"
                  : "💾 Save Inventory"}

              </button>


              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                ❌ Cancel
              </button>

            </div>

          </form>

        </div>

      )}


      {/* ==================================================
          STATISTICS CARDS
      ================================================== */}

      <div className="inventory-stats">


        {/* Total Items */}

        <div className="stat-card">

          <div className="stat-icon">
            📦
          </div>

          <div>

            <h3>
              Total Items
            </h3>

            <strong>
              {totalItems}
            </strong>

          </div>

        </div>


        {/* Available Items */}

        <div className="stat-card">

          <div className="stat-icon">
            ✅
          </div>

          <div>

            <h3>
              Available Items
            </h3>

            <strong>
              {availableItems}
            </strong>

          </div>

        </div>


        {/* Low Stock */}

        <div className="stat-card">

          <div className="stat-icon">
            ⚠️
          </div>

          <div>

            <h3>
              Low Stock
            </h3>

            <strong>
              {lowStockItems}
            </strong>

          </div>

        </div>


        {/* Total Quantity */}

        <div className="stat-card">

          <div className="stat-icon">
            🔢
          </div>

          <div>

            <h3>
              Total Quantity
            </h3>

            <strong>
              {totalQuantity}
            </strong>

          </div>

        </div>

      </div>


      {/* ==================================================
          INVENTORY RECORDS
      ================================================== */}

      <div className="inventory-table-card">


        <div className="table-header">

          <div>

            <h2>
              Inventory Records
            </h2>

            <p>
              Hospital inventory and supply records
            </p>

          </div>


          {/* Search */}

          <div className="search-box">

            🔍

            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

        </div>


        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="table-container">

          {loading ? (

            <div className="loading-message">

              ⏳ Loading inventory...

            </div>

          ) : filteredInventory.length === 0 ? (

            <div className="empty-message">

              📦 No inventory records found.

            </div>

          ) : (

            <table>

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Item
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Quantity
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Supplier
                  </th>

                  <th>
                    Purchase Date
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

                {filteredInventory.map(
                  (item) => (

                    <tr
                      key={
                        item.inventory_id
                      }
                    >


                      {/* ID */}

                      <td>

                        <strong className="inventory-id">

                          {item.inventory_id}

                        </strong>

                      </td>


                      {/* Item */}

                      <td>

                        <span className="item-name">

                          📦 {item.item_name}

                        </span>

                      </td>


                      {/* Category */}

                      <td>

                        <span>

                          🏷️ {item.category}

                        </span>

                      </td>


                      {/* Quantity */}

                      <td>

                        <strong>

                          🔢 {item.quantity}

                        </strong>

                      </td>


                      {/* Price */}

                      <td>

                        <strong>

                          💰 ₹
                          {Number(
                            item.unit_price || 0
                          ).toFixed(2)}

                        </strong>

                      </td>


                      {/* Supplier */}

                      <td>

                        🏭 {item.supplier}

                      </td>


                      {/* Purchase Date */}

                      <td>

                        📅{" "}

                        {item.purchase_date
                          ? new Date(
                              item.purchase_date
                            ).toLocaleDateString(
                              "en-CA"
                            )
                          : "-"}

                      </td>


                      {/* Status */}

                      <td>

                        <span
                          className={`status-badge ${getStatusClass(
                            item.quantity
                          )}`}
                        >

                          📌{" "}

                          {getStatus(
                            item.quantity
                          )}

                        </span>

                      </td>


                      {/* Actions */}

                      <td>

                        <div className="action-buttons">


                          {/* Edit */}

                          <button
                            className="edit-btn"
                            onClick={() =>
                              handleEdit(item)
                            }
                            title="Edit inventory"
                          >
                            ✏️
                          </button>


                          {/* Delete */}

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                item.inventory_id
                              )
                            }
                            title="Delete inventory"
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

          )}

        </div>

      </div>

    </div>

  );

}


export default Inventory;


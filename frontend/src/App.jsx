import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";

import Sidebar from "./components/Sidebar";
import Chatbot from "./components/Chatbot";

import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import Doctors from "./pages/Doctors";
import Staff from "./pages/Staff";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Admissions from "./pages/Admissions";
import Pharmacy from "./pages/Pharmacy";
import Laboratory from "./pages/Laboratory";
import Billing from "./pages/Billing";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";

import "./App.css";

function App() {

    const location = useLocation();

    // Show Sidebar and Chatbot only on hospital pages
    const showHospitalLayout =
        location.pathname !== "/" &&
        location.pathname !== "/login" &&
        location.pathname !== "/signup";

    return (
        <>
            {/* =====================================================
                SIDEBAR
                Only visible after Login
            ===================================================== */}

            {showHospitalLayout && <Sidebar />}


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main
                className={
                    showHospitalLayout
                        ? "app-content"
                        : "login-content"
                }
            >

                <Routes>

                    {/* =================================================
                        LOGIN / SIGNUP
                    ================================================= */}

                    <Route
                        path="/"
                        element={<Login />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/signup"
                        element={<Signup />}
                    />


                    {/* =================================================
                        HOSPITAL DASHBOARD
                    ================================================= */}

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    {/* =================================================
                        HOSPITAL MODULES
                    ================================================= */}

                    <Route
                        path="/departments"
                        element={<Departments />}
                    />

                    <Route
                        path="/doctors"
                        element={<Doctors />}
                    />

                    <Route
                        path="/staff"
                        element={<Staff />}
                    />

                    <Route
                        path="/patients"
                        element={<Patients />}
                    />

                    <Route
                        path="/appointments"
                        element={<Appointments />}
                    />

                    <Route
                        path="/admissions"
                        element={<Admissions />}
                    />

                    <Route
                        path="/pharmacy"
                        element={<Pharmacy />}
                    />

                    <Route
                        path="/laboratory"
                        element={<Laboratory />}
                    />

                    <Route
                        path="/billing"
                        element={<Billing />}
                    />

                    <Route
                        path="/inventory"
                        element={<Inventory />}
                    />

                    <Route
                        path="/reports"
                        element={<Reports />}
                    />

                </Routes>

            </main>


            {/* =====================================================
                CHATBOT
                Only visible after Login
            ===================================================== */}

            {showHospitalLayout && <Chatbot />}

        </>
    );
}

export default App;
// Navbar.jsx

import React from "react";
import "./Navbar.css";

function Navbar() {
    return (
        <div className="top-navbar">

            <div className="hospital-brand">

                <img
                    src="/aarogyacare-logo.png"
                    alt="AarogyaCare Hospital"
                    className="hospital-logo"
                />

                <div>
                    <div className="hospital-name">
                        AarogyaCare Hospital
                    </div>

                    <div className="hospital-tagline">
                        Healthier Today, Better Tomorrow
                    </div>
                </div>

            </div>

            <div className="navbar-right">
                <span>📞 +91 98765 43210</span>
                <span>✉️ support@aarogyacare.com</span>
                <span>🕐 24/7 Emergency</span>
            </div>

        </div>
    );
}

export default Navbar;
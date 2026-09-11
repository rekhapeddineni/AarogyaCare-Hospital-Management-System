import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://aarogyacare-backend.onrender.com/api/accounts/login/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful!");

        // Save logged-in user
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName", data.name);

        // Navigate to dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        setError(data.message || "Invalid email or password");
        setLoading(false);
      }
    } catch (error) {
      setError("Unable to connect to server");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =====================================================
          LEFT SIDE - DOCTOR / HOSPITAL IMAGE
          ===================================================== */}

      <div className="login-left">

        <div className="hospital-overlay">

          {/* BRAND */}
          <div className="hospital-brand">

            <div className="hospital-icon">
              🏥
            </div>

            <div>
              <h1>AarogyaCare Hospital</h1>

              <p>
                Healthier Today, Better Tomorrow
              </p>
            </div>

          </div>


          {/* MAIN MESSAGE */}
          <div className="hospital-message">

            <h2>
              Compassionate Care.
            </h2>

            <h2>
              Advanced Healthcare.
            </h2>

            <p>
              Providing trusted healthcare services with
              modern technology, experienced doctors and
              compassionate care for every patient.
            </p>

          </div>


          {/* EMERGENCY BOX */}
          <div className="emergency-box">

            <span className="emergency-icon">
              🚑
            </span>

            <div>

              <strong>
                Emergency Assistance
              </strong>

              <p>
                Call 108 for emergency services
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          RIGHT SIDE - LOGIN
          ===================================================== */}

      <div className="login-right">

        <div className="login-card">

          {/* LOGO */}
          <div className="login-logo">
            🏥
          </div>


          {/* APPLICATION NAME */}
          <h1>
            AarogyaCare
          </h1>

          <p className="login-subtitle">
            Hospital Management System
          </p>


          {/* WELCOME */}
          <h2>
            Welcome Back
          </h2>

          <p className="login-description">
            Login to access your hospital account
          </p>


          {/* LOGIN FORM */}
          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="input-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

            </div>


            {/* PASSWORD */}
            <div className="input-group">

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

            </div>


            {/* ERROR MESSAGE */}
            {error && (
              <p className="error-message">
                {error}
              </p>
            )}


            {/* SUCCESS MESSAGE */}
            {message && (
              <p className="success-message">
                {message}
              </p>
            )}


            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>


          {/* SIGNUP LINK */}
          <div className="signup-link">

            <span>
              Don't have an account?
            </span>{" "}

            <Link to="/signup">
              Create Account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;

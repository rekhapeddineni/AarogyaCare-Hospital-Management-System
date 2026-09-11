import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/signup/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Account created successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setError(data.message || "Unable to create account");
        setLoading(false);
      }
    } catch (error) {
      setError("Unable to connect to server");
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      {/* =====================================================
          LEFT SIDE - HOSPITAL / DOCTOR IMAGE
          ===================================================== */}

      <div className="signup-left">

        <div className="signup-overlay">

          {/* BRAND */}
          <div className="signup-brand">

            <div className="signup-hospital-icon">
              🏥
            </div>

            <div>
              <h1>AarogyaCare</h1>

              <p>
                Hospital Management System
              </p>
            </div>

          </div>


          {/* MAIN CONTENT */}
          <div className="signup-message">

            <div className="welcome-badge">
              ✦ Welcome to AarogyaCare
            </div>

            <h2>
              Your Health.
            </h2>

            <h2>
              Our Commitment.
            </h2>

            <p>
              Create your AarogyaCare account and experience
              a smarter, more connected approach to healthcare.
            </p>

          </div>


          {/* FEATURES */}
          <div className="signup-features">

            <div className="signup-feature">

              <div className="feature-icon">
                👨‍⚕️
              </div>

              <div>
                <strong>
                  Trusted Doctors
                </strong>

                <span>
                  Professional healthcare specialists
                </span>
              </div>

            </div>


            <div className="signup-feature">

              <div className="feature-icon">
                ❤️
              </div>

              <div>
                <strong>
                  Patient-Centered Care
                </strong>

                <span>
                  Care designed around every patient
                </span>
              </div>

            </div>


            <div className="signup-feature">

              <div className="feature-icon">
                🔒
              </div>

              <div>
                <strong>
                  Secure Healthcare
                </strong>

                <span>
                  Your information stays protected
                </span>
              </div>

            </div>

          </div>


          {/* SLOGAN */}
          <div className="signup-slogan">

            <span>
              Healthier Today,
            </span>

            <span>
              Better Tomorrow
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          RIGHT SIDE - CREATE ACCOUNT
          ===================================================== */}

      <div className="signup-right">

        <div className="signup-card">

          {/* LOGO */}
          <div className="signup-logo">
            🏥
          </div>


          {/* BRAND */}
          <h1>
            AarogyaCare
          </h1>

          <p className="signup-subtitle">
            Hospital Management System
          </p>


          {/* TITLE */}
          <h2>
            Create Your Account
          </h2>

          <p className="signup-description">
            Join us for a better healthcare experience
          </p>


          {/* FORM */}
          <form onSubmit={handleSignup}>

            {/* NAME */}
            <div className="signup-input-group">

              <label>
                Full Name
              </label>

              <div className="signup-input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />

              </div>

            </div>


            {/* EMAIL */}
            <div className="signup-input-group">

              <label>
                Email Address
              </label>

              <div className="signup-input-wrapper">

                <span className="input-icon">
                  ✉️
                </span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="signup-input-group">

              <label>
                Password
              </label>

              <div className="signup-input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={loading}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}
            <div className="signup-input-group">

              <label>
                Confirm Password
              </label>

              <div className="signup-input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>


            {/* ERROR */}
            {error && (
              <p className="signup-error">
                {error}
              </p>
            )}


            {/* SUCCESS */}
            {message && (
              <p className="signup-success">
                {message}
              </p>
            )}


            {/* CREATE ACCOUNT */}
            <button
              type="submit"
              className="signup-button"
              disabled={loading}
            >

              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  <span>👤+</span>
                  Create Account
                </>
              )}

            </button>

          </form>


          {/* LOGIN */}
          <div className="login-link">

            <span>
              Already have an account?
            </span>{" "}

            <Link to="/login">
              Login
            </Link>

          </div>


          {/* FOOTER */}
          <div className="signup-footer">
            Trusted Care • Modern Technology • Healthier Communities
          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;
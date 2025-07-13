import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/Auth.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { FaApple } from "react-icons/fa";
import Logo from "../images/Logo.png";
import axios from "axios";
import { UserContext } from "./context/UserContext";

function Auth({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser, setToken } = useContext(UserContext);

  const type = location.pathname === "/register" ? "register" : "login";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");

    if (type === "register" && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const payload = {
      email,
      password,
      ...(type === "register" && { firstName, lastName }),
    };

    try {
      const endpoint = type === "login" ? "/api/login" : "/api/register";

      const response = await axios.post(
        `http://localhost:4000${endpoint}`,
        payload
      );

      setErrorMessage("");
      if (type === "login") {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        if (onClose) onClose();
      }

      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err);
      setErrorMessage(err.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <img src={Logo} alt="Train Together Logo" className="auth-logo" />

        <form onSubmit={handleSubmit}>
          {type === "register" && (
            <>
              <input type="text" name="firstName" placeholder="First Name" required />
              <input type="text" name="lastName" placeholder="Last Name" required />
            </>
          )}
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          {type === "register" && (
            <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
          )}
          <button type="submit" className="primary-btn">{type === "login" ? "Login" : "Register"}</button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>

        <div className="divider">OR</div>
        <div className="auth-providers">
          <button><FcGoogle size={40} /></button>
          <button><FaFacebook size={40} /></button>
          <button><FaApple size={40} /></button>
        </div>
        {type === "login" ? (
  <div className="register-section">
    <button className="register-btn" onClick={() => navigate("/register")}>
      Register
    </button>
  </div>
) : (
  <div className="register-section">
    <button className="register-btn" onClick={() => navigate("/login")}>
      Already have an account? Login
    </button>
  </div>
)}
      </div>
    </div>
  );
}

export default Auth;
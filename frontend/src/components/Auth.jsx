import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Auth.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { FaApple } from "react-icons/fa";
import Logo from "../images/Logo.png";

function Auth({ type = "login", onClose }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${type} submitted`);
  };

  const goToRegister = () => {
    onClose();
    navigate("/register"); 
  };

  const handleRegisterClick = () => {
  onClose(); 
  navigate("/register"); 
};

const handleClose = () => {
    navigate("/"); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>

        <img src={Logo} alt="Train Together Logo" className="auth-logo" />

        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          {type === "register" && (
            <input type="password" placeholder="Confirm Password" required />
          )}
          <button type="submit" className="primary-btn">
            {type === "login" ? "Login" : "Register"}
          </button>
        </form>

        <div className="divider">OR</div>

        <div className="auth-providers">
          <button>
            <FcGoogle size={40} />
          </button>
          <button>
            <FaFacebook size={40} />
          </button>
          <button>
            <FaApple size={40} />
          </button>
        </div>

        {type === "login" && (
          <div className="register-section">
            <button className="register-btn" onClick={handleRegisterClick}>
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;

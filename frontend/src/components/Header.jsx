import React, { useState, useContext, useEffect } from "react";
import Logo from "../images/Logo.png";
import "../style/Header.css";
import { UserContext } from "./context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import Auth from "./Auth";
import { DashboardContext } from "./context/DashboardContext";

function Header() {
  const { user, logout } = useContext(UserContext);
  const { openForm } = useContext(DashboardContext);
  const [authType, setAuthType] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    if (user) {
      setAuthType(null);
    }
  }, [user]);

  const openModal = (type) => setAuthType(type);
  const closeModal = () => setAuthType(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <img src={Logo} alt="train together logo" className="logo-img" />

      <nav className="nav-links">
        {user ? (
          <>
            {isDashboard && (
              <button className="create-post-button" onClick={openForm}>
                Create Post
              </button>
            )}
            <div
              className="user-menu"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <span>{user.firstName}</span>
              {menuOpen && (
                <div className="dropdown">
                  <button onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </button>
                  <button onClick={() => navigate("/profile")}>Profile</button>
                  <button onClick={() => navigate("/myposts")}>My Posts</button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button className="login-btn" onClick={() => openModal("login")}>
            Login
          </button>
        )}
      </nav>

      {authType && <Auth type={authType} onClose={closeModal} />}
    </header>
  );
}

export default Header;

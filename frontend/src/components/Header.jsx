import React, { useState, useContext } from "react";
import Logo from "../images/Logo.png";
import "../style/Header.css";
import Auth from "./Auth";
import { UserContext } from "./context/UserContext";
import { useEffect } from "react";

function Header() {
  const { user, logout } = useContext(UserContext);
  const [authType, setAuthType] = useState(null);

   useEffect(() => {
    if (user) {
      setAuthType(null); 
    }
  }, [user]);

  const openModal = (type) => setAuthType(type);
  const closeModal = () => setAuthType(null);

  return (
    <header className="header">
      <img src={Logo} alt="train together logo" className="logo-img" />
      <nav className="nav-links">
        {user ? (
          <>
            <span>Welcome, {user.firstName}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
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

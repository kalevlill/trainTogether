import React from "react";
import Logo from "../images/Logo.png";
import "../style/Header.css";
import Auth from "./Auth";



function Header() {
  const [authType, setAuthType] = React.useState(null);
  const openModal = (type) => setAuthType(type);
  const closeModal = () => setAuthType(null);
  return (
    <header className="header">
      <img src={Logo} alt="train together logo" className="logo-img"/>
      <nav className="nav-links">
        <button className="login-btn" onClick={() => openModal("login")}>Login</button>
      </nav>
      {authType && <Auth type={authType} onClose={closeModal} />}
    </header>
  );
}

export default Header;
import React, { useEffect } from "react";
import "../style/Notification.css";

function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className="notification">{message}</div>;
}

export default Notification;
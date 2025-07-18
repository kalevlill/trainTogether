import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/HomePage.css";
import { IoLocation } from "react-icons/io5";
import { LiaCalendarAlt } from "react-icons/lia";
import { IoTrophySharp } from "react-icons/io5";
import illustration from "../images/zumba.jpg";

function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/register");
      return;
    }

    try {
      const res = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.onboardingComplete) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    } catch (error) {
      console.error(error);
      navigate("/login");
    }
  };

  return (
    <>
      <div className="body-section">
        <div className="partner-text">
          <h1>
            <span className="blue-text">Find Your</span> <br />
            <span className="yellow-text">Training <br /> Partner</span>
          </h1>
          <p>Connect with local athletes and <br /> plan your training together effectively</p>
          <button className="get-started-btn" onClick={handleGetStarted}>Get Started</button>
        </div>

        <div className="training-image">
          <img src={illustration} alt="sport" />
        </div>
      </div>

      <div className="icon-row">
        <div className="icon-item">
          <IoLocation size={40} />
          <p>Set Your Location</p>
        </div>
        <div className="icon-item">
          <LiaCalendarAlt size={40} />
          <p>Schedule Your Sessions</p>
        </div>
        <div className="icon-item">
          <IoTrophySharp size={40} />
          <p>Track Your Progress</p>
        </div>
      </div>
    </>
  );
}

export default HomePage;
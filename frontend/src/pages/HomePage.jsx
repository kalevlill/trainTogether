import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/HomePage.css";
import { IoLocation } from "react-icons/io5";
import { LiaCalendarAlt } from "react-icons/lia";
import { IoTrophySharp } from "react-icons/io5";
import illustration from "../images/zumba.jpg"

function HomePage() {
  return (
     <>
      <div className="body-section">
        <div className="partner-text">
          <h1>
            <span className="blue-text">Find Your</span> <br />
            <span className="yellow-text">Training <br /> Partner</span>
          </h1>
          <p>Connect with local athletes and <br /> plan your training together effectively</p>
          <div className="get-started-btn">Get Started</div>
        </div>

        <div className="training-image">
          <img src={illustration} alt="sport" />
        </div>
      </div>

      <div className="icon-row">
        <div className="icon-item">
          <IoLocation size={40} />
          <p>Lorem ipsum dolor sit</p>
        </div>
        <div className="icon-item">
          <LiaCalendarAlt size={40} />
          <p>Lorem ipsum dolor sit</p>
        </div>
        <div className="icon-item">
          <IoTrophySharp size={40} />
          <p>Lorem ipsum dolor sit</p>
        </div>
      </div>
    </>
  );
}

export default HomePage;

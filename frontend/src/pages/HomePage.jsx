import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/HomePage.css";
import { IoLocation } from "react-icons/io5";
import { ImUsers } from "react-icons/im";
import { GiBiceps } from "react-icons/gi";
import jogging from "../images/jogging.jpg";
import gym from "../images/gym.jpg";
import hiking from "../images/hiking.jpg";
import football from "../images/football.jpg";

function HomePage() {
  const navigate = useNavigate();

  const slides = [
    { src: jogging, text: "Push for the Extra Mile, Together" },
    { src: gym, text: "Push each other through every set, every rep, every workout" },
    { src: hiking, text: "Reach New Peaks, Side by Side" },
    { src: football, text: "Your next midfielder is ready to team up" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [slides.length]);

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
          <p>
            Find training partners nearby <br />
            and reach your goals together
          </p>
          <button className="get-started-btn" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>

        <div className="training-image">
          <img src={slides[currentSlide].src} alt="sport" />
          <div className="image-overlay">
            <h1>{slides[currentSlide].text}</h1>
          </div>
        </div>
      </div>

      <div className="icon-row">
        <div className="icon-item">
          <IoLocation size={40} />
          <p>Set your location</p>
        </div>
        <div className="icon-item">
          <ImUsers size={40} />
          <p>Make new contacts</p>
        </div>
        <div className="icon-item">
          <GiBiceps size={40} />
          <p>Get stronger together</p>
        </div>
      </div>
    </>
  );
}

export default HomePage;
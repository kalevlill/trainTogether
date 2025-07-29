import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaImages } from "react-icons/fa6";
import "../style/Onboarding.css";
import { FaChevronDown } from "react-icons/fa";

function Onboarding() {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);

  const [level, setLevel] = useState("");
  const [sports, setSports] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch cities from GeoDB when typing
  useEffect(() => {
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
          {
            headers: {
              "X-RapidAPI-Key":
                "3436771910msh3cf95fb8c0f52b0p1622e3jsn1cfbdab3a0c7",
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
            params: {
              namePrefix: query,
              limit: 5,
            },
          }
        );
        setCitySuggestions(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    const debounce = setTimeout(fetchCities, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSportChange = (event) => {
    const { value, checked } = event.target;
    setSports((prev) =>
      checked ? [...prev, value] : prev.filter((sport) => sport !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location || !level || !gender || !birthday) {
      setError("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("location", location);
    formData.append("level", level);
    formData.append("sports", JSON.stringify(sports));
    formData.append("gender", gender);
    formData.append("birthday", birthday);

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      await axios.post("/api/user/onboarding", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="onboarding-dashboard">
      <form onSubmit={handleSubmit} className="onboarding-form-layout">
        <div className="onboarding-section">
          <h3>Basic Info</h3>

          {/* City Autocomplete */}
          <div className="select-wrapper city-selector">
            <input
              type="text"
              placeholder="Enter your city"
              value={query || location}
              onChange={(e) => {
                setQuery(e.target.value);
                setLocation("");
              }}
            />
            <FaChevronDown className="select-arrow" />
            {citySuggestions.length > 0 && (
              <ul className="city-list">
                {citySuggestions.map((city) => (
                  <li
                    key={city.id}
                    onClick={() => {
                      setLocation(city.city);
                      setQuery(city.city);
                      setCitySuggestions([]);
                    }}
                  >
                    {city.city}, {city.country}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="select-wrapper">
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="" disabled>
                Select your training level
              </option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <FaChevronDown className="select-arrow" />
          </div>

          <div className="select-wrapper">
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <FaChevronDown className="select-arrow" />
          </div>

          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>

        <div className="onboarding-section">
          <h3>Sports Preferences</h3>
          <label>
            <input
              type="checkbox"
              value="Tennis"
              onChange={handleSportChange}
            />
            Tennis
          </label>
          <label>
            <input
              type="checkbox"
              value="Football"
              onChange={handleSportChange}
            />
            Football
          </label>
          <label>
            <input
              type="checkbox"
              value="Basketball"
              onChange={handleSportChange}
            />
            Basketball
          </label>
        </div>

        <div className="onboarding-section">
          <h3>Profile Photo</h3>
          <div className="onboarding-picture-container">
            {profilePicture ? (
              <img
                src={URL.createObjectURL(profilePicture)}
                alt="Preview"
                className="onboarding-picture-preview"
              />
            ) : (
              <div className="onboarding-picture-placeholder">
                <FaImages size={48} color="#666" />
                <p>No image uploaded</p>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
        </div>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <div className="onboarding-form-footer">
          <button type="submit" className="onboarding-submit-btn">
            Complete Onboarding
          </button>
        </div>
      </form>
    </div>
  );
}

export default Onboarding;

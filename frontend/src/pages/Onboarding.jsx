import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

function Onboarding() {
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [sports, setSports] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");

  const navigate = useNavigate();

  const handleSportChange = (event) => {
    const { value, checked } = event.target;
    setSports((prev) =>
      checked ? [...prev, value] : prev.filter((sport) => sport !== value)
    );
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('location', location);
  formData.append('level', level);
  formData.append('sports', JSON.stringify(sports));
  formData.append('gender', gender);
  formData.append('birthday', birthday);

  if (profilePicture) {
    formData.append('profilePicture', profilePicture);
  }

  try {
    await axios.post('/api/user/onboarding', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    navigate('/dashboard');
  } catch (error) {
    console.error(error);
  }
};

  return (
    <form onSubmit={handleSubmit} className="onboarding-form">
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="date"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
      />

      <div>
        <label>
          <input type="checkbox" value="Tennis" onChange={handleSportChange} />{" "}
          Tennis
        </label>
        <label>
          <input
            type="checkbox"
            value="Football"
            onChange={handleSportChange}
          />{" "}
          Football
        </label>
        <label>
          <input
            type="checkbox"
            value="Basketball"
            onChange={handleSportChange}
          />{" "}
          Basketball
        </label>
      </div>

      <input
        type="file"
        onChange={(e) => setProfilePicture(e.target.files[0])}
      />

      <button type="submit">Complete Onboarding</button>
    </form>
  );
}
export default Onboarding;
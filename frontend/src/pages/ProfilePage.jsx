import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:4000";

function ProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    sports: [],
    level: "",
    profilePicture: null,
    profilePicturePath: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setFormData((prev) => ({
          ...prev,
          ...res.data,
          sports: res.data.sports || [],
          profilePicture: null,
          profilePicturePath: res.data.profilePicturePath || "",
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, profilePicture: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("location", formData.location);
    data.append("level", formData.level);
    data.append("sports", JSON.stringify(formData.sports));
    if (formData.profilePicture) {
      data.append("profilePicture", formData.profilePicture);
    }

    try {
      await axios.put("/api/user/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
      />
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
      />
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
      />
      <select name="level" value={formData.level} onChange={handleChange}>
        <option value="">Select Level</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      {formData.profilePicturePath && (
        <img
          src={`http://localhost:4000/${formData.profilePicturePath}`}
          alt="Current Profile"
          style={{ width: "150px", borderRadius: "12px", marginBottom: "1rem" }}
        />
      )}

      <input type="file" name="profilePicture" onChange={handleChange} />

      <button type="submit">Update Profile</button>
    </form>
  );
}

export default ProfilePage;
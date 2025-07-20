import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaImages } from "react-icons/fa6";
import "../style/ProfilePage.css";

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
    birthday: "",
    gender: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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
          birthday: res.data.birthday ? res.data.birthday.slice(0, 10) : "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
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

    const { currentPassword, newPassword, confirmPassword } = formData;
    const wantsToChangePassword =
      currentPassword || newPassword || confirmPassword;

    if (wantsToChangePassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return alert("Please fill in all password fields.");
      }
      if (newPassword !== confirmPassword) {
        return alert("New passwords do not match.");
      }
    }

    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("location", formData.location);
    data.append("level", formData.level);
    data.append("sports", JSON.stringify(formData.sports));
    data.append("birthday", formData.birthday);
    data.append("gender", formData.gender);
    data.append("email", formData.email);

    if (wantsToChangePassword) {
  data.append("currentPassword", formData.currentPassword);
  data.append("newPassword", formData.newPassword);
  data.append("confirmPassword", formData.confirmPassword);
}

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
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="profile-dashboard">
      <form onSubmit={handleSubmit} className="profile-form-layout">
        {/* Profile Info */}
        <div className="profile-section">
          <h3>Profile Info</h3>

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
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select name="level" value={formData.level} onChange={handleChange}>
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Account Settings */}
        <div className="profile-section">
          <h3>Account Settings</h3>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Current Password"
          />
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New Password"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm New Password"
          />
        </div>

        {/* Profile Picture */}
        <div className="profile-section">
          <h3>Profile Photo</h3>

          <div className="profile-picture-container">
            {formData.profilePicturePath ? (
              <img
                src={`http://localhost:4000/${formData.profilePicturePath}`}
                alt="Profile"
                className="profile-picture-preview"
              />
            ) : (
              <div className="profile-picture-placeholder">
                <FaImages size={48} color="#666" />
                <p>No image uploaded</p>
              </div>
            )}
          </div>

          <input type="file" name="profilePicture" onChange={handleChange} />
        </div>

        {/* Submit Button */}
        <div className="profile-form-footer">
          <button type="submit" className="profile-submit-btn">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;

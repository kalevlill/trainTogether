import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/PostProfilePage.css";

axios.defaults.baseURL = "http://localhost:4000";

function PostProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`/api/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.error("Failed to load post:", err));
  }, [id]);

  const calculateAge = (birthday) => {
    if (!birthday) return "";
    const dob = new Date(birthday);
    return Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  };

  if (!post) return <div className="profile-page-container">Loading...</div>;

  const user = post.user;

  return (
    <div className="profile-page-container">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

      <div className="profile-card">
        {user.profilePicturePath && (
          <img
            src={user.profilePicturePath}
            alt="Profile"
            className="profile-avatar-large"
          />
        )}

        <div className="profile-right">
          <h3 className="profile-name">
            {user.firstName} {user.lastName}, {calculateAge(user.birthday)}
          </h3>
          <p className="profile-location">{user.location}</p>
          <span className="level-badge">{user.level}</span>

          <div className="profile-section">
            <h4>Gender:</h4>
            <p>{user.gender || "N/A"}</p>
          </div>

          <div className="profile-section">
            <h4>Post:</h4>
            <p>{post.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostProfilePage;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/Dashboard.css";

axios.defaults.baseURL = "http://localhost:4000";

function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const toggleForm = () => setShowForm((prev) => !prev);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  const calculateAge = (birthday) => {
    if (!birthday) return "";
    const dob = new Date(birthday);
    const ageDifMs = Date.now() - dob.getTime();
    return Math.floor(ageDifMs / (1000 * 60 * 60 * 24 * 365.25));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "/api/posts",
        { description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      setPosts([
        {
          ...res.data,
          user, 
        },
        ...posts,
      ]);
      setDescription("");
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <button className="create-post-button" onClick={toggleForm}>
        Create Post
      </button>

      {/* Modal Form */}
      {showForm && user && (
        <div className="modal-overlay" onClick={toggleForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="post-user-info">
              <img
                src={user.profilePicturePath}
                alt="Profile"
                className="post-avatar-large"
              />
              <div className="user-details">
                <h3>
                  {user.firstName}, {calculateAge(user.birthday)}
                </h3>
                <p>{user.location}</p>
                <span className="level-badge">{user.level}</span>
              </div>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description"
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="posts-grid">
  {posts.map((post) => (
    <div className="post-card" key={post.id}>
      <img
        src={post.user.profilePicturePath}
        alt="Profile"
        className="post-avatar-large"
      />

      <div className="user-details">
        <h3>
          {post.user.firstName}, {calculateAge(post.user.birthday)}
        </h3>
        <p>{post.user.location}</p>
        <span className="level-badge">{post.user.level}</span>
      </div>
      <p className="post-description">{post.description}</p>
    </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

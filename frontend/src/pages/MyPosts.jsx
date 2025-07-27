import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/MyPosts.css";
import { useBodyClass } from "../hooks/useBodyClass";

axios.defaults.baseURL = "http://localhost:4000";

function MyPosts() {
  useBodyClass("dashboard-page");
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");

  const fetchMyPosts = async () => {
    try {
      const res = await axios.get("/api/posts/mine", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch user posts:", err);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const calculateAge = (birthday) => {
    if (!birthday) return "";
    const dob = new Date(birthday);
    const ageDifMs = Date.now() - dob.getTime();
    return Math.floor(ageDifMs / (1000 * 60 * 60 * 24 * 365.25));
  };

  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setEditedDescription(post.description);
  };

  const handleUpdate = async (postId) => {
    try {
      await axios.put(
        `/api/posts/${postId}`,
        { description: editedDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditingPostId(null);
      setEditedDescription("");
      fetchMyPosts();
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  return (
    <div className="myposts-container">
      <h2 className="myposts-title">My Posts</h2>
      <div className="myposts-grid">
        {posts.map((post) => (
          <div className="mypost-card" key={post.id}>
            <div className="image-wrapper">
              <img
                src={post.user.profilePicturePath}
                alt="Profile"
                className="full-image"
              />
              <div className="overlay-text">
                {post.user.firstName}, {calculateAge(post.user.birthday)}
              </div>
            </div>

            <div className="content-wrapper">
              {editingPostId === post.id ? (
                <>
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="edit-textarea"
                  />
                  <button
                    className="post-action-btn"
                    onClick={() => handleUpdate(post.id)}
                  >
                    Save
                  </button>
                  <button
                    className="post-action-btn"
                    onClick={() => setEditingPostId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p className="post-description">{post.description}</p>
                  <button
                    className="post-action-btn"
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </button>
                  <button
                    className="post-action-btn"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPosts;

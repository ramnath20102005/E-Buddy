import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Adjust based on your auth system
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get("/api/profile", config);
        setProfile(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("name", profile.name);
    formData.append("bio", profile.bio);

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } };
      const { data } = await axios.put("/api/profile", formData, config);
      setProfile(data);
    } catch (err) {
      setError("Error updating profile");
    }
  };

  return (
    <div className="profile-container">
      {loading ? <p>Loading...</p> : error ? <p className="error">{error}</p> : (
        <div className="profile-box">
          <h2>Profile</h2>
          <img src={profile.profileImage} alt="Profile" className="profile-image" />
          <input type="file" onChange={handleFileChange} />
          <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
          <button onClick={handleUpdateProfile}>Update Profile</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

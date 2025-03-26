import { useState } from "react";

const ProfileUpdate = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(""); // Stores Base64

  // ✅ Convert image to Base64
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result); // Store Base64 string
    };

    if (file) {
      reader.readAsDataURL(file); // Convert file to Base64
    }
  };

  // ✅ Update Profile API Call
  const updateProfile = async () => {
    const updatedData = {
      name,
      bio,
      profileImage, // ✅ Send Base64 image
    };

    await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(updatedData),
    });
  };

  return (
    <div>
      <h2>Update Profile</h2>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Bio" onChange={(e) => setBio(e.target.value)} />
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={updateProfile}>Save</button>
    </div>
  );
};

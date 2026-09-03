import React, { useEffect, useState } from "react";
import MerchantNavbar from "../Components/merchantNavbar";
const MerchantProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    address: "",
    phone: "",
  });

  // Fetch merchant profile
  const fetchMerchantProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8081/api/merchant/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch merchant profile");
      }

      const data = await response.json();

      setProfile(data);
      setFormData({
        storeName: data.storeName || "",
        description: data.description || "",
        address: data.address || "",
        phone: data.phone || "",
      });
    } catch (err) {
      console.error("Error fetching merchant profile:", err);
      setError("Unable to load merchant profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchantProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        storeName: profile.storeName || "",
        description: profile.description || "",
        address: profile.address || "",
        phone: profile.phone || "",
      });
    }
    setIsEditing(false);
    setMessage("");
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8081/api/merchant/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update merchant profile");
      }

      const updatedProfile = await response.json();

      setProfile(updatedProfile);
      setFormData({
        storeName: updatedProfile.storeName || "",
        description: updatedProfile.description || "",
        address: updatedProfile.address || "",
        phone: updatedProfile.phone || "",
      });

      setIsEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Error updating merchant profile:", err);
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] text-white flex items-center justify-center">
        <p className="text-gray-400">Loading merchant profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] text-white flex items-center justify-center">
        <p className="text-gray-400">Merchant profile not found.</p>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#0b0b0f] text-white ">
        <MerchantNavbar/>
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-purple-400 text-xs tracking-[0.4em] uppercase">Merchant</p>
          <h1 className="text-4xl font-light mt-2">Store Profile</h1>
          <p className="text-gray-500 mt-2">Manage your store information</p>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl text-sm ${
              message.includes("successfully")
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                : "bg-red-500/10 border border-red-500/20 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold">{profile.storeName || "My Store"}</h2>
              <p className="text-sm text-gray-500 mt-1">Merchant ID: #{profile.id}</p>
            </div>

            {!isEditing && (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setMessage("");
                }}
                className="px-5 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-200 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Grid Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Store Name */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block">
                Store Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                />
              ) : (
                <p className="mt-2 text-lg">{profile.storeName || "Not added"}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                />
              ) : (
                <p className="mt-2 text-lg">{profile.phone || "Not added"}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block">
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                />
              ) : (
                <p className="mt-2 text-lg">{profile.address || "Not added"}</p>
              )}
            </div>

            {/* Merchant ID */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider block">
                Merchant ID
              </label>
              <p className="mt-2 text-lg">#{profile.id}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <label className="text-xs text-gray-500 uppercase tracking-wider block">
              Description
            </label>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none transition"
              />
            ) : (
              <p className="mt-2 text-gray-300 whitespace-pre-wrap">
                {profile.description || "No description added."}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MerchantProfile;
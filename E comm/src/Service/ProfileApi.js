import axios from "axios";
import { getProfile, saveProfile } from "./Profile";

const API = "http://localhost:8081/user";

export const getUserProfile = async (id) => {
  const localProfile = getProfile();

  if (id == null) {
    if (!localProfile) {
      throw new Error("No profile found in localStorage");
    }
    return localProfile;
  }

  if (localProfile && String(localProfile.id) === String(id)) {
    return localProfile;
  }

  try {
    const response = await axios.get(`${API}/profile/${id}`);
    const profile = response.data;
    if (profile) {
      saveProfile(profile);
    }
    return profile;
  } catch (err) {
    console.error("getUserProfile error:", err.response?.status, err.response?.data || err.message);
    if (localProfile) {
      return localProfile;
    }
    throw err;
  }
};

export const sendProfile = async (profile) => {
  try {
    const response = await axios.post(`${API}/profile`, profile, {
      headers: { "Content-Type": "application/json" },
    });
    const savedProfile = response.data;
    if (savedProfile) {
      saveProfile(savedProfile);
    }
    return savedProfile;
  } catch (err) {
    console.error("sendProfile error:", err.response?.status, err.response?.data || err.message);
    throw err;
  }
};
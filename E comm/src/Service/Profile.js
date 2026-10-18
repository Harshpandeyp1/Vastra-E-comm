import axios from "axios";
import { apiUrl } from "../config/api";

const StorageKey = "profile";
const baseUrl = apiUrl("user");

export const saveProfile = (userData) => {
    localStorage.setItem(StorageKey, JSON.stringify(userData));
};

export const getProfile = () => {
    const raw = localStorage.getItem(StorageKey);
    return raw ? JSON.parse(raw) : null;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};
export const logout = () => {
    localStorage.removeItem(StorageKey);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
};
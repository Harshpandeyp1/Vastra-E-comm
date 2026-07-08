import axios from "axios";

const StorageKey = "profile";
const baseUrl = "http://localhost:8081/user";

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
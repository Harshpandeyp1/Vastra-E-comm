const key = "profile";

// SAVE USER
export const saveProfile = (userData) => {
  localStorage.setItem(key, JSON.stringify(userData));
};

// GET USER
export const getProfile = () => {
  return JSON.parse(localStorage.getItem(key)) || null;
};

// LOGOUT USER
export const logout = () => {
  localStorage.removeItem(key);
};
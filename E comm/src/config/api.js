const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL = (
  configuredApiUrl || "https://vastra-e-comm.onrender.com"
).replace(/\/+$/, "");

export const apiUrl = (path) => {
  const normalizedPath = path.replace(/^\/+/, "");
  return normalizedPath ? `${API_BASE_URL}/${normalizedPath}` : API_BASE_URL;
};

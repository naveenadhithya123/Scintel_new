const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const API_BASE = rawApiBaseUrl.replace(/\/+$/, "");

export const apiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
};

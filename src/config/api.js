const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

export const API_BASE = rawApiBaseUrl.replace(/\/+$/, "");

export const apiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
};

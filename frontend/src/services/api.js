const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

const TOKEN_KEY = "restaurant_auth_token";

const buildUrl = (path) => `${BASE_URL}${path}`;

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY) || "";

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const request = async (path, options = {}) => {
  const token = getAuthToken();

  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" ? payload.message : payload;
    throw new Error(message || "Request failed");
  }

  return payload;
};

export const getMenu = ({ minPrice, maxPrice } = {}) => {
  const params = new URLSearchParams();

  if (minPrice !== undefined && minPrice !== "") {
    params.set("minPrice", minPrice);
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    params.set("maxPrice", maxPrice);
  }

  const query = params.toString();

  return request(`/api/menu${query ? `?${query}` : ""}`);
};

export const createMenu = (menuData) =>
  request("/api/menu", {
    method: "POST",
    body: JSON.stringify(menuData),
  });

export const createMenuOrder = (menuId) =>
  request(`/api/menu/${menuId}/order`, {
    method: "POST",
  });

export const registerUser = (payload) =>
  request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginUser = (payload) =>
  request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getCurrentUser = () => request("/api/auth/me");

export const getConsumers = () => request("/api/consumers");

export const createConsumer = (consumerData) =>
  request("/api/consumers", {
    method: "POST",
    body: JSON.stringify(consumerData),
  });

export const createCheckoutOrder = (payload) =>
  request("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getOrders = () => request("/api/orders");

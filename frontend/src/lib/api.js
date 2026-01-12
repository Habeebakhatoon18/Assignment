const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/* ===================== USER AUTH ===================== */

export const registerUser = async (payload) => {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Register failed");
  return data;
};

export const loginUser = async (payload) => {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

export const getProfile = async () => {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Profile fetch failed");
  return data;
};

export const logoutUser = async () => {
  const res = await fetch(`${API_BASE}/users/logout`, {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Logout failed");
  return data;
};

/* ===================== PRODUCTS ===================== */

export const getProducts = async () => {
  const res = await fetch(`${API_BASE}/products`, {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Products fetch failed");
  return data;
};

export const createProduct = async (payload) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("price", payload.price);
  formData.append("discount", payload.discount || 0);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const res = await fetch(`${API_BASE}/products/create`, {
    method: "POST",
    credentials: "include",
    body: formData
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Create product failed");
  return data;
};

export const updateProduct = async (id, payload) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("price", payload.price);
  formData.append("discount", payload.discount || 0);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const res = await fetch(`${API_BASE}/admin/updateProduct/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Update product failed");
  return data;
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE}/admin/deleteProduct/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Delete product failed");
  return data;
};

/* ===================== SHOP & CART ===================== */

export const getShopProducts = async () => {
  const res = await fetch(`${API_BASE}/shop`, {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Shop products fetch failed");
  return data;
};

export const addToCart = async (productId) => {
  const res = await fetch(`${API_BASE}/cart/add/${productId}`, {
    method: "POST",
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Add to cart failed");
  return data;
};

export const removeFromCart = async (productId) => {
  const res = await fetch(`${API_BASE}/cart/remove/${productId}`, {
    method: "DELETE",
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Remove from cart failed");
  return data;
};

export const getCart = async () => {
  const res = await fetch(`${API_BASE}/users/cart`, {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Cart fetch failed");
  return data;
};

/* ===================== ADMIN ===================== */

export const loginAdmin = async (payload) => {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Admin login failed");
  return data;
};

export const logoutAdmin = async () => {
  const res = await fetch(`${API_BASE}/admin/logout`, {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Admin logout failed");
  return data;
};

export const getAdminProducts = async () => {
  const res = await fetch(`${API_BASE}/admin`, {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Admin products fetch failed");
  return data;
};

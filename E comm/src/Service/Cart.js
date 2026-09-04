// src/Service/Cart.js
const API_BASE = "http://localhost:8081";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Helper to extract numeric ID from either an object, string, or number
const extractNumericId = (val) => {
  if (val === null || val === undefined) return null;
  if (typeof val === "number" && !isNaN(val)) return val;
  if (typeof val === "string") {
    const parsed = Number(val);
    return isNaN(parsed) ? null : parsed;
  }
  if (typeof val === "object") {
    // If an entire item or product object was passed
    const id = val.id ?? val.productId ?? val._id ?? val.product?.id;
    return id !== undefined && id !== null ? Number(id) : null;
  }
  return null;
};

// GET /cart/{userId}
export const getCart = async (userId) => {
  const uid = extractNumericId(userId) || 1;
  const response = await fetch(`${API_BASE}/cart/${uid}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to load cart with status ${response.status}`);
  }

  return await response.json();
};

// POST /cart/add
// Supports: addToCart(userId, productId, quantity) OR addToCart(productObject, quantity)
export const addToCart = async (userIdOrProduct, productIdOrQty = 1, quantity = 1) => {
  let uId = 1;
  let pId = null;
  let qty = 1;

  // Case 1: Called like addToCart(productObject) or addToCart(productObject, quantity)
  if (typeof userIdOrProduct === "object" && userIdOrProduct !== null) {
    pId = extractNumericId(userIdOrProduct);
    qty = typeof productIdOrQty === "number" ? productIdOrQty : 1;

    try {
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      if (stored?.id) uId = Number(stored.id);
    } catch {
      uId = 1;
    }
  } 
  // Case 2: Standard call -> addToCart(userId, productId, quantity)
  else {
    uId = extractNumericId(userIdOrProduct) || 1;
    pId = extractNumericId(productIdOrQty);
    qty = Number(quantity) || 1;
  }

  // Fallback check: if pId is still missing, attempt reverse inspection
  if (!pId) {
    pId = extractNumericId(userIdOrProduct);
  }

  if (!pId) {
    console.error("addToCart was called with invalid parameters:", { userIdOrProduct, productIdOrQty, quantity });
    throw new Error("Invalid productId passed to addToCart");
  }

  const response = await fetch(`${API_BASE}/cart/add`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      userId: uId,
      productId: pId,
      quantity: qty,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || `Cart addition failed: ${response.status}`);
  }

  const result = await response.json().catch(() => ({ success: true }));

  // Notify components (e.g. ShopNav navbar cart badge) to refresh count
  window.dispatchEvent(new CustomEvent("cart-updated"));

  return result;
};

// DELETE /cart/{cartId}
export const removeFromCart = async (cartItemId) => {
  const cId = extractNumericId(cartItemId);
  if (!cId) return false;

  const response = await fetch(`${API_BASE}/cart/${cId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (response.ok) {
    window.dispatchEvent(new CustomEvent("cart-updated"));
  }

  return response.ok;
};

// PUT /cart/{cartId}/{quantity}
export const updateQuantity = async (cartItemId, quantity) => {
  const cId = extractNumericId(cartItemId);
  const qty = Number(quantity) || 1;

  if (!cId) return false;

  const response = await fetch(`${API_BASE}/cart/${cId}/${qty}`, {
    method: "PUT",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Cart update failed:", errText);
    return false;
  }

  window.dispatchEvent(new CustomEvent("cart-updated"));
  return await response.json().catch(() => true);
};
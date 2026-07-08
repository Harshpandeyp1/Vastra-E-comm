const api_url = "/cart";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const addToCart = async (cartData) => {
  const response = await fetch(`${api_url}/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(cartData),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Server error:", error);
    throw new Error(error);
  }

  return await response.json();
};

export const getCart = async (userId) => {
  const response = await fetch(`${api_url}/${userId}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return data?.value ?? data;
};

export const removeFromCart = async (id) => {
  await fetch(`${api_url}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const updateQuantity = async (cartId, quantity) => {
  const response = await fetch(`${api_url}/${cartId}/${quantity}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  return await response.json();
};
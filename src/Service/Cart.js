const api_url="http://localhost:8081/cart";
export const addToCart = async (cartData) => {
  const response = await fetch(`${api_url}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
  const response = await fetch(`${api_url}/${userId}`);
  const data = await response.json();
  return data?.value ?? data;
};
export const removeFromCart = async (id) => {
  await fetch(`http://localhost:8081/cart/${id}`, {
    method: "DELETE",
  });
};
export const updateQuantity = async (cartId, quantity) => {

  const response = await fetch(
    `http://localhost:8081/cart/${cartId}/${quantity}`,
    {
      method: "PUT",
    }
  );

  return await response.json();
};
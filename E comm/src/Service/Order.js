const key = "orders";

export const getOrders = () => {
  return JSON.parse(localStorage.getItem(key)) || [];
};

export const placeOrder = (cartItems) => {

  const orders = getOrders();

  const newOrder = {
    id: Date.now(),
    items: cartItems,
    date: new Date().toLocaleString(),
    status: "Processing"
  };

  const updated = [newOrder, ...orders];

  localStorage.setItem(key, JSON.stringify(updated));

  localStorage.removeItem("cart");

  return updated;
};
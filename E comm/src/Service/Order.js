

import axios from 'axios'

const API ='http://localhost:8081/order'

export const placeOrder = async (orderData) => {
  try {
    const token = localStorage.getItem("token");

    console.log("Token:", token);
    console.log("Sending order:", orderData);

    if (!token) {
      throw new Error("No token found");
    }

    const resp = await axios.post(
      `${API}/place`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return resp.data;
  } catch (err) {
    if (err.response) {
      console.error(
        "Order API error",
        err.response.status,
        err.response.data
      );
    } else {
      console.error(err.message);
    }
    throw err;
  }
};
export const getUserOrders = async (userId) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${API}/user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

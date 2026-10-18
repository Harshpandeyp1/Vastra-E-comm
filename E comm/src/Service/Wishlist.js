
import { apiUrl } from "../config/api";

const BASE_URL = apiUrl("wishlist");
export const addToWishlist = async (
  userId,
  productId
) => {
  const token=localStorage.getItem("token");
  const response = await fetch(
    `${BASE_URL}/${userId}/${productId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
    }
  }
  );

  return response.json();
};
export const getWishlist = async (userId) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${BASE_URL}/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed");
    }

    return response.json();
};


export const removeFromWishlist = async (wishlistId) => {

    const token = localStorage.getItem("token");

    await fetch(
        `${BASE_URL}/${wishlistId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};
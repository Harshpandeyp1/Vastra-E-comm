

const BASE_URL = "http://localhost:8081/wishlist";
console.log("Wishlist API:", BASE_URL);
export const addToWishlist = async (
  userId,
  productId
) => {

  const response = await fetch(
    `${BASE_URL}/${userId}/${productId}`,
    {
      method: "POST"
    }
  );

  return response.json();
};
export const getWishlist = async (
  userId
) => {

  const response =
    await fetch(
      `${BASE_URL}/${userId}`
    );

  return response.json();
};


export const removeFromWishlist =
async (wishlistId) => {

  await fetch(
    `${BASE_URL}/${wishlistId}`,
    {
      method: "DELETE"
    }
  );
};
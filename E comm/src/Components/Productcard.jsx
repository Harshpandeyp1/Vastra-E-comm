import React, { useState, useEffect } from 'react'
import { ShoppingCart, Heart } from 'lucide-react'
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from "../Service/Wishlist";
import { addToCart } from "../Service/Cart";

const Productcard = ({ item }) => {
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    const loadWishlist = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const userId = user?.id;

      if (!userId) return;

      try {
        const wishlist = await getWishlist(userId);
        const existing = wishlist.find(
          (entry) => entry.product?.id === item.id
        );

        if (existing) {
          setIsWishlisted(true);
          setWishlistItemId(existing.id);
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    };

    loadWishlist();
  }, [item.id]);

  const handleWishlist = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?.id;
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setAuthMessage("Please log in first to use wishlist.");
      return;
    }

    try {
      if (isWishlisted && wishlistItemId) {
        await removeFromWishlist(wishlistItemId);
      } else {
        await addToWishlist(userId, item.id);
      }

      const wishlist = await getWishlist(userId);
      const existing = wishlist.find(
        (entry) => entry.product?.id === item.id
      );

      setIsWishlisted(Boolean(existing));
      setWishlistItemId(existing?.id ?? null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCart = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;
  const token = localStorage.getItem("token");

  if (!userId || !token) {
    setAuthMessage("Please log in first to add items to the cart.");
    return;
  }

  const cartData = {
    userId,
    productId: item.id,
    quantity: 1,
  };

  try {
    await addToCart(cartData);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

  return (
    <div className="group flex flex-col cursor-pointer">

      {/* Image */}
      <div className="relative aspect-3/4 rounded-3xl bg-purple-100 overflow-hidden">

        {/* Tag */}
        {item.tag && (
          <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-purple-500 text-[10px] font-bold text-purple-900 rounded-full">
            {item.tag}
          </span>
        )}

        {/* ❤️ Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-4 right-4 z-10 p-2 bg-white rounded-full transition ${
            isWishlisted ? "text-red-500" : "text-slate-400"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? "fill-red-500" : ""
            }`}
          />
        </button>

        {/* Image */}
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-contain p-6 group-hover:scale-110 transition duration-500"
        />

        {/* Add to cart */}
        <div className="absolute inset-x-4 bottom-4 translate-y-12 group-hover:translate-y-0 transition">

          <button
            onClick={handleCart}
            className={`w-full py-2 rounded-xl text-sm transition ${
              added ? "bg-purple-500 text-white" : "bg-black text-white"
            }`}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>

        </div>
      </div>

      {authMessage && (
        <p className="mt-2 text-xs text-red-500">{authMessage}</p>
      )}

      {/* Details */}
      <div className="mt-4">
        <h4 className="font-bold text-slate-800 group-hover:text-purple-600">
          {item.name}
        </h4>
        <p className="font-semibold">₹{item.price}</p>
      </div>

    </div>
  )
}

export default Productcard
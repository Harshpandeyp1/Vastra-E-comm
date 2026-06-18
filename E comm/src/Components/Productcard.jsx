import React, { useState, useEffect } from 'react'
import { ShoppingCart, Heart } from 'lucide-react'
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from "../service/wishlist";
import { addToCart } from "../service/cart";

const Productcard = ({ item }) => {
const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);


  // check on load
const handleWishlist = async () => {
  const userId = 1; // temporary

  try {
    await addToWishlist(userId, item.id);

    setIsWishlisted(true);
  } catch (error) {
    console.log(error);
  }
};

const handleCart = async () => {
  const cartData = {
    userId: 1,
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
      <div className="relative aspect-[3/4] rounded-3xl bg-purple-50/50 overflow-hidden">

        {/* Tag */}
        {item.tag && (
          <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-white text-[10px] font-bold text-purple-600 rounded-full">
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
              added ? "bg-green-500 text-white" : "bg-black text-white"
            }`}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>

        </div>
      </div>

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
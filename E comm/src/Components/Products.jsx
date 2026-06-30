import React, { useState, useEffect } from 'react'
import { ShoppingCart, Heart } from 'lucide-react'
// Services

import urban_jacket from "../assets/urban_jacket.jpg"
import shirt from "../assets/shirt.jpg"
import hodie from "../assets/hodie.jpg"
import street from "../assets/street.webp"
import streetwomen from "../assets/streetwomen.jpg";
import gown from "../assets/gown.jpg";
import skirt from "../assets/skirt.jpg";
import dress from "../assets/dress.jpg";
import jacket from "../assets/jacket.jpg";
import track from "../assets/track.jpg";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from "../Service/Wishlist"
import{
  addToCart,
  removeFromCart,
  getCart
}from "../Service/Cart"
import { getImageUrl } from "../utils/imageHelpers"

const Product = () => {

const [products,setProducts] = useState([])

  // wishlist state
  const [wishlist, setWishlist] = useState([])

  // load wishlist on page load
useEffect(() => {
  const loadWishlist = async () => {
    const userId = 1;

    const data = await getWishlist(userId);

    setWishlist(data);
  };

  loadWishlist();
}, []);

  // check product already wishlisted or not
  const isWishlisted = (id) => {
  if (!Array.isArray(wishlist)) return false;

  return wishlist.find(
    (item) => item.product.id === id
  );
}
const handleWishlist = async (product) => {
  const userId = 1;

  if (isWishlisted(product.id)) {

    const wishlistItem = wishlist.find(
      item => item.product.id === product.id
    );

    await removeFromWishlist(wishlistItem.id);

  } else {

    await addToWishlist(userId, product.id);

  }

  const updated = await getWishlist(userId);

  setWishlist(updated);
};
  
 const [loading, setLoading] = useState(true);
 useEffect(() => {
  fetch('http://localhost:8081/api/home')
    .then(response => response.json())
    .then(data => { setProducts(data.trendings); setLoading(false); })
    .catch(error => console.error('Error fetching products:', error));
}, [])

if (loading) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
      <div className="h-10 w-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm tracking-[0.2em] uppercase text-slate-500">
        Loading
      </p>
    </div>
  );
}
  // add to cart
  const handleCart =async(product) => {

    const cartData = {
      userId: 1,
      productId: product.id,
      quantity: 1
    };
    console.log(cartData);
    await addToCart(cartData);
  }


  return (

    <section className="w-full px-8 py-24">

      {/* Header */}
      <div className="text-center mb-16">

        <h2 className="text-2xl font-bold text-purple-400 tracking-[0.3em] uppercase mb-3">
          Our Collection
        </h2>

        <h3 className="text-5xl font-black text-slate-900 tracking-tight">
          Featured
          <span className="font-serif italic font-medium text-purple-600">
            {" "}Products
          </span>
        </h3>

      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {products.map((item) => (

          <div
            key={item.id}
            className="group flex flex-col cursor-pointer"
          >
            {console.log(item.imageUrl)}

            {/* Image Box */}
            <div className="relative aspect-[3/4] rounded-3xl bg-purple-100 overflow-hidden border border-purple-100/20">

              {/* Badge */}
              {item.tag && (

                <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-white text-[10px] font-bold uppercase tracking-widest text-purple-600 rounded-full shadow-sm">

                  {item.tag}

                </span>
              )}

              {/* Wishlist */}
              <button
                onClick={() => handleWishlist(item)}
                className={`absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full transition shadow-sm
                  
                  ${
                    isWishlisted(item.id)
                      ? "text-red-500"
                      : "text-slate-400"
                  }
                `}
              >

                <Heart
                  className={`w-4 h-4
                  
                    ${
                      isWishlisted(item.id)
                        ? "fill-red-500"
                        : ""
                    }
                  `}
                />

              </button>
              
              {/* Product Image */}
             <img
              src={getImageUrl(item)}
              alt={item.name}
              className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-in-out"
              onError={(e) => {
                const fallback = getImageUrl(item);
                if (fallback && e.currentTarget.src !== fallback) {
                  e.currentTarget.src = fallback;
                }
              }}
            />

            </div>

            {/* Details */}
            <div className="mt-5 px-1">

              <div className="flex justify-between items-start">

                <h4 className="text-base font-bold text-slate-800 group-hover:text-purple-600 transition-colors">

                  {item.name}

                </h4>

                <p className="font-bold text-slate-900">

                  ₹{item.price}

                </p>

              </div>

              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">

                Premium Quality

              </p>

            </div>

          </div>
        ))}

      </div>

    </section>
  )
}

export default Product
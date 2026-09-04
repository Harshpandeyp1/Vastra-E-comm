// src/Pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ShopNav from "../Components/ShopNav";
import Footer from "../Components/Footer";
import { addToCart } from "../Service/Cart";
import { addToWishlist } from "../Service/Wishlist";
import { getProfile } from "../Service/Profile";
import { getImageUrl } from "../utils/imageHelpers";
import { FiShoppingBag, FiHeart, FiZap, FiArrowLeft } from "react-icons/fi";

const PLACEHOLDER_IMG =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22400%22%20viewBox%3D%220%200%20300%20400%22%3E%3Crect%20fill%3D%22%23262626%22%20width%3D%22300%22%20height%3D%22400%22%2F%3E%3Ctext%20fill%3D%22%23888%22%20font-family%3D%22sans-serif%22%20font-size%3D%2218%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EVASTRA%3C%2Ftext%3E%3C%2Fsvg%3E";

const ProductDetail = () => {
  const { id } = useParams(); // Extracts the :id from the URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refetches whenever the URL ID changes
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8081/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product fetch failed");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load product details:", err);
        setLoading(false);
      });
  }, [id]);

  const getSafeUserId = () => {
    try {
      const profile = typeof getProfile === "function" ? getProfile() : null;
      if (profile?.id) return profile.id;
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      if (stored?.id) return stored.id;
    } catch {}
    return 1;
  };

  const handleAction = async (type) => {
    if (!product) return;
    const userId = getSafeUserId();

    if (type === "cart") {
      await addToCart(userId, product.id, 1);
      alert(`Added ${product.name} to Cart!`);
    } else if (type === "wishlist") {
      if (typeof addToWishlist === "function") {
        await addToWishlist(userId, product.id);
        alert(`Saved ${product.name} to Wishlist!`);
      }
    } else if (type === "buy") {
      await addToCart(userId, product.id, 1);
      navigate("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFF0]">
        <div className="h-10 w-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFFF0] text-slate-800">
        <p className="text-sm font-bold uppercase tracking-widest mb-4">Product Not Found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-slate-900 text-white text-xs font-bold uppercase rounded-xl cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const rawImg = product.imageUrl || product.image || product.img;
  const imageSrc = getImageUrl ? getImageUrl(rawImg) : rawImg || PLACEHOLDER_IMG;

  return (
    <div className="bg-[#FFFFF0] min-h-screen flex flex-col font-sans">
      <ShopNav />
      <main className="max-w-5xl mx-auto px-6 py-28 flex-1 w-full">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-purple-600 mb-8 cursor-pointer"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-xl shadow-purple-900/5">
          {/* Product Image */}
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 border border-slate-100">
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = PLACEHOLDER_IMG;
              }}
            />
          </div>

          {/* Product Info & Actions */}
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600">
                {product.gender || "Collection"} // {product.category || "Apparel"}
              </span>
              <h1 className="text-3xl font-light tracking-tight text-slate-900 mt-1">{product.name}</h1>
              <p className="text-2xl font-mono font-bold text-slate-900 mt-2">
                ₹{Number(product.price).toLocaleString()}
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Crafted with premium materials engineered for enduring style and comfortable daily wear. Fully verified for standard fulfillment.
            </p>

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="button"
                onClick={() => handleAction("buy")}
                className="w-full py-3.5 bg-slate-950 hover:bg-purple-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <FiZap /> Buy Now (Instant Checkout)
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleAction("cart")}
                  className="flex-1 py-3 bg-white border border-slate-200 hover:border-slate-400 text-slate-900 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiShoppingBag /> Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("wishlist")}
                  className="p-3 bg-white border border-slate-200 hover:border-slate-400 text-slate-700 rounded-xl transition flex items-center justify-center cursor-pointer"
                  title="Save to Wishlist"
                >
                  <FiHeart />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
import React, { useState, useEffect } from "react";
import ShopNav from "../Components/ShopNav";
import Footer from "../Components/Footer";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  removeFromCart,
  updateQuantity,
} from "../Service/Cart";

import { getImageUrl } from "../utils/imageHelpers";

const Cart = () => {
  const [cart, setCart] = useState([]);
const navigate = useNavigate();
const user=JSON.parse(localStorage.getItem("user") || "null");
const handleCheckout = () => {
  navigate("/checkout");
};
useEffect(() => {
  const loadCart = async () => {
    if (!user?.id) return;

    const data = await getCart(user.id);
    console.log(data);
    setCart(data);
  };

  loadCart();
}, [user?.id]);
  // Remove item
const handleRemove = async (item) => {
  await removeFromCart(item.id);

  const updated = await getCart(user.id);

  setCart(updated);
};

  // Quantity change
const handleQuantity = async (item, amt) => {

 const newQuantity = item.quantity + amt;
if (newQuantity < 1) return;
await updateQuantity(item.id, newQuantity);

  

  const updated = await getCart(user.id);

  setCart(updated);
};

  // Total price
  const total = cart.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
  <div className="min-h-screen flex flex-col bg-linear-to-r from-purple-200/40 via-indigo-300/30 to-violet-400/40 font-sans">
    <ShopNav />

    <div className="max-w-6xl mx-auto w-full px-6 flex-1 py-20">
      {/* Header Sector */}
      <div className="mb-16 relative">
        <div className="absolute -left-10 top-0 text-[120px] font-black text-purple-900/5 select-none leading-none">
          BAG
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500 mb-2">
            Selection Matrix // 2026
          </p>
          <h1 className="text-5xl font-light tracking-tighter text-slate-900 leading-none">
            VASTRA <span className="italic text-purple-600 font-serif lowercase">Cart</span>
          </h1>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="h-[40vh] flex flex-col items-center justify-center bg-white/20 backdrop-blur-md rounded-[3rem] border border-white/30">
          <p className="text-sm font-black uppercase tracking-widest text-slate-400">
            Your inventory is empty 
          </p>
          <Link to="/main" className="mt-6 text-[10px] font-bold uppercase tracking-widest border-b-2 border-purple-500 pb-1 hover:text-purple-600 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-6 bg-white/60 backdrop-blur-xl p-6 rounded-4xl border border-white/50 shadow-2xl shadow-purple-900/5 transition-all hover:border-purple-300"
              >
                {/* Image Container */}
                <div className="w-32 h-32 bg-stone-100 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                  <img
                    src={getImageUrl(item)}
                    alt={item.product?.name || item?.name || "Product image"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      const fallback = getImageUrl(item?.product || item);
                      if (fallback && e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />
                </div>

                {/* Details Sector */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">{item.product.name}</h3>
                      <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mt-1">Premium Essential</p>
                    </div>
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                    >
                      [ Remove ]
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    {/* Price */}
                    <p className="text-xl font-light text-slate-900">₹{item.product.price}</p>

                    {/* Quantity Selector - Minimalist */}
                    <div className="flex items-center bg-slate-950 text-white rounded-full p-1 shadow-lg">
                      <button
                        onClick={() => handleQuantity(item, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:text-purple-400 transition-colors"
                      >
                        —
                      </button>
                      <span className="w-8 text-center text-xs font-black font-mono">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantity(item, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:text-purple-400 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary - Sticky */}
          <div className="lg:sticky lg:top-32 bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white border border-white/10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400 mb-8 pb-4 border-b border-white/10">
              Order Summary
            </h2>

            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Processing</span>
                <span className="text-emerald-400 uppercase font-bold text-[9px]">Free</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-sm font-bold uppercase tracking-widest">Total</span>
                <span className="text-3xl font-black text-white">₹{total}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="group inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-purple-500 transition-all shadow-xl shadow-purple-900/40 active:scale-95"
            >
              Secure Checkout
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
            
            <p className="text-[8px] text-center text-slate-500 mt-6 uppercase tracking-widest">
              Encrypted Transactions // Secure Link
            </p>
          </div>
        </div>
      )}
    </div>

    <Footer />
  </div>
);
}
export default Cart;
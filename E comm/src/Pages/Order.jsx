import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShopNav from "../Components/ShopNav";
import Footer from "../Components/Footer";
import { getUserOrders } from "../Service/Order";
import { getProfile } from "../Service/Profile";

const PLACEHOLDER_IMG = "https://via.placeholder.com/300x400?text=No+Image";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const user = getProfile();
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserOrders(user.id);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FFFFF0]">
        <div className="h-10 w-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs tracking-[0.3em] uppercase text-slate-500 font-bold">
          Retrieving Archives
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-r from-purple-200/40 via-indigo-300/30 to-violet-400/40 font-sans">
      <ShopNav />

      <div className="max-w-6xl mx-auto w-full px-6 flex-1 py-32">
        {/* Header Sector */}
        <div className="mb-16 relative">
          <div className="absolute -left-10 top-0 text-[120px] font-black text-purple-900/5 select-none leading-none uppercase pointer-events-none">
            History
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500 mb-2">
              Transaction Log // Verified
            </p>
            <h1 className="text-5xl font-light tracking-tighter text-slate-900 leading-none">
              VASTRA <span className="italic text-purple-600 font-serif lowercase">Orders</span>
            </h1>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="h-[40vh] flex flex-col items-center justify-center bg-white/20 backdrop-blur-md rounded-[3rem] border border-white/30">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
              No acquisitions recorded yet
            </p>
            <Link
              to="/main"
              className="mt-8 px-10 py-4 bg-slate-950 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-purple-600 transition-all shadow-xl shadow-purple-900/10"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => {
              const items = order.orderItems || order.items || [];
              const orderTotal = items.reduce((sum, item) => {
                const price = item.product?.price ?? item.price ?? item.unitPrice ?? 0;
                const quantity = item.quantity || item.qty || 1;
                return sum + price * quantity;
              }, 0);

              const isDelivered = order.status === "Delivered" || order.status === "PAID";

              return (
                <div
                  key={order.id}
                  className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-2xl shadow-purple-900/5 overflow-hidden transition-all hover:border-purple-300 group"
                >
                  {/* Order Meta Header */}
                  <div className="bg-slate-950 p-6 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
                          Order Identifier
                        </p>
                        <p className="text-xs font-mono font-bold text-white uppercase tracking-tighter">
                          #{order.id}
                        </p>
                      </div>

                      <div>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
                          Placement Date
                        </p>
                        <p className="text-xs font-bold text-white uppercase">
                          {order.orderdate || order.date || "Recent"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse ${
                          isDelivered ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        Status:{" "}
                        <span className={isDelivered ? "text-emerald-400" : "text-amber-400"}>
                          {order.status || "Processing"}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-8">
                    <div className="grid gap-6">
                      {items.map((item, idx) => {
                        // Image resolution matches Women, Wishlist, and Cart
                        const imageSrc =
                          item.product?.imageUrl ||
                          item.imageUrl ||
                          item.product?.image ||
                          item.image ||
                          PLACEHOLDER_IMG;

                        const name = item.product?.name || item.name || "Item";
                        const quantity = item.quantity || item.qty || 1;
                        const price = item.product?.price ?? item.price ?? item.unitPrice ?? 0;

                        return (
                          <div
                            key={item.id || item.product?.id || idx}
                            className="flex items-center gap-6 group/item"
                          >
                            <div className="w-20 h-20 bg-stone-100 rounded-2xl overflow-hidden shrink-0 border border-purple-900/5 shadow-inner">
                              <img
                                src={imageSrc}
                                alt={name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = PLACEHOLDER_IMG;
                                }}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 truncate">
                                {name}
                              </h3>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Qty: {quantity}
                              </p>
                            </div>

                            <div className="text-right shrink-0">
                              <p className="text-lg font-light text-slate-900 font-mono">
                                ₹{(price * quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Footer with Total and Shipping Location */}
                    <div className="mt-8 pt-6 border-t border-slate-900/10 flex flex-wrap justify-between items-center gap-4">
                      <div className="max-w-md">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">
                          Destination
                        </p>
                        <p className="text-xs text-slate-600 truncate">
                          {order.address || "Standard Courier Delivery"}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-3">
                          Total Billed:
                        </span>
                        <span className="text-xl font-black text-slate-900 font-mono">
                          ₹{(order.totalPrice || orderTotal).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Order;
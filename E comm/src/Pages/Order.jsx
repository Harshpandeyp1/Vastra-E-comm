import React, { useEffect, useState } from "react";
import ShopNav from "../Components/ShopNav";
import Footer from "../Components/Footer";
import { getUserOrders } from "../Service/Order";
import { getProfile } from "../Service/Profile";
import { getImageUrl } from "../utils/imageHelpers";
const Order = () => {
  const [orders, setOrders] = useState([]);

  useEffect(()=>{
    const loadOrders= async()=>{
    const user=getProfile();
    if(!user) return;

    try{
      const data=await getUserOrders(user.id);
      console.log("ORDER API RESPONSE:", data);
      setOrders(data);
    }catch(err){
      console.log("error loading errors",err);
    }
    }
    loadOrders();
  },[]);

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
            <button className="mt-8 px-10 py-4 bg-slate-950 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-purple-600 transition-all shadow-xl shadow-purple-900/10">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
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
                        {order.orderdate || order.date}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full animate-pulse ${
                        order.status === "Delivered" ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    ></div>

                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      Status:
                      <span className={order.status === "Delivered" ? "text-emerald-400" : "text-amber-400"}>
                        {order.status}
                      </span>
                    </span>
                  </div>

                </div>

                {/* Items List */}
                <div className="p-8">

                  <div className="grid gap-6">

                    {((order.orderItems && order.orderItems.length) ? order.orderItems : order.items || []).map((item) => {
                      const imgCandidate = item.image || item.imageUrl || item.img || (item.product && (item.product.image || item.product.img || item.product.imageUrl)) || '';
                      const imageSrc = getImageUrl(imgCandidate || item);
                      const name = item.name || item.product?.name || item.title || '';
                      const quantity = item.quantity || item.qty || item.count || item.quantityOrdered || 1;
                      const price = item.price || item.unitPrice || item.totalPrice || 0;
                      return (
                        <div key={item.id || item.product?.id || name} className="flex items-center gap-6 group/item">

                          <div className="w-20 h-20 bg-stone-100 rounded-2xl overflow-hidden shrink-0 border border-purple-900/5">
                            <img src={imageSrc} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" />
                          </div>

                          <div className="flex-1">
                            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">{name}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Qty: {quantity}</p>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-light text-slate-900">₹{(price)?.toLocaleString() || 0}</p>
                          </div>

                        </div>
                      );
                    })}

                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

    
      </div>
        <Footer />
    </div>
  );
};

export default Order;
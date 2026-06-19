import React from 'react';
import { useLocation, Link } from "react-router-dom";
import ShopNav from "../Components/ShopNav";
import Footer from "../Components/Footer";

const Success = () => {
  const location = useLocation();
  // Safe-guarding against missing location state if accessed directly
  const order = location.state || {
    orderId: 'N/A',
    status: 'PENDING',
    totalPrice: 0,
    address: 'No address provided',
    items: [],
  };

  const itemCount = Array.isArray(order.items) ? order.items.length : 0;
  const hasItems = itemCount > 0;

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-r from-purple-200/40 via-indigo-300/30 to-violet-400/40 font-sans">
      <ShopNav />

      <div className="max-w-5xl mx-auto w-full px-6 flex-1 py-20 flex flex-col justify-center">
        
        {/* Header Sector */}
        <div className="mb-12 relative text-center">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black text-purple-900/5 select-none leading-none pointer-events-none">
            DONE
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-2">
              Transaction Complete // Status Verified
            </p>
            <h1 className="text-5xl font-light tracking-tighter text-slate-900 leading-none">
              VASTRA <span className="italic text-purple-600 font-serif lowercase">Success</span>
            </h1>
          </div>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white/60 backdrop-blur-xl p-10 md:p-12 rounded-[3rem] border border-white/50 shadow-2xl shadow-purple-900/5 max-w-xl mx-auto w-full text-center">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 text-2xl font-bold shadow-inner">
            ✓
          </div>

          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">
            Thank you for your order
          </h2>
          <p className="text-xs text-slate-500 mb-8">
            Your package preparation is being logged into our fulfillment sequence.
          </p>

          <div className="border-t border-b border-slate-900/10 py-6 my-6 space-y-4 text-left font-mono">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order ID</span>
              <span className="text-xs font-black text-slate-900 bg-slate-950/5 px-2 py-1 rounded">{order.orderId}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Matrix</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {order.status}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shipping Address</span>
              <span className="text-[11px] font-medium text-slate-900 bg-slate-950/5 px-2 py-1 rounded text-right max-w-[55%] break-words">
                {order.address}
              </span>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-slate-900/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Debited</span>
              <span className="text-2xl font-black text-slate-900">₹{order.totalPrice}</span>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-wider">
              <span>{itemCount} item{itemCount === 1 ? '' : 's'} purchased</span>
              <span className="font-black text-slate-900">{hasItems ? `${order.items[0]?.product?.name || 'Item'} + ${itemCount - 1} more` : 'No items recorded'}</span>
            </div>
          </div>

          {hasItems && (
            <div className="text-left space-y-4 mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Order Details</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-[12px] text-slate-700 bg-slate-50 rounded-3xl px-4 py-3">
                  <span>{item.product?.name || item.name || `Item ${index + 1}`}</span>
                  <span className="font-bold">₹{((item.product?.price ?? item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
          
          <Link 
            to="/main" 
            className="group w-full inline-flex items-center justify-center px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-purple-600 transition-all shadow-xl shadow-slate-950/20 active:scale-[0.98] mt-4"
          >
            Return to Storefront
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          
          <p className="text-[8px] text-slate-400 mt-6 uppercase tracking-widest">
            Fulfillment Node // Localhost Terminal
          </p>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Success;
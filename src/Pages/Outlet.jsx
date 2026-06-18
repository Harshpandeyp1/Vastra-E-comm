import React from 'react'
import store1 from "../assets/store1.webp";
import store2 from "../assets/store2.webp";
import store3 from "../assets/store3.webp";
import store4 from "../assets/store4.webp";
import ShopNav from '../Components/ShopNav'
import Footer from '../Components/Footer'
const Outlets = () => [
    {
         name: "Vastra Store – Delhi",
        location: "Connaught Place, New Delhi",
        contact: "📞 +91 9876543210",
        image: store1,
    },
    {
         name: "Vastra Store – Mumbai",
        location: "Marine Lines, Mumbai",
        contact: "📞 +91 9876543210",
        image: store2,
    },
    {
         name: "Vastra Store – jamshedpur",
        location: "sakchi, jamshedpur",
        contact: "📞 +91 9876543210",
        image: store3,
    },
    {
         name: "Vastra Store – Kolkata",
        location: "Park Street, Kolkata",
        contact: "📞 +91 9876543210",
        image: store4,
    },
];
const Outlet = () => {
 return (
  <div className="min-h-screen bg-gradient-to-r from-purple-200/40 via-indigo-300/30 to-violet-400/40 font-sans">
    <div className="px-6 md:px-20 py-12">
      <ShopNav />

      {/* Header Sector */}
      <div className="text-center mt-32 mb-24 relative">
        <div className="absolute inset-0 -top-10 flex justify-center items-center opacity-[0.03] select-none pointer-events-none">
          <h1 className="text-[150px] font-black text-slate-900 tracking-tighter uppercase">Space</h1>
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-purple-500 mb-4">
            Physical Presence // Global Flagships
          </p>
          <h1 className="text-5xl md:text-6xl font-light text-slate-900 tracking-tighter uppercase leading-none">
            Visit Us <span className="font-serif italic text-purple-600 lowercase">Offline</span>
          </h1>
        </div>
      </div>

      {/* Outlets Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {Outlets().map((outlet, index) => (
          <div 
            key={index} 
            className="group bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/50 overflow-hidden shadow-2xl shadow-purple-900/5 transition-all hover:border-purple-300"
          >
            {/* Cinematic Image Frame */}
            <div className="relative h-72 overflow-hidden bg-stone-200">
              <img
                src={outlet.image}
                alt={outlet.name}
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-slate-950/80 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/10">
                  Outlet_0{index + 1}
                </span>
              </div>
            </div>

            {/* Information Sector */}
            <div className="p-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
                    {outlet.name}
                  </h2>
                  <div className="h-[1px] w-12 bg-purple-400 mt-2 transition-all duration-500 group-hover:w-24"></div>
                </div>
                <div className="bg-purple-600/10 p-3 rounded-2xl text-purple-600">
                   <lord-icon
                        src="https://cdn.lordicon.com/zzaxuand.json"
                        trigger="hover"
                        colors="primary:#9333ea"
                        style={{ width: "20px", height: "20px" }}
                    />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Location</span>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed max-w-[200px]">
                    {outlet.location}
                  </p>
                </div>
                
                <div className="flex items-start gap-4 pt-4 border-t border-purple-900/5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Contact</span>
                  <p className="text-sm font-mono font-bold text-purple-600">
                    {outlet.contact}
                  </p>
                </div>
              </div>

              {/* Action Link */}
              <button className="mt-10 w-full bg-slate-950 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-purple-600 active:scale-95 shadow-xl shadow-purple-900/10">
                Get Directions →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);
}

export default Outlet
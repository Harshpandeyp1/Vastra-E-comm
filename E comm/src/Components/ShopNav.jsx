import React from 'react';
import { Search, Heart, ShoppingBag, User, Sparkles } from 'lucide-react';
import men from '../assets/men.png'
import women from '../assets/women.png'
import kids from '../assets/kids.png'
import model from '../assets/model.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
const ShopNav = () => {
    const [query, setQuery] = useState('')
  const navigate = useNavigate()

const handleSearch = (e) => {
  console.log("KEY:", e.key)   // 👈 check this

  if (e.key === 'Enter' && query.trim() !== '') {
    console.log("NAVIGATING:", query)
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }
}
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-4">
      {/* Glassmorphism Container */}
      <div className="max-w-7xl mx-auto backdrop-blur-md bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(120,80,180,0.08)] rounded-[2rem] px-8 py-3 flex items-center justify-between transition-all duration-500 hover:shadow-[0_8px_32px_rgba(120,80,180,0.15)]">
        
        {/* LEFT: Logo Section */}
       <Link to="/main" className="flex items-center gap-4 group cursor-pointer shrink-0">
  
  <div className="relative w-11 h-11 flex items-center justify-center border-2 border-slate-900 group-hover:border-purple-500 group-hover:bg-purple-50 transition-all duration-500 rounded-xl overflow-hidden">
    <span className="text-slate-900 group-hover:text-purple-600 font-black text-xl z-10">V</span>
    <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/0 to-purple-100/0 group-hover:to-purple-200/50 transition-all" />
    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-purple-500 transition-transform group-hover:scale-110"></div>
  </div>

  <div className="hidden md:flex flex-col">
    <h1 className="text-xl font-black tracking-[0.4em] text-slate-900 leading-none">
      VASTRA
    </h1>
    <div className="flex items-center gap-2 mt-1">
      <div className="h-[1px] w-6 bg-purple-400 group-hover:w-10 transition-all duration-500"></div>
      <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-slate-400">
        Authentic Style
      </span>
    </div>
  </div>

</Link>

        {/* CENTER: Navigation Links */}
      <ul className="hidden lg:flex items-center gap-8 text-[13px] font-bold uppercase tracking-widest text-slate-600">

  {[
    { name: 'Men', img: men, path: '/men' },
    { name: 'Women', img: women, path: '/women' },
    { name: 'Kids', img: kids, path: '/kids' },
    { name: 'Trending', img: model, path: '/trending' },
  ].map((item) => (
     <Link to={item.path} key={item.name}>
   <li className="relative group cursor-pointer flex flex-col items-center">

  {/* IMAGE ONLY (NO BORDER, NO BACKGROUND) */}
  <img
    src={item.img}
    alt={item.name}
    className="w-10 h-10 object-cover transition-transform duration-300 group-hover:scale-110"
  />

  {/* TEXT */}
  <span className="mt-1 text-[11px] font-semibold text-slate-600 group-hover:text-purple-600 transition-colors">
    {item.name}
  </span>

  {/* UNDERLINE ANIMATION */}
  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-purple-500 transition-all duration-300 group-hover:w-full" />

</li>
  </Link>
  ))}

  {/* Outlet */}
  <Link to="/outlet">
   <li className="flex items-center gap-1 text-purple-600 cursor-pointer animate-pulse">
    <Sparkles className="w-3 h-3" />
    <span>Outlet</span>
  </li>
  </Link>
 

</ul>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-6">
          

          {/* Action Icons */}
          <div className="flex items-center gap-5 text-slate-700">
            <Link to="/wishlist" className="hover:text-purple-600 hover:scale-110 transition-all">
  <Heart className="w-5 h-5" />
</Link>
          <Link to="/cart" className="relative hover:text-purple-600 hover:scale-110 transition-all">
  <ShoppingBag className="w-5 h-5" />
  <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold bg-purple-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
    *
  </span>
</Link>

          <Link to="/profile" className="p-1 rounded-full hover:border-purple-200 transition-all">
  <User className="w-5 h-5" />
</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};


export default ShopNav;
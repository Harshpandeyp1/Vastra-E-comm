import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
  return (
    <div className="absolute top-0 left-0 w-full z-20 flex">

      {/* LEFT SIDE */}
      <div className="w-1/2 flex items-center px-10 py-6 gap-10">

        {/* Logo */}
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative w-10 h-10 flex items-center justify-center border border-slate-900 group-hover:bg-slate-900 transition-all duration-500">
            <span className="text-slate-900 group-hover:text-stone-50 font-black text-xl transition-colors">V</span>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r border-b border-purple-500"></div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-[0.5em] text-slate-900 leading-none ml-[0.5em]">
              VASTRA
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-[1px] w-8 bg-purple-400"></div>
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400">
                Authentic Style
              </span>
            </div>
          </div>
        </div>

        {/* Left Links */}
        <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">
          <Link to="/login" className="group relative cursor-pointer py-1 hover:text-purple-600">
            Shop
            <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link to="/login" className="group relative cursor-pointer py-1 hover:text-purple-600">
            Collection
            <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex items-center justify-end px-10 py-6 gap-12 text-stone-50">

        <Link to="/login" className="group relative cursor-pointer text-[10px] font-black uppercase tracking-[0.3em] hover:text-purple-200">
          Trendings
          <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-purple-200/50 transition-all duration-300 group-hover:w-full"></span>
        </Link>

        <Link to="/login" className="group relative cursor-pointer text-[10px] font-black uppercase tracking-[0.3em] hover:text-purple-200">
          Gallery
          <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-purple-200/50 transition-all duration-300 group-hover:w-full"></span>
        </Link>

        <Link to="/login" className="rounded-full border border-white/20 px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-white hover:text-purple-600 active:scale-95">
          Login
        </Link>

      </div>

    </div>
  )
}

export default Navbar
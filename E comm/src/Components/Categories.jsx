import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
// Assuming your assets are imported here as before
import men from '../assets/men.png'
import women from '../assets/women.png'
import kids from '../assets/kids.png'
import model from '../assets/model.png'

const categories = [
  { name: 'Men', img: men, count: '240+ Items', path: '/men' },
  { name: 'Women', img: women, count: '380+ Items', path: '/women' },
  { name: 'Kids', img: kids, count: '150+ Items', path: '/kids' },
  { name: 'Trending', img: model, count: '90+ Items', path: '/trending' }
]

const Categories = () => {
  return (
    <section className="w-full px-8 py-32 relative overflow-hidden">
      
      {/* Decorative Background Text (Subtle Luxury Touch) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[12rem] font-black text-purple-50/40 select-none -z-10 tracking-tighter">
        VASTRA
      </div>

      {/* Heading Section */}
      <div className="flex flex-col items-center mb-24">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-[1px] w-8 bg-purple-400"></span>
          <span className="text-[10px] tracking-[0.4em] font-bold uppercase text-purple-400">Collections</span>
          <span className="h-[1px] w-8 bg-purple-400"></span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 text-center tracking-tight">
          SHOP BY <span className="font-serif italic font-medium text-purple-600">Category</span>
        </h2>
      </div>

      {/* Categories Grid */}
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 place-items-center">
       {categories.map((item) => (
  <Link
    to={item.path || '#'}
    key={item.name}
    className="flex flex-col items-center cursor-pointer group relative"
  >
    {/* Image Container */}
    <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
      
      <div className="absolute inset-0 bg-purple-200 rounded-full scale-90 group-hover:scale-100 transition-transform duration-700 shadow-inner"></div>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
        <div className="bg-white p-3 rounded-full shadow-lg text-purple-600">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      <img
        src={item.img}
        alt={item.name}
        className="relative z-10 w-full h-full object-contain 
        group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500"
      />
    </div>

    {/* Text */}
    <div className="mt-8 text-center">
      <span className="block text-2xl font-black text-slate-900 group-hover:text-purple-600">
        {item.name}
      </span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {item.count}
      </span>
    </div>

    <div className="absolute -bottom-4 w-24 h-4 bg-purple-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100"></div>
  </Link>
))}
      </div>
    </section>
  )
}

export default Categories
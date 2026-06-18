import React from 'react'
import Nike from '../assets/Nike.jpg'
import Adidas from '../assets/Adidas.jpg'
import Zara from '../assets/Zara.jpg'
import Hm from '../assets/Hm.jpg'
import Puma from '../assets/Puma.jpg'
import Levis from '../assets/Levis.jpg'
import { Link } from 'react-router-dom'
const brands = [
  { name: 'Nike', img: Nike, path: '/nike' },
  { name: 'Adidas', img: Adidas, path: '/adidas' },
  { name: 'Zara', img: Zara, path: '/zara' },
  { name: 'H&M', img: Hm, path: '/hm' },
  { name: 'Puma', img: Puma, path: '/puma' },
  { name: 'Levis', img: Levis, path: '/levis' }
]
const TopBrands = () => {
  return (
    <section className="w-full px-8 py-20">
  
  {/* Heading */}
  <div className="text-center mb-12">
    <h2 className="text-sm font-bold text-purple-400 tracking-[0.3em] uppercase mb-3">
      Featured By
    </h2>
    <h3 className="text-4xl font-black text-slate-900 tracking-tight">
      Top Brands <span className="font-serif italic font-medium text-purple-600">Brands</span>
    </h3>
  </div>

  {/* Brands */}
  <div className="max-w-15xl mx-auto flex flex-wrap justify-center gap-16">

    {brands.map((brand) => (
      <div to={brand.path} key={brand.name}>
        <div
          className="flex items-center justify-center transition duration-300 hover:scale-110 hover:-translate-y-1"
        >
          <img
            src={brand.img}
            alt={brand.name}
            className="h-16 md:h-30 object-contain"
          />
        </div>
      </div>
    ))}

  </div>

</section>
  )
}

export default TopBrands
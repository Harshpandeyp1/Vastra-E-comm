import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import jacket from '../assets/jacket.jpg'
import shirt from '../assets/shirt.jpg'
import { useNavigate } from 'react-router-dom'
import streetmen from '../assets/streetmen.jpg'
import kidjacket from '../assets/kidjacket.jpg'
import kidskirt from '../assets/kidskirt.jpg'
import kidhodie from '../assets/kidhodie.jpg'
import kidstreet from '../assets/kidstreet.jpg'
import dress from '../assets/dress.jpg'
import skirt from '../assets/skirt.jpg'
import gown from '../assets/gown.jpg'
import streetwomen from '../assets/streetwomen.jpg'
import Footer from '../Components/Footer'
import cord from '../assets/cord.jpg'
import hodie from '../assets/hodie.jpg'
import track from '../assets/track.jpg'

const Collections = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('ALL')

  const menProducts = [
    { id: 301, name: 'Minimalist Utility Jacket', price: 1999, img: jacket, category: 'MEN' },
    { id: 302, name: 'Classic Tailored Shirt', price: 999, img: shirt, category: 'MEN' },
    { id: 303, name: 'Oversized Premium Hoodie', price: 1499, img: hodie, category: 'MEN' },
    { id: 304, name: 'Urban Street Style Fit', price: 2499, img: streetmen, category: 'MEN' }
  ]

  const womenProducts = [
    { id: 101, name: 'Structured Silhouette Dress', price: 1999, img: dress, category: 'WOMEN' },
    { id: 102, name: 'A-Line Modern Skirt', price: 999, img: skirt, category: 'WOMEN' },
    { id: 103, name: 'Evening Gown Edition', price: 1499, img: gown, category: 'WOMEN' },
    { id: 104, name: 'Avant-Garde Street Fit', price: 2499, img: streetwomen, category: 'WOMEN' }
  ]

  const trendingProducts = [
    { id: 201, name: 'Vintage Raw Denim Jacket', price: 1199, img: jacket, category: 'TRENDING' },
    { id: 202, name: 'Relaxed Printed Co-ord Set', price: 899, img: cord, category: 'TRENDING' },
    { id: 203, name: 'Drop-Shoulder Heavy Hoodie', price: 999, img: hodie, category: 'TRENDING' },
    { id: 204, name: 'Monochrome Streetwear Tracksuit', price: 1399, img: track, category: 'TRENDING' }
  ]

  const kidsProducts = [
    { id: 1, name: 'Miniature Denim Jacket', price: 999, img: kidjacket, category: 'KIDS' },
    { id: 2, name: 'Pleated Comfort Skirt', price: 499, img: kidskirt, category: 'KIDS' },
    { id: 3, name: 'Essential Everyday Hoodie', price: 799, img: kidhodie, category: 'KIDS' },
    { id: 4, name: 'Street Culture Style Fit', price: 1299, img: kidstreet, category: 'KIDS' }
  ]

  const sections = [
    { id: 'TRENDING', title: 'Trending Now', products: trendingProducts },
    { id: 'MEN', title: 'Men Collection', products: menProducts },
    { id: 'WOMEN', title: 'Women Collection', products: womenProducts },
    { id: 'KIDS', title: 'Kids Collection', products: kidsProducts }
  ]

  const tabs = ['ALL', 'TRENDING', 'MEN', 'WOMEN', 'KIDS']

  const CollectionSection = ({ title, products }) => {
    return (
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 scroll-mt-20">
        <div className="mb-12 relative flex items-end justify-between border-b border-stone-200/60 pb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 mb-2">
              Vastra Archive // Lookbook
            </p>
            <h2 className="text-4xl font-light tracking-tighter text-slate-900">
              {title.split(' ')[0]} <span className="font-serif italic text-purple-600 lowercase">{title.split(' ')[1] || 'Edition'}</span>
            </h2>
          </div>
          <p className="text-[10px] font-mono text-slate-400 hidden sm:block tracking-widest">
            {products.length} AVAILABLE ITEMS
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map(product => (
            <div key={product.id} className="group cursor-pointer flex flex-col">
              {/* Image Frame Container */}
              <div className="relative overflow-hidden bg-stone-100 rounded-[2rem] aspect-[3/4] shadow-2xl shadow-purple-950/5 border border-stone-200/20">
                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/5 transition-colors duration-500 z-10" />
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-105"
                />
              </div>

              {/* Technical Product Card Info Area */}
              <div className="mt-6 flex justify-between items-start px-2 flex-1">
                <div className="max-w-[70%]">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 group-hover:text-purple-600 transition-colors leading-tight">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    SKU: #{product.id} // {product.category}
                  </p>
                </div>
                <p className="text-sm font-light text-slate-900 font-sans">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <div className="bg-[#FFFFF0] min-h-screen font-sans antialiased overflow-x-hidden">
      <Navbar />

      {/* Hero Sector */}
      <section className="pt-40 pb-12 text-center relative px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-black text-purple-900/5 select-none pointer-events-none uppercase tracking-tighter leading-none whitespace-nowrap">
          Vastra Core
        </div>
        
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500 mb-3">
            System Interface // Catalogue Engine
          </p>
          <h1 className="text-6xl md:text-7xl font-light tracking-tighter text-slate-900 leading-none">
            Explore Our <span className="font-serif italic text-purple-600 lowercase">Collections</span>
          </h1>
          <p className="mt-6 text-sm md:text-base text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
            A precise architectural matrix of premium wearables engineered for men, women, and the next generation.
          </p>
        </div>
      </section>

      {/* Interactive Architecture Filter Tabs */}
      <div className="sticky top-16 bg-[#FFFFF0]/80 backdrop-blur-xl z-40 border-b border-stone-200/40 py-6 mb-8 transition-all">
        <div className="max-w-7xl mx-auto px-6 flex justify-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeTab === tab
                  ? 'bg-slate-950 text-white border-slate-950 shadow-xl shadow-purple-950/10 scale-105'
                  : 'bg-transparent text-slate-400 border-stone-200 hover:text-slate-900 hover:border-slate-400'
              }`}
            >
              {tab === 'ALL' ? 'View All' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content Core Rendering */}
      <div className="pb-16">
        {sections
          .filter(section => activeTab === 'ALL' || section.id === activeTab)
          .map(section => (
            <CollectionSection
              key={section.id}
              title={section.title}
              products={section.products}
            />
          ))}
      </div>

      {/* Bottom CTA Gateway Section */}
      <section className="py-32 text-center bg-slate-950 text-white relative overflow-hidden rounded-t-[4rem] border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        
        <div className="relative z-10 px-6">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-400 mb-4">
            Your Style Journey Continues
          </p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-4">
            Want To Discover <span className="font-serif italic text-purple-400 lowercase">More?</span>
          </h2>
          <p className="text-slate-400 max-w-md mx-auto text-xs font-medium uppercase tracking-widest leading-relaxed">
           The world of Vastra is vast and ever-evolving. Log in to access your personalized dashboard, track orders, manage your wishlist, and stay updated with the latest drops and exclusive offers. Your style journey continues beyond the collections.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="group relative mt-10 px-10 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-slate-950 bg-white overflow-hidden rounded-full transition-transform active:scale-95 hover:shadow-2xl hover:shadow-purple-400/20"
          >
            <span className="absolute inset-0 bg-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              [ Login ]
            </span>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Collections
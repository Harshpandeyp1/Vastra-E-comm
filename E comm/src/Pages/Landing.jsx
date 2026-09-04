import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import model from '../assets/model.png'
import model2 from '../assets/model2.png'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Productcard from '../Components/Productcard'
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa'

const Landing = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('left')
  const collectionRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchHomeProducts()
  }, [])

  const fetchHomeProducts = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/home')
      const data = await response.json()
      
      const trendingsList = data.trendings || data || []
      const filtered = trendingsList.filter(
        product => product.imageUrl !== "street.webp"
      )
      setProducts(filtered)
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleScrollToCollection = () => {
    if (collectionRef.current) {
      const top = collectionRef.current.offsetTop
      window.scrollTo({
        top: top - 80,
        behavior: 'smooth'
      })
    }
  }

  // Exactly matching Kids.jsx pattern:
  const productsWithImages = products.map(product => ({
    ...product,
    img: product.imageUrl
  }))

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <div className="h-10 w-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm tracking-[0.2em] uppercase text-slate-500">
          Loading
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[#FFFFF0] min-h-screen font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="h-screen flex relative overflow-hidden bg-[#FFFFF0]">
        {/* LEFT COLUMN */}
        <div
          className="w-1/2 flex flex-col justify-center px-16 z-20"
          onMouseEnter={() => setActive('left')}
        >
          <div className="space-y-8">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500">
              Vastra Studio // Premiere
            </p>
            <h1 className="text-7xl font-light text-slate-900 tracking-tighter leading-[1.1]">
              Style & <br />
              <span className="font-serif italic text-purple-600 lowercase">Fashion</span>
            </h1>
            <p className="text-base text-slate-600 max-w-md leading-relaxed font-medium">
              Vastra brings you a seamless blend of modern trends and timeless elegance. 
              Step into a world where fashion meets identity.
            </p>

            <button
              onClick={handleScrollToCollection}
              className="mt-6 group relative px-0 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 w-fit cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-4">
                See More 
                <span className="transform group-hover:translate-y-1 transition-transform duration-300">↓</span>
              </span>
              <div className="absolute bottom-0 left-0 w-8 h-[2px] bg-purple-500 transition-all duration-500 group-hover:w-full"></div>
            </button>
          </div> 
        </div>

        {/* RIGHT COLUMN */}
        <div
          className="w-1/2 bg-purple-900 flex flex-col justify-between items-end px-12 py-16 text-white relative"
          onMouseEnter={() => setActive('right')}
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

          <div></div>

          <div className="flex flex-col items-center gap-4 mr-2 relative z-20">
            <span className="text-[9px] uppercase tracking-[0.4em] text-purple-300 [writing-mode:vertical-lr]">Scroll Matrix</span>
            <div className="w-[1px] h-24 bg-gradient-to-b from-white/60 to-transparent rounded-full"></div>
          </div>

          <div className="flex flex-col gap-6 text-lg relative z-20">
            <FaInstagram className="cursor-pointer hover:text-purple-300 transition-transform hover:scale-110 duration-300" />
            <FaFacebook className="cursor-pointer hover:text-purple-300 transition-transform hover:scale-110 duration-300" />
            <FaTwitter className="cursor-pointer hover:text-purple-300 transition-transform hover:scale-110 duration-300" />
            <FaWhatsapp className="cursor-pointer hover:text-purple-300 transition-transform hover:scale-110 duration-300" />
          </div>
        </div>

        {/* CINEMATIC LAYERED MODELS */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-screen pointer-events-none z-10 flex items-end justify-center overflow-visible">
          <img
            src={model}
            alt="model1"
            className="absolute bottom-0 h-[112%] max-w-none object-contain transition-all duration-1000 ease-out transform origin-bottom pointer-events-none"
            style={{
              opacity: active === 'left' ? 1 : 0,
              transform: active === 'left' ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)'
            }}
          />

          <img
            src={model2}
            alt="model2"
            className="absolute bottom-0 h-[100%] max-w-none object-contain transition-all duration-1000 ease-out transform origin-bottom pointer-events-none"
            style={{
              opacity: active === 'right' ? 1 : 0,
              transform: active === 'right' ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)'
            }}
          />
        </div>
      </div>

      {/* TRENDING ITEMS GRID SECTION */}
      <section
        ref={collectionRef}
        className="bg-[#FFFFF0] p-16 rounded-[4rem] border-t border-stone-200/60 scroll-mt-20 max-w-7xl mx-auto"
      >
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 mb-2">
              Seasonal Drops // 2026
            </p>
            <h2 className="text-5xl font-light tracking-tighter text-slate-900">
              New <span className="italic text-purple-500 font-serif lowercase">Trendings</span>
            </h2>
          </div>
          <button 
            onClick={() => navigate('/collections')}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-600 transition-colors border-b border-slate-200 pb-1 cursor-pointer"
          >
            View All Arrivals
          </button>
        </div>

        {/* Product Matrix using standard Productcard like Kids.jsx */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productsWithImages.map((item) => (
            <Productcard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* FOOTER CTA GATEWAY */}
      <div className="flex justify-center pb-24 bg-[#FFFFF0]">
        <button
          onClick={() => navigate('/collections')}
          className="group relative px-10 py-4 text-xs font-black uppercase tracking-[0.3em] text-slate-900 border border-slate-300 overflow-hidden rounded-full transition-colors duration-300 cursor-pointer"
        >
          <span className="absolute inset-0 bg-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
            See All Collections →
          </span>
        </button>
      </div>

      <Footer />
    </div>
  )
}

export default Landing
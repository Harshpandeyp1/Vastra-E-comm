import React, { useEffect, useState } from 'react'
import ShopNav from '../Components/ShopNav'
import Footer from '../Components/Footer'
import { getWishlist, removeFromWishlist } from "../Service/Wishlist"
import { Link } from "react-router-dom"

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"))
        if (!user) {
          setLoading(false)
          return
        }

        const data = await getWishlist(user.id)
        setWishlist(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error loading wishlist:", error)
      } finally {
        setLoading(false)
      }
    }

    loadWishlist()
  }, [])

  const handleRemove = async (wishlistId) => {
    try {
      await removeFromWishlist(wishlistId)
      setWishlist(wishlist.filter(item => item.id !== wishlistId))
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    }
  }

  // Exactly like Women.jsx: Map to .img
  const wishlistWithImages = wishlist.map((item) => ({
    ...item,
    img: item.product?.imageUrl || item.imageUrl
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
    <div className="min-h-screen flex flex-col bg-linear-to-r from-purple-200/40 via-indigo-300/30 to-violet-400/40 font-sans">
      <ShopNav />

      <div className="max-w-7xl mx-auto w-full px-6 flex-1 pt-32 pb-20">
        {/* Header Sector */}
        <div className="text-center mb-20 relative">
          <div className="absolute inset-0 -top-10 flex justify-center items-center opacity-[0.03] select-none pointer-events-none">
            <h1 className="text-[180px] font-black text-slate-900 tracking-tighter">
              DESIRE
            </h1>
          </div>

          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-purple-500 mb-4">
              Personal Archive // Selected Pieces
            </p>
            <h2 className="text-5xl font-light text-slate-900 tracking-tighter uppercase leading-none">
              VASTRA <span className="font-serif italic text-purple-600 lowercase">Wishlist</span>
            </h2>
          </div>
        </div>

        {/* Content Grid */}
        {wishlistWithImages.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-24 bg-white/20 backdrop-blur-xl rounded-[3rem] border border-white/40 shadow-2xl">
            <p className="text-[10px] pb-1.5 font-black uppercase tracking-widest text-slate-400">
              Archive currently empty
            </p>
            <Link
              to="/main"
              className="mt-6 inline-block px-6 py-3 bg-slate-950 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-purple-600 transition-all active:scale-95"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {wishlistWithImages.map((item) => (
              <div key={item.id} className="group relative">
                {/* Image Container */}
                <div className="relative aspect-3/4 overflow-hidden rounded-4xl bg-stone-100 shadow-2xl shadow-purple-900/10">
                  <img
                    src={item.img}
                    alt={item.product?.name || "Product"}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />

                  {/* Floating Action Overlay */}
                  <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/80 transition-colors cursor-pointer"
                    >
                      Remove from Archive
                    </button>
                  </div>
                </div>

                {/* Info Sector */}
                <div className="mt-6 px-2 text-center">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
                    {item.product?.name}
                  </h2>
                  <p className="text-sm font-light text-slate-600">
                    ₹{item.product?.price?.toLocaleString()}
                  </p>

                  <div className="mt-3 h-px w-8 bg-purple-200 mx-auto group-hover:w-16 transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Wishlist
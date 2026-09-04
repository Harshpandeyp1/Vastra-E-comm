import React, { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from "../Service/Wishlist"

// Standard fallback if an image is missing or broken
const PLACEHOLDER_IMG = "https://via.placeholder.com/300x400?text=No+Image"

const Product = () => {
  const [products, setProducts] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  const userId = 1

  // Load wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await getWishlist(userId)
        setWishlist(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching wishlist:", err)
      }
    }

    loadWishlist()
  }, [userId])

  // Load products
  useEffect(() => {
    fetch('http://localhost:8081/api/home')
      .then(response => response.json())
      .then(data => {
        setProducts(data?.trendings || [])
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching products:', error)
        setLoading(false)
      })
  }, [])

  // Helper to format image URLs
  const getImageUrl = (item) => {
    if (!item?.imageUrl) return PLACEHOLDER_IMG
    // Prepends backend server if image is stored as relative path (e.g., /uploads/img.jpg)
    if (item.imageUrl.startsWith('/')) {
      return `http://localhost:8081${item.imageUrl}`
    }
    return item.imageUrl
  }

  // Check if item is already in wishlist
  const isWishlisted = (id) => {
    if (!Array.isArray(wishlist)) return false
    return wishlist.some(item => item?.product?.id === id)
  }

  const handleWishlist = async (product) => {
    try {
      if (isWishlisted(product.id)) {
        const wishlistItem = wishlist.find(item => item?.product?.id === product.id)
        if (wishlistItem) {
          await removeFromWishlist(wishlistItem.id)
        }
      } else {
        await addToWishlist(userId, product.id)
      }

      const updated = await getWishlist(userId)
      setWishlist(Array.isArray(updated) ? updated : [])
    } catch (err) {
      console.error("Wishlist action failed:", err)
    }
  }

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
    <section className="w-full px-8 py-24 bg-[#FFFFF0]">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-2xl font-bold text-purple-400 tracking-[0.3em] uppercase mb-3">
          Our Collection
        </h2>
        <h3 className="text-5xl font-black text-slate-900 tracking-tight">
          Featured
          <span className="font-serif italic font-medium text-purple-600">
            {" "}Products
          </span>
        </h3>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col cursor-pointer"
          >
            {/* Image Box */}
            <div className="relative aspect-[3/4] rounded-3xl bg-purple-100 overflow-hidden border border-purple-100/20">
              {/* Badge */}
              {item.tag && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-white text-[10px] font-bold uppercase tracking-widest text-purple-600 rounded-full shadow-sm">
                  {item.tag}
                </span>
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleWishlist(item)
                }}
                className={`absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full transition shadow-sm ${
                  isWishlisted(item.id) ? "text-red-500" : "text-slate-400"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted(item.id) ? "fill-red-500" : ""
                  }`}
                />
              </button>

              {/* Product Image */}
              <img
                src={getImageUrl(item)}
                alt={item.name || 'Product'}
                className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-in-out"
                onError={(e) => {
                  e.currentTarget.onerror = null // Prevent infinite loop
                  e.currentTarget.src = PLACEHOLDER_IMG
                }}
              />
            </div>

            {/* Details */}
            <div className="mt-5 px-1">
              <div className="flex justify-between items-start">
                <h4 className="text-base font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                  {item.name}
                </h4>
                <p className="font-bold text-slate-900">
                  ₹{item.price}
                </p>
              </div>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
                Premium Quality
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Product
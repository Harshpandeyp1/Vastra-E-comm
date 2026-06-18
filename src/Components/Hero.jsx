import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import poster1 from '../assets/poster1.jpg'
import poster2 from '../assets/poster2.jpg'
import poster3 from '../assets/poster3.jpg'
import poster4 from '../assets/poster4.jpg'

const posters = [poster1, poster2, poster3, poster4]

const Hero = () => {
  const [index, setIndex] = useState(0)

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
        //last ke bad first first image
      setIndex((prev) => (prev + 1) % posters.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
<div className="px-6 mt-20">
  <div className="relative w-full h-[80vh] overflow-hidden rounded-3xl shadow-xl">

    <img
      src={posters[index]}
      className="w-full h-full object-cover transition-all duration-700"
    />

    <div className="absolute inset-0 bg-black/20"></div>

    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-widest">
          NEW SEASON ARRIVALS
        </h1>

        <p className="mt-4 text-sm md:text-lg text-white/80">
          Discover premium fashion crafted for your style
        </p>

        <Link to="/Trending" className="mt-6 px-6 py-2 bg-white text-black font-semibold rounded-full hover:scale-105 transition">
          Shop Now
        </Link>

      </div>
</div>
    </div>
  )
}

export default Hero
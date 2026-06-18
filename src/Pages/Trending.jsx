import React from 'react'
import img1 from '../assets/men1.jpg'
import { useState, useEffect } from 'react'
import img2 from '../assets/men2.jpg'
import img3 from '../assets/men3.jpg'
import jacket from '../assets/jacket.jpg'
import cord from '../assets/cord.jpg'
import hodie from '../assets/hodie.jpg'
import track from '../assets/track.jpg'
import ShopNav from '../Components/ShopNav'
import AutoScroller from '../Components/AutoScroller'
import Productcard from '../Components/Productcard'
import Footer from '../Components/Footer'
import Trending from '../assets/trending.jpg'

const Trendings = () => {
  const [products,setproducts] =useState([]);
  const[loading, setLoading] = useState(true)
  const TrendingImages = [img1, img2, img3]
useEffect(() => {
    fetchTrendingProducts();
  }, [])
  // ✅ ADD IDs + FIX PRICE TYPE
  const fetchTrendingProducts = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/products/category/TRENDING');
      const data = await response.json();
      setproducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  if(loading) {
    return <h1 className='text-center mt-20 text-2xl font-bold text-slate-900'>Loading...</h1>
  }
  const imageMap = {
  "cord.jpg": cord,
  "hoodie.jpg": hodie,
  "track.jpg": track,
  "jacket.jpg": jacket
};
const productsWithImages = products.map(product => ({
  ...product,
  img: imageMap[product.imageUrl]
}));


  return (
    <div className="w-full bg-gradient-to-r from-purple-200/40 via-indigo-300/30 to-violet-400/40">

      <ShopNav />

      {/* HERO */}
      <div className="relative w-full h-[70vh] mt-20">
        <img
          src={Trending}
          alt="Trending Section"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-black tracking-widest">
            TRENDING COLLECTION
          </h1>

          <p className="text-white text-lg md:text-xl mt-2">
            STYLE WITH CONFIDENCE
          </p>
        </div>
      </div>

      {/* SCROLLER */}
      <AutoScroller images={TrendingImages} />

      {/* HEADING */}
      <div className="text-center mb-24 relative">
       <div className="absolute inset-0 -top-6 flex justify-center items-center opacity-[0.04] select-none pointer-events-none">
          <h1 className="text-[140px] font-black text-slate-900 tracking-tighter uppercase">STREET</h1>
       </div>
       <div className="relative z-10">
          <h2 className="text-[10px] font-black text-purple-500 tracking-[0.5em] uppercase mb-4">
            TRENDY COLLECTION
          </h2>
          <h3 className="text-5xl font-light text-slate-900 tracking-tighter uppercase">
            FROM TOP BRANDS <span className="font-serif italic text-purple-600 lowercase">Essentials</span>
          </h3>
       </div>
    </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 pb-10">
          {productsWithImages.map((item) => (
  <Productcard key={item.id} item={item} />
))}
      </div>

      <Footer />

    </div>
  )
}

export default Trendings
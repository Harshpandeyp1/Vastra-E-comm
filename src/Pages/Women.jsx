import React from 'react'
import { useState, useEffect } from 'react'
import ShopNav from '../Components/ShopNav'
import img1 from '../assets/men1.jpg'
import Img2 from '../assets/men2.jpg'
import Img3 from '../assets/men3.jpg'
import dress from '../assets/dress.jpg'
import skirt from '../assets/skirt.jpg'
import gown from '../assets/gown.jpg'
import streetwomen from '../assets/streetwomen.jpg'
import WomenSection from '../assets/WomenSection.jpg'
import AutoScroller from '../Components/AutoScroller'
import Productcard from '../Components/Productcard'
import Footer from '../Components/Footer'

const Women = () => {
const [products,setproducts]=useState([]);
const[loading,setloading]=useState(true);
  const WomenImages = [img1, Img2, Img3]
 useEffect(() => {
    fetchWomenProducts();
  }, [])
   const fetchWomenProducts = async () => {
     try {
     const response = await fetch(
        'http://localhost:8081/api/products/category/WOMEN'
     );
  
     const data = await response.json();
  
     setproducts(data);
  
  } catch(error) {
     console.error(error);
  } finally {
     setloading(false);
  }
    }
    if(loading) {
      return <h1 className='text-center mt-20 text-2xl font-bold text-slate-900'>Loading...</h1>
    }
    const imageMap = {
    "dress.jpg": dress,
    "skirt.jpg": skirt,
    "gown.jpg": gown,
    "streetwomen.jpg": streetwomen
  };
  const productsWithImages = products.map(product => ({
    ...product,
    img: imageMap[product.imageUrl]
  }));
  return (
    <div className="w-full bg-gradient-to-r from-purple-200/40 via-indigo-300/30 to-violet-400/40">

      <ShopNav />

      {/* HERO IMAGE */}
      <div className="relative w-full h-[70vh] mt-20">
        <img
          src={WomenSection}
          alt="Women Section"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-black tracking-widest">
            WOMEN COLLECTION
          </h1>

          <p className="text-white text-lg md:text-xl mt-2">
            STYLE WITH CONFIDENCE
          </p>
        </div>
      </div>

      {/* SCROLLER */}
      <AutoScroller images={WomenImages} />

      {/* HEADING */}
       <div className="text-center mb-24 relative">
       <div className="absolute inset-0 -top-6 flex justify-center items-center opacity-[0.04] select-none pointer-events-none">
          <h1 className="text-[140px] font-black text-slate-900 tracking-tighter uppercase">BEAUTY</h1>
       </div>
       <div className="relative z-10">
          <h2 className="text-[10px] font-black text-purple-500 tracking-[0.5em] uppercase mb-4">
            WOMENs COLLECTION
          </h2>
          <h3 className="text-5xl font-light text-slate-900 tracking-tighter uppercase">
            FROM TOP BRANDS <span className="font-serif italic text-purple-600 lowercase">Essentials</span>
          </h3>
       </div>
    </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 pb-10">
         {productsWithImages.map((item) => (
  <Productcard key={item.id} item={item} />
))}
      </div>

      <Footer />

    </div>
  )
}

export default Women
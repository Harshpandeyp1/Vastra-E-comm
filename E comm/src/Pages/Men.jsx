import React from 'react'
import { useState, useEffect } from 'react'
import MenSection from '../assets/MenSection.jpg'
import ShopNav from '../Components/ShopNav'
import img1 from '../assets/men1.jpg'
import img2 from '../assets/men2.jpg'
import img3 from '../assets/men3.jpg'
import AutoScroller from '../Components/AutoScroller'
import Productcard from '../Components/Productcard'
import Footer from '../Components/Footer'
import jacket from '../assets/jacket.jpg'
import shirt from '../assets/shirt.jpg'
import hodie from '../assets/hodie.jpg'
import streetmen from '../assets/streetmen.jpg'

const Men = () => {
  const [products,setproducts] =useState([]);
  const[loading, setLoading] = useState(true)
  const menImages = [img1, img2, img3]
  useEffect(() => {
    fetchMenProducts();
  }, [])

  const fetchMenProducts = async () => {
   try {
   const response = await fetch(
      'http://localhost:8081/api/products/category/MEN'
   );

   const data = await response.json();

   setproducts(data);

} catch(error) {
   console.error(error);
} finally {
   setLoading(false);
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
  );
}
  const imageMap = {
  "jacket.jpg": jacket,
  "shirt.jpg": shirt,
  "hoodie.jpg": hodie,
  "streetmen.jpg": streetmen
};
const productsWithImages = products.map(product => ({
  ...product,
  img: imageMap[product.imageUrl]
}));
  return (
    <div className="w-full bg-[#FFFFF0]">

      <ShopNav />

      {/* HERO */}
      <div className="relative w-full h-[70vh] mt-20">
        <img
          src={MenSection}
          alt="Men Section"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-black tracking-widest">
            MEN COLLECTION
          </h1>

          <p className="text-white text-lg md:text-xl mt-2">
            STYLE WITH CONFIDENCE
          </p>
        </div>
      </div>

      {/* SCROLLER */}
      <AutoScroller images={menImages} />

      {/* HEADING */}
        <div className="text-center mb-24 relative">
       <div className="absolute inset-0 -top-6 flex justify-center items-center opacity-[0.04] select-none pointer-events-none">
          <h1 className="text-[140px] font-black text-slate-900 tracking-tighter uppercase">SIGMA</h1>
       </div>
       <div className="relative z-10">
          <h2 className="text-[10px] font-black text-purple-500 tracking-[0.5em] uppercase mb-4">
            MENs COLLECTION
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

export default Men
import React from 'react'
import ShopNav from '../Components/ShopNav'
import Hero from '../Components/Hero'
import Categories from '../Components/Categories'
import Products from '../Components/Products'
import Footer from '../Components/Footer'
import Chat from '../Components/Chatbot/Chat'
import TopBrands from '../Components/Brands'
const Mainpage = () => {
  return (
    <div className="min-h-screen bg-[#FFFFF0]">
      
      <ShopNav />

      {/* spacing for fixed navbar */}
      <div className="pt-3">
        <Hero />
      </div>

      {/* Categories section */}
      <div >
        <Categories />
      </div>
      <div >
        <Products />
        <Chat/>
        <TopBrands />
      </div>
       
      <Footer />
    </div>
  )
}

export default Mainpage
import React from 'react'
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-black text-white px-16 py-20 mt-20">

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div>

          <h1 className="text-2xl font-black tracking-[0.4em]">
            VASTRA
          </h1>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            Redefining fashion with a blend of modern trends and timeless elegance.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4">
            <Link to="/outlet" className="hover:text-white">Shop</Link>
          </h2>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <Link to="/trending" className="hover:text-white cursor-pointer block">New Arrivals</Link>
            </li>
            <li>
              <Link to="/men" className="hover:text-white cursor-pointer block">Men</Link>
            </li>
            <li>
              <Link to="/women" className="hover:text-white cursor-pointer block">Women</Link>
            </li>
            <li>
              <Link to="/collections" className="hover:text-white cursor-pointer block">Collections</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4">
            <Link to="/contact" className="hover:text-white">Support</Link>
          </h2>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <Link to="/contact" className="hover:text-white cursor-pointer block">Contact</Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white cursor-pointer block">FAQ</Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-white cursor-pointer block">Shipping</Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-white cursor-pointer block">Returns</Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4">
            Follow Us
          </h2>

          <div className="flex gap-4 text-xl text-gray-400">
            <FaInstagram className="hover:text-white cursor-pointer transition" />
            <FaFacebook className="hover:text-white cursor-pointer transition" />
            <FaTwitter className="hover:text-white cursor-pointer transition" />
            <FaWhatsapp className="hover:text-white cursor-pointer transition" />
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">

        <p>© 2026 VASTRA. All rights reserved.</p>

        <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-white cursor-pointer">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white cursor-pointer">Terms</Link>
          <Link to="/cookies" className="hover:text-white cursor-pointer">Cookies</Link>
        </div>

      </div>

    </footer>
  )
}

export default Footer
import React, { useEffect, useState } from "react";
import ShopNav from "../Components/ShopNav";
import Footer from "../Components/Footer";
import { getProfile, logout } from "../service/Profile";
import { useNavigate, Link } from "react-router-dom";

const Profile = () => {

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Load user
  useEffect(() => {

    const currentUser = getProfile();

    setUser(currentUser);

  }, []);

  // Logout
  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-40  bg-gradient-to-r from-purple-200/40 via-indigo-300/30 to-violet-400/40 font-sans">

      <ShopNav />

      <div className="w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden grid md:grid-cols-[320px_1fr]">

  {/* LEFT SIDEBAR */}
  <div className="bg-slate-950 text-white p-10 flex flex-col items-center relative overflow-hidden">

    {/* Background Glow */}
    <div className="absolute w-72 h-72 bg-purple-600/20 rounded-full blur-3xl top-0 -left-20"></div>

    {/* Profile Image */}
    <div className="relative z-10">
      <img
        src="https://i.pravatar.cc/200"
        alt="Profile"
        className="w-36 h-36 rounded-[2rem] object-cover border-4 border-white/20 shadow-2xl"
      />

      <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-400 border-4 border-slate-950"></div>
    </div>

    {/* Name */}
    <h1 className="mt-8 text-3xl font-black uppercase tracking-tight text-center">
      {user?.name || "Guest User"}
    </h1>

    {/* Email */}
    <p className="mt-3 text-slate-400 text-sm text-center break-all">
      {user?.email || "guest@vastra.com"}
    </p>

    {/* Member Badge */}
    <div className="mt-8 px-5 py-2 rounded-full border border-purple-500 text-[10px] uppercase tracking-[0.3em] font-bold text-purple-300">
      Premium Member
    </div>

    {/* Logout */}
    <button
      onClick={handleLogout}
      className="mt-auto w-full bg-white/10 hover:bg-red-500 transition-all py-4 rounded-2xl font-bold uppercase tracking-widest text-xs backdrop-blur-lg"
    >
      Logout
    </button>

  </div>

  {/* RIGHT CONTENT */}
  <div className="p-10 md:p-14">

    {/* Heading */}
    <div className="flex items-center justify-between border-b border-slate-100 pb-6">

      <div>
        <p className="text-purple-500 uppercase tracking-[0.3em] text-xs font-black">
          Dashboard
        </p>

        <h2 className="text-4xl font-black text-slate-900 mt-2">
          My Account
        </h2>
      </div>

      <div className="hidden md:flex items-center gap-2 bg-emerald-100 text-emerald-600 px-4 py-2 rounded-full text-xs font-bold">
        Active Session
      </div>

    </div>

    {/* Stats */}
    <div className="grid grid-cols-3 gap-4 mt-10">

      <div className="bg-purple-50 rounded-3xl p-6">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
          Orders
        </p>

        <h3 className="text-4xl font-black mt-3 text-slate-900">
          12
        </h3>
      </div>

      <div className="bg-pink-50 rounded-3xl p-6">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
          Wishlist
        </p>

        <h3 className="text-4xl font-black mt-3 text-slate-900">
          08
        </h3>
      </div>

      <div className="bg-indigo-50 rounded-3xl p-6">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
          Cart
        </p>

        <h3 className="text-4xl font-black mt-3 text-slate-900">
          03
        </h3>
      </div>

    </div>

    {/* Quick Actions */}
    <div className="mt-12">

      <h3 className="text-lg font-black text-slate-900 mb-5">
        Quick Actions
      </h3>

      <div className="grid sm:grid-cols-2 gap-5">

        <Link
          to="/order"
          className="group bg-slate-950 text-white p-7 rounded-3xl hover:bg-purple-600 transition-all"
        >
          <p className="text-xs uppercase tracking-[0.3em] opacity-60">
            Track
          </p>

          <h4 className="mt-4 text-2xl font-black">
            My Orders
          </h4>

          <p className="mt-2 text-sm opacity-70">
            Track and manage your purchases.
          </p>
        </Link>

        <Link
          to="/wishlist"
          className="group border border-slate-200 p-7 rounded-3xl hover:border-purple-500 hover:bg-purple-50 transition-all"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Saved
          </p>

          <h4 className="mt-4 text-2xl font-black text-slate-900">
            Wishlist
          </h4>

          <p className="mt-2 text-sm text-slate-500">
            Your favourite saved fashion items.
          </p>
        </Link>

      </div>

    </div>

  </div>

</div>

      <Footer />

    </div>
  );
};

export default Profile;
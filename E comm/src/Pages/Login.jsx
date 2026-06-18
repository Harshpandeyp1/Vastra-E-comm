import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import login from '../assets/login.jpg'
import { Mail, Lock, User } from 'lucide-react';
import Footer from '../Components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [uiError, setUiError] = useState('');
  const [uiMessage, setUiMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear alerts dynamically as the user modifies inputs
    setUiError('');
    setUiMessage('');
  };

  const handleSignup = async () => {
    try {
      setUiError('');
      setUiMessage('');
      const response = await fetch('http://localhost:8081/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.text();
      
      if (!response.ok) {
        setUiError(data || 'An error occurred during registration.');
      } else {
        setUiMessage(data || 'Registration successful! Switch to login.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setUiError('Network communication failure. Please check your backend connection.');
    }
  };

  const handleLogin = async () => {
    try {
      setUiError('');
      setUiMessage('');
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.text();
      
      if (data === "Login Successful") {
        setUiMessage(data);
        setTimeout(() => {
          navigate('/main');
        }, 1000); // Small timeout so the user sees the confirmation UI status
      } else {
        setUiError(data || 'Invalid authentication parameters provided.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setUiError('Network communication failure. Please check your backend connection.');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">

      {/* Background */}
      <img
        src={login}
        alt="Login Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* LOGIN WRAPPER (FIXED CENTERING) */}
      <div className="w-full flex justify-end px-4 pr-40">

        {/* Login Box */}
        <div className="w-full max-w-md bg-[#0b0b0f] flex items-center justify-center p-6 font-sans relative overflow-hidden rounded-[3rem] shadow-lg">

          {/* Glow */}
          <div className="absolute w-[400px] h-[400px] bg-white/10 rounded-full blur-[120px] -z-10 animate-pulse" />
          <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-gray-500/10 rounded-full blur-[140px] -z-10" />

          {/* Card */}
          <div className="w-full rounded-[2.5rem] p-10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 relative overflow-hidden">

            {/* Corner Accent */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <div className="w-20 h-20 border-t-2 border-r-2 border-white rounded-tr-3xl" />
            </div>

            {/* Brand */}
            <div className="flex flex-col items-center justify-center mb-8 group cursor-pointer">
              {/* Logo */}
              <div className="relative w-12 h-12 text-white flex items-center justify-center border border-white/20 group-hover:bg-slate-900 transition-all duration-500">
                <span className="text-white group-hover:text-purple-400 font-black text-2xl transition-colors">
                  V
                </span>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r border-b border-purple-500"></div>
              </div>

              {/* Brand Text */}
              <div className="flex flex-col items-center mt-3">
                <h1 className="text-3xl text-white tracking-[0.6em] leading-none font-light">
                  VASTRA
                </h1>

                <div className="flex items-center gap-2 mt-2">
                  <div className="h-[1px] w-10 bg-purple-400"></div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">
                    Welcome Back
                  </span>
                  <div className="h-[1px] w-10 bg-purple-400"></div>
                </div>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="relative flex bg-white/5 rounded-2xl p-1.5 mb-6 border border-white/10">
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-transform duration-500 ease-out ${
                  isLogin ? "translate-x-0" : "translate-x-full"
                }`}
              />

              <button
                type="button"
                onClick={() => { setIsLogin(true); setUiError(''); setUiMessage(''); }}
                className={`relative z-10 flex-1 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                  isLogin ? "text-black" : "text-gray-400"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => { setIsLogin(false); setUiError(''); setUiMessage(''); }}
                className={`relative z-10 flex-1 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                  !isLogin ? "text-black" : "text-gray-400"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* DYNAMIC ALERT RENDERING SECTOR */}
            {uiError && (
              <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-left backdrop-blur-md transition-all">
                <p className="text-[9px] font-black tracking-widest text-red-400 uppercase">System Error // Rejected</p>
                <p className="text-xs text-red-200 mt-0.5 font-medium">{uiError}</p>
              </div>
            )}

            {uiMessage && (
              <div className="mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-left backdrop-blur-md transition-all">
                <p className="text-[9px] font-black tracking-widest text-emerald-400 uppercase">Response // Confirmed</p>
                <p className="text-xs text-emerald-200 mt-0.5 font-medium">{uiMessage}</p>
              </div>
            )}

            {/* FORM */}
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (isLogin) {
                  handleLogin();
                } else {
                  handleSignup();
                }
              }}
            >
              {!isLogin && (
                <div className="group relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full pl-11 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-all text-sm"
                  />
                </div>
              )}

              <div className="group relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full pl-11 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-all text-sm"
                />
              </div>

              <div className="group relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-11 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-all text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-purple-600 hover:text-white transition-all duration-300 mt-2 active:scale-[0.98] shadow-xl shadow-black/40"
              >
                {isLogin ? "ENTER STORE" : "JOIN THE CLUB"}
              </button>
            </form>

            {/* Footer inside card */}
            <footer className="mt-8 text-center">
              <p className="text-[10px] text-gray-600 italic tracking-wide">
                Handcrafted luxury. Since 2024.
              </p>
            </footer>

          </div>
        </div>
      </div>
      
      <footer className="fixed bottom-0 left-0 w-full flex justify-center gap-2 text-[10px] bg-black text-gray-500 py-3 border-t border-white/5 tracking-wider z-50">
        <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
        <span>•</span>
        <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</span>
        <span>•</span>
        <span>© {new Date().getFullYear()} VASTRA DIGITAL CO.</span>
      </footer>
    </div>
  )
}

export default Login;
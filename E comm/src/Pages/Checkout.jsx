import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  MapPin, 
  ShoppingBag, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react'
import ShopNav from '../Components/ShopNav'
import Footer from '../Components/Footer'
import { getCart } from '../Service/Cart'
import { placeOrder } from '../Service/Order'
import { getProfile } from '../Service/Profile'
import { loadRazorpayScript } from '../Service/loadRazorpay'
import { getImageUrl } from '../utils/imageHelpers'

const RAZORPAY_KEY_ID = "rzp_test_TXvLcFxaOElwbH"

const PLACEHOLDER_IMG =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22150%22%20height%3D%22150%22%20viewBox%3D%220%200%20150%20150%22%3E%3Crect%20fill%3D%22%23262626%22%20width%3D%22150%22%20height%3D%22150%22%2F%3E%3Ctext%20fill%3D%22%23888%22%20font-family%3D%22sans-serif%22%20font-size%3D%2213%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EVASTRA%3C%2Ftext%3E%3C%2Fsvg%3E"

const Checkout = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)
  const [showItemList, setShowItemList] = useState(true)

  const isAutoRetrying = useRef(false)

  // Load saved address or default
  const [addressForm, setAddressForm] = useState(() => {
    try {
      const saved = sessionStorage.getItem("saved_checkout_address")
      if (saved) return JSON.parse(saved)
    } catch {
      // Fallback
    }
    return {
      fullName: '',
      phone: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      postalCode: '',
      type: 'HOME'
    }
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = getProfile()
        if (!profile) {
          navigate("/login")
          return
        }
        setUser(profile)

        setAddressForm((prev) => ({
          ...prev,
          fullName: prev.fullName || profile.name || 'Shopper',
          phone: prev.phone || profile.phone || '9999999999',
          street: prev.street || 'Main Street, Flat 402',
          city: prev.city || 'Mumbai',
          state: prev.state || 'Maharashtra',
          postalCode: prev.postalCode || '400001'
        }))

        const cartData = await getCart(profile.id)
        const activeCart = Array.isArray(cartData) ? cartData : []
        setCart(activeCart)

        // Handle direct retry flag from Agent (?retry=true)
        if (searchParams.get("retry") === "true" && !isAutoRetrying.current) {
          isAutoRetrying.current = true
          setSearchParams({}, { replace: true })
          setTimeout(() => {
            triggerPayment(profile, activeCart)
          }, 400)
        }
      } catch (error) {
        console.error("Failed to load checkout data", error)
      }
    }

    loadData()
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAddressForm((prev) => {
      const updated = { ...prev, [name]: value }
      sessionStorage.setItem("saved_checkout_address", JSON.stringify(updated))
      return updated
    })
  }

  // Subtotal calculation
  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.product?.price || item.price || 0)
    const qty = Number(item.quantity || 1)
    return sum + (price * qty)
  }, 0)

  const deliveryFee = subtotal > 1999 || subtotal === 0 ? 0 : 99
  const totalAmount = subtotal + deliveryFee

  const cartWithImages = cart.map((item) => {
    return {
      ...item,
      resolvedImage: getImageUrl ? getImageUrl(item.product || item) : PLACEHOLDER_IMG
    }
  })

  const getFormattedAddress = () => {
    const parts = [
      addressForm.street || 'Main Street',
      addressForm.landmark ? `Near ${addressForm.landmark}` : '',
      addressForm.city || 'Mumbai',
      addressForm.state || 'Maharashtra',
      addressForm.postalCode ? `PIN: ${addressForm.postalCode}` : '400001'
    ].filter(Boolean)

    return `${addressForm.fullName || 'Shopper'} (${addressForm.type}) | Ph: ${addressForm.phone || '9999999999'} | ${parts.join(', ')}`
  }

  const triggerPayment = async (currentUser = user, currentCart = cart) => {
    console.log("[Razorpay] Triggering payment flow...");

    const activeCart = currentCart && currentCart.length > 0 ? currentCart : cart
    if (!activeCart || activeCart.length === 0) {
      alert("Your cart is empty. Please add items to checkout.")
      return
    }

    setLoading(true)

    // Save address for reuse
    sessionStorage.setItem("saved_checkout_address", JSON.stringify(addressForm))

    // 1. Load SDK
    const isLoaded = await loadRazorpayScript()
    if (!isLoaded || !window.Razorpay) {
      console.error("[Razorpay] Failed to load checkout.js SDK")
      alert("Failed to load Razorpay SDK. Please check your network connection.")
      setLoading(false)
      return
    }

    // 2. Compute Amount safely
    const currentSubtotal = activeCart.reduce((sum, item) => {
      const price = Number(item.product?.price || item.price || 0)
      const qty = Number(item.quantity || 1)
      return sum + (price * qty)
    }, 0)

    const fee = currentSubtotal > 1999 || currentSubtotal === 0 ? 0 : 99
    const payable = currentSubtotal + fee
    const amountInPaise = Math.round((payable || 999) * 100)

    const formattedAddress = getFormattedAddress()
    const activeUser = currentUser || user || { id: 1, name: "Customer", email: "customer@example.com", phone: "9999999999" }

    console.log("[Razorpay] Opening gateway with amount:", amountInPaise, "paise");

    // 3. Configure Razorpay Options
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: "INR",
      name: "VASTRA Studio",
      description: `Order Checkout (${activeCart.length} item${activeCart.length === 1 ? '' : 's'})`,
      prefill: {
        name: addressForm.fullName || activeUser?.name || "Customer",
        email: activeUser?.email || "customer@example.com",
        contact: addressForm.phone || activeUser?.phone || "9999999999"
      },
      theme: {
        color: "#7c3aed"
      },
      handler: async function (response) {
        console.log("[Razorpay] Payment Success!", response)
        try {
          const orderData = {
            userId: activeUser.id,
            address: formattedAddress,
            items: activeCart,
            paymentId: response.razorpay_payment_id,
            paymentStatus: 'PAID'
          }

          const res = await placeOrder(orderData)
          sessionStorage.removeItem("agent_checkout_context")

          navigate('/success', {
            state: {
              orderId: res?.id ?? res?.orderId ?? response.razorpay_payment_id,
              status: 'PAID',
              totalPrice: payable,
              address: formattedAddress,
              items: activeCart
            }
          })
        } catch (orderErr) {
          console.error('[Razorpay] Order recording error:', orderErr)
          alert('Payment succeeded! Reference ID: ' + response.razorpay_payment_id)
        } finally {
          setLoading(false)
        }
      },
      modal: {
        ondismiss: function () {
          console.log("[Razorpay] Modal dismissed by user")
          setLoading(false)
          sessionStorage.setItem(
            "agent_checkout_context",
            JSON.stringify({
              status: "DISMISSED",
              cartTotal: payable,
              itemCount: activeCart.length
            })
          )
          window.dispatchEvent(new CustomEvent("agent-checkout-interrupted"))
        }
      }
    }

    try {
      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', function (resp) {
        console.warn("[Razorpay] Payment Failed:", resp)
        setLoading(false)
        const reason = resp.error?.description || "Transaction canceled or declined"
        sessionStorage.setItem(
          "agent_checkout_context",
          JSON.stringify({
            status: "FAILED",
            reason: reason,
            cartTotal: payable,
            itemCount: activeCart.length
          })
        )
        window.dispatchEvent(new CustomEvent("agent-checkout-interrupted"))
      })

      paymentObject.open()
    } catch (err) {
      console.error("[Razorpay] Error opening payment modal:", err)
      setLoading(false)
      alert("Unable to open Razorpay modal: " + err.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-200/40 via-indigo-300/30 to-violet-400/40 font-sans">
      <ShopNav />

      <main className="max-w-6xl mx-auto w-full px-6 flex-1 py-28 md:py-36">
        <div className="mb-8">
          <Link 
            to="/cart" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-purple-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
        </div>

        <div className="mb-12 relative">
          <div className="absolute -left-6 -top-6 text-[100px] md:text-[130px] font-black text-purple-900/5 select-none leading-none uppercase pointer-events-none">
            Checkout
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-600 mb-2">
              Dispatch Verification // Tier 1
            </p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tighter text-slate-900 leading-none">
              VASTRA <span className="italic text-purple-600 font-serif lowercase">Fulfillment</span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Shipping Form */}
          <div className="lg:col-span-7 bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/60 shadow-2xl shadow-purple-900/5">
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-900/10">
              <div className="p-3 bg-purple-100/70 text-purple-700 rounded-2xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Shipping Address
                </h2>
                <p className="text-[11px] text-slate-500">
                  Where should we send your parcel?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black tracking-widest uppercase text-slate-500 block mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={addressForm.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-white/90 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-black tracking-widest uppercase text-slate-500 block mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={addressForm.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  className="w-full bg-white/90 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black tracking-widest uppercase text-slate-500 block mb-1">
                  Street Address *
                </label>
                <textarea
                  rows="2"
                  name="street"
                  value={addressForm.street}
                  onChange={handleInputChange}
                  placeholder="Apartment, door number, street..."
                  className="w-full bg-white/90 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-black tracking-widest uppercase text-slate-500 block mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={addressForm.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Mumbai"
                  className="w-full bg-white/90 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-black tracking-widest uppercase text-slate-500 block mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={addressForm.state}
                  onChange={handleInputChange}
                  placeholder="e.g. Maharashtra"
                  className="w-full bg-white/90 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-black tracking-widest uppercase text-slate-500 block mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={addressForm.postalCode}
                  onChange={handleInputChange}
                  placeholder="6-digit PIN"
                  maxLength="6"
                  className="w-full bg-white/90 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-5 text-[11px] text-slate-500">
                <Truck className="w-4 h-4 text-purple-600" />
                <span>Express courier delivery in 3-5 business days</span>
              </div>
            </div>
          </div>

          {/* Order Summary & Button */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-2xl shadow-purple-900/5">
              <div className="flex items-center justify-between pb-5 border-b border-slate-900/10">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-purple-600" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">
                    Order Summary ({cart.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowItemList(!showItemList)}
                  className="text-slate-500 hover:text-slate-800 transition text-xs flex items-center gap-1 cursor-pointer"
                >
                  {showItemList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showItemList && (
                <div className="py-4 divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                  {cartWithImages.map((item, idx) => {
                    const name = item.product?.name || item.name || item.title || `Item ${idx + 1}`
                    const qty = item.quantity || 1
                    const price = Number(item.product?.price || item.price || 0)

                    return (
                      <div key={item.id || idx} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={item.resolvedImage} 
                            alt={name} 
                            className="w-12 h-12 object-cover rounded-xl bg-purple-50 shrink-0 border border-slate-100"
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src = PLACEHOLDER_IMG
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Qty: {qty} × ₹{price.toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="text-xs font-black text-slate-900 shrink-0 font-mono">
                          ₹{(price * qty).toLocaleString()}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="pt-4 space-y-3 font-mono text-xs border-t border-slate-900/10">
                <div className="flex justify-between text-slate-500">
                  <span>Bag Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping & Delivery</span>
                  <span>{deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                <div className="pt-3 border-t border-dashed border-slate-300 flex justify-between items-baseline font-sans">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">Total Payable</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => triggerPayment()}
                disabled={loading || cart.length === 0}
                className="w-full mt-6 py-4 px-6 bg-slate-950 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-purple-600 active:scale-[0.98] transition-all shadow-xl shadow-purple-900/15 disabled:cursor-not-allowed disabled:bg-slate-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                {loading ? 'Opening Gateway...' : `Pay ₹${totalAmount.toLocaleString()} via Razorpay`}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>256-bit Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Checkout
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart } from '../Service/Cart'
import { placeOrder } from '../Service/Order'

const Checkout = () => {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [cart, setCart] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await getCart(1)
        setCart(data)
      } catch (error) {
        console.error('Failed to load cart', error)
      }
    }

    loadCart()
  }, [])

  const handlePlaceOrder = async () => {
    if (address.trim() === '') {
      alert('Please enter address')
      return
    }

    setLoading(true)
    const order = {
      userId: 1,
      address,
      items: cart,
    }

    try {
      console.log('Placing order:', order)
      const response = await placeOrder(order)
      const totalPrice = cart.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0), 0)
      const successState = {
        orderId: response?.id ?? response?.orderId ?? Date.now(),
        status: response?.status ?? 'Processing',
        totalPrice,
        address,
        items: cart,
      }
      navigate('/success', { state: successState })
    } catch (error) {
      // surface server error message when present
      console.error('Failed to place order', error)
      const serverMsg = error?.response?.data || error?.message || 'Unable to place order'
      alert(`Order failed: ${JSON.stringify(serverMsg)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 shadow-xl">
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Checkout</h1>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Shipping address
        </label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mb-6 h-32 w-full rounded-2xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          placeholder="Enter your shipping address"
        />

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full rounded-2xl bg-purple-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
        >
          {loading ? 'Placing order...' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}

export default Checkout
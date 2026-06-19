

import axios from 'axios'

const API = '/order/place'
const STORAGE_KEY = 'orders'

export const placeOrder = async (orderData) => {
  try {
    console.log('Sending order to', API, orderData)
    const resp = await axios.post(API, orderData, {
      headers: { 'Content-Type': 'application/json' },
    })

    // persist a local copy for the UI
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    const newOrder = {
      id: resp?.data?.id ?? Date.now(),
      items: orderData.items ?? [],
      address: orderData.address ?? '',
      userId: orderData.userId ?? null,
      date: new Date().toLocaleString(),
      status: 'Processing',
    }

    const updated = [newOrder, ...orders]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    localStorage.removeItem('cart')

    return resp.data
  } catch (err) {
    // log server response when available to aid debugging
    if (err?.response) {
      console.error('Order API error', err.response.status, err.response.data)
    } else {
      console.error('Order API request failed', err.message || err)
    }

    // fallback: save locally when API is unavailable or returns error
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    const newOrder = {
      id: Date.now(),
      items: orderData.items ?? [],
      address: orderData.address ?? '',
      userId: orderData.userId ?? null,
      date: new Date().toLocaleString(),
      status: 'Processing',
    }

    const updated = [newOrder, ...orders]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    localStorage.removeItem('cart')

    // rethrow the error so UI can decide how to react if desired
    throw err
  }
}

export const getOrders = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
}
import React, { useEffect, useState } from "react";
import MerchantNavbar from "../Components/merchantNavbar";

const statusStyles = {
  PLACED: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  PROCESSING: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  SHIPPED: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  OUT_FOR_DELIVERY: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  DELIVERED: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const MerchantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/merchant/orders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch merchant orders");
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Unable to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, endpointAction, nextStatus) => {
    try {
      setUpdatingId(orderId);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8081/api/merchant/orders/${orderId}/${endpointAction}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();

      // Update state locally for fast UI response
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: updatedOrder?.status || nextStatus }
            : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white antialiased">
      <MerchantNavbar />

      <div className="max-w-5xl mx-auto p-6 lg:p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-purple-400 text-xs tracking-[0.3em] uppercase mb-1">
              Fulfillment
            </p>
            <h1 className="text-3xl font-light">Merchant Orders</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage incoming customer orders and shipments
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="px-4 py-2 text-sm font-semibold bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition"
          >
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-24 text-gray-500">
            <p className="text-sm">Loading orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl flex justify-between items-center text-sm">
            <span>{error}</span>
            <button
              onClick={fetchOrders}
              className="underline font-semibold hover:text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-gray-500">No orders found.</p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStatus = order.status?.toUpperCase();
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white/5 rounded-3xl border border-white/10 p-6 shadow-sm hover:border-white/20 transition"
              >
                {/* Header Info */}
                <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {order.address || "No delivery address provided"}
                    </p>
                    <p className="mt-2 text-lg font-medium text-purple-400">
                      ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      statusStyles[currentStatus] ||
                      "bg-white/5 text-gray-300 border border-white/10"
                    }`}
                  >
                    {currentStatus?.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Items */}
                <div className="py-4 space-y-3">
                  {order.orderItems?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0"
                    >
                      <img
                        src={item.product?.imageUrl || "https://placehold.co/64"}
                        alt={item.product?.name || "Product"}
                        className="w-14 h-14 object-cover rounded-xl bg-white/5 border border-white/10"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div>
                        <p className="font-medium text-gray-200">
                          {item.product?.name || "Product"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Controls */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    {currentStatus === "PLACED" && (
                      <button
                        disabled={isUpdating}
                        onClick={() =>
                          updateOrderStatus(order.id, "confirm", "CONFIRMED")
                        }
                        className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50 transition"
                      >
                        {isUpdating ? "Confirming..." : "Confirm Order"}
                      </button>
                    )}

                    {currentStatus === "CONFIRMED" && (
                      <button
                        disabled={isUpdating}
                        onClick={() =>
                          updateOrderStatus(order.id, "process", "PROCESSING")
                        }
                        className="px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-50 transition"
                      >
                        {isUpdating ? "Updating..." : "Start Processing"}
                      </button>
                    )}

                    {currentStatus === "PROCESSING" && (
                      <button
                        disabled={isUpdating}
                        onClick={() =>
                          updateOrderStatus(order.id, "ship", "SHIPPED")
                        }
                        className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
                      >
                        {isUpdating ? "Shipping..." : "Ship Order"}
                      </button>
                    )}

                    {currentStatus === "SHIPPED" && (
                      <span className="text-sm text-indigo-400 font-medium">
                        Waiting for delivery partner handoff
                      </span>
                    )}

                    {currentStatus === "OUT_FOR_DELIVERY" && (
                      <span className="text-sm text-orange-400 font-medium">
                        Package out for delivery
                      </span>
                    )}

                    {currentStatus === "DELIVERED" && (
                      <span className="text-sm text-emerald-400 font-medium">
                        ✓ Order Completed
                      </span>
                    )}

                    {currentStatus === "CANCELLED" && (
                      <span className="text-sm text-red-400 font-medium">
                        Order Cancelled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MerchantOrders;
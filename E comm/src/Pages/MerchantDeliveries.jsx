import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import MerchantNavbar from "../Components/merchantNavbar";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

const API_BASE_URL = "http://localhost:8081/api/merchant";

const formatDate = (date) => {
  if (!date) return "Not assigned";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getProductNames = (delivery) => {
  if (!delivery?.order?.orderItems || delivery.order.orderItems.length === 0) {
    return "Product information unavailable";
  }

  return delivery.order.orderItems
    .map((item) => item.product?.name)
    .filter(Boolean)
    .join(", ");
};

const DeliveryCard = ({ delivery, type, onMarkDelivered, isUpdating }) => {
  const isPending = type === "pending";
  const isOngoing = type === "ongoing";
  const isDelivered = type === "delivered";

  const orderId = delivery.order?.id || delivery.orderId;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <FiPackage className="text-purple-400 w-5 h-5" />
          </div>

          <div>
            <p className="text-white font-semibold">
              Order #{orderId || "N/A"}
            </p>
            <p className="text-gray-500 text-xs mt-0.5">
              Delivery Ref: #{delivery.id}
            </p>
          </div>
        </div>

        {/* Status Chip */}
        {isPending && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20">
            <FiClock className="w-3.5 h-3.5" />
            READY
          </span>
        )}

        {isOngoing && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
            <FiTruck className="w-3.5 h-3.5" />
            ONGOING
          </span>
        )}

        {isDelivered && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
            <FiCheckCircle className="w-3.5 h-3.5" />
            DELIVERED
          </span>
        )}
      </div>

      {/* Products list */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-medium">
          Items Included
        </p>
        <p className="text-gray-200 text-sm font-medium">
          {getProductNames(delivery)}
        </p>
      </div>

      {/* Origin & Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <FiMapPin className="text-purple-400 w-4 h-4" />
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Pickup Point
            </p>
          </div>
          <p className="text-gray-300 text-sm">
            {delivery.pickupAddress || "Merchant Warehouse"}
          </p>
        </div>

        <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <FiMapPin className="text-purple-400 w-4 h-4" />
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Destination
            </p>
          </div>
          <p className="text-gray-300 text-sm">
            {delivery.deliveryAddress || "Address not specified"}
          </p>
        </div>
      </div>

      {/* Metrics Row & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-white/10 pt-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm flex-1">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Partner
            </p>
            <p className="text-gray-200 font-medium">
              {delivery.deliveryPartner || "Unassigned"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Delivery Fee
            </p>
            <p className="text-gray-200 font-medium">
              {delivery.deliveryCost != null
                ? `₹${Number(delivery.deliveryCost).toFixed(2)}`
                : "Calculated at dispatch"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Expected Date
            </p>
            <p className="text-gray-200 font-medium">
              {formatDate(delivery.estimatedDeliveryDate)}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Order Total
            </p>
            <p className="text-purple-400 font-medium">
              {delivery.order?.totalAmount != null
                ? `₹${Number(delivery.order.totalAmount).toLocaleString("en-IN")}`
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Mark as Delivered Button for Ongoing Packages */}
        {isOngoing && (
          <button
            onClick={() => onMarkDelivered(delivery)}
            disabled={isUpdating}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold tracking-wide transition disabled:opacity-50 whitespace-nowrap"
          >
            {isUpdating ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <FiCheckCircle className="w-4 h-4" />
                Mark as Delivered
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const MerchantDeliveries = () => {
  const [pending, setPending] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [delivered, setDelivered] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [pendingResponse, ongoingResponse, deliveredResponse] =
        await Promise.all([
          axios.get(`${API_BASE_URL}/deliveries/pending`, { headers }),
          axios.get(`${API_BASE_URL}/deliveries/ongoing`, { headers }),
          axios.get(`${API_BASE_URL}/deliveries/delivered`, { headers }),
        ]);

      setPending(Array.isArray(pendingResponse.data) ? pendingResponse.data : []);
      setOngoing(Array.isArray(ongoingResponse.data) ? ongoingResponse.data : []);
      setDelivered(
        Array.isArray(deliveredResponse.data) ? deliveredResponse.data : []
      );
    } catch (err) {
      console.error("Error fetching deliveries:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load deliveries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // Mark Order as Delivered Handler
  const handleMarkAsDelivered = async (delivery) => {
    const orderId = delivery.order?.id || delivery.orderId;
    if (!orderId) {
      alert("Order reference not found.");
      return;
    }

    try {
      setUpdatingId(delivery.id);
      const token = localStorage.getItem("token");

      // Updates order status to DELIVERED
      await axios.put(
        `${API_BASE_URL}/orders/${orderId}/deliver`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Move instantly from ongoing to delivered locally
      setOngoing((prev) => prev.filter((d) => d.id !== delivery.id));
      setDelivered((prev) => [
        {
          ...delivery,
          deliveryStatus: "DELIVERED",
          order: { ...delivery.order, status: "DELIVERED" },
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Error marking delivery as delivered:", err);
      alert(
        err.response?.data?.message ||
          "Failed to update delivery status. Please try again."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const totalCount = pending.length + ongoing.length + delivered.length;

  const visibleDeliveries = useMemo(() => {
    if (activeTab === "pending") {
      return pending.map((d) => ({ data: d, type: "pending" }));
    }
    if (activeTab === "ongoing") {
      return ongoing.map((d) => ({ data: d, type: "ongoing" }));
    }
    if (activeTab === "delivered") {
      return delivered.map((d) => ({ data: d, type: "delivered" }));
    }
    return [
      ...pending.map((d) => ({ data: d, type: "pending" })),
      ...ongoing.map((d) => ({ data: d, type: "ongoing" })),
      ...delivered.map((d) => ({ data: d, type: "delivered" })),
    ];
  }, [activeTab, pending, ongoing, delivered]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] text-white">
        <MerchantNavbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="flex items-center gap-3 text-gray-400">
            <FiLoader className="animate-spin w-5 h-5 text-purple-500" />
            <p className="text-sm">Loading delivery records...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white antialiased">
      <MerchantNavbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-purple-400 mb-1">
              Fulfillment &amp; Tracking
            </p>
            <h1 className="text-3xl font-light tracking-tight">Deliveries</h1>
            <p className="text-gray-500 text-sm mt-1">
              Track and monitor packages across their fulfillment lifecycle
            </p>
          </div>

          <button
            onClick={fetchDeliveries}
            className="flex items-center gap-2 self-start md:self-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-semibold transition"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 flex items-center justify-between bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl px-5 py-4 text-sm">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
            <button
              onClick={fetchDeliveries}
              className="underline font-semibold hover:text-white ml-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div
            onClick={() => setActiveTab("pending")}
            className={`cursor-pointer bg-white/5 border rounded-3xl p-6 transition ${
              activeTab === "pending"
                ? "border-purple-500/50 bg-white/[0.08]"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                  Ready to Assign
                </p>
                <p className="text-3xl font-light mt-2 text-white">
                  {pending.length}
                </p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-yellow-400">
                <FiClock className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("ongoing")}
            className={`cursor-pointer bg-white/5 border rounded-3xl p-6 transition ${
              activeTab === "ongoing"
                ? "border-purple-500/50 bg-white/[0.08]"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                  In Transit
                </p>
                <p className="text-3xl font-light mt-2 text-white">
                  {ongoing.length}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
                <FiTruck className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("delivered")}
            className={`cursor-pointer bg-white/5 border rounded-3xl p-6 transition ${
              activeTab === "delivered"
                ? "border-purple-500/50 bg-white/[0.08]"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                  Delivered
                </p>
                <p className="text-3xl font-light mt-2 text-white">
                  {delivered.length}
                </p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                <FiCheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-white/10">
          {[
            { id: "all", label: "All Deliveries", count: totalCount },
            { id: "pending", label: "Ready to Assign", count: pending.length },
            { id: "ongoing", label: "In Transit", count: ongoing.length },
            { id: "delivered", label: "Delivered", count: delivered.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-white text-black"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] ${
                  activeTab === tab.id
                    ? "bg-black/10 text-black font-bold"
                    : "bg-white/10 text-gray-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Deliveries List */}
        {visibleDeliveries.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-14 text-center">
            <FiPackage className="mx-auto text-gray-600 w-8 h-8 mb-3" />
            <h3 className="text-gray-200 font-semibold text-lg">
              No deliveries found
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              There are no orders matching the selected status.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {visibleDeliveries.map((item) => (
              <DeliveryCard
                key={item.data.id}
                delivery={item.data}
                type={item.type}
                onMarkDelivered={handleMarkAsDelivered}
                isUpdating={updatingId === item.data.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MerchantDeliveries;

import { useEffect, useState } from "react";
import axios from "axios";
import MerchantNavbar from "../Components/merchantNavbar";
import {
  FiPackage,
  FiMapPin,
  FiTruck,
  FiLoader,
  FiAlertCircle,
  FiZap,
  FiCheckCircle,
} from "react-icons/fi";

const API_BASE_URL = "http://localhost:8081/api/merchant";

const MerchantPending = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [optimizingId, setOptimizingId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);

  const [recommendations, setRecommendations] = useState({});

  // --------------------------------------------------
  // Fetch Pending Deliveries
  // --------------------------------------------------

  const fetchPendingDeliveries = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/deliveries/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDeliveries(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error(
        "Error fetching pending deliveries:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load pending deliveries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDeliveries();
  }, []);

  // --------------------------------------------------
  // AI Delivery Optimization
  // --------------------------------------------------

  const optimizeDelivery = async (deliveryId) => {
    try {
      setOptimizingId(deliveryId);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/delivery-optimization/optimize/${deliveryId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "AI Optimization Response:",
        response.data
      );

      setRecommendations((prev) => ({
        ...prev,
        [deliveryId]: response.data,
      }));
    } catch (err) {
      console.error("STATUS:", err.response?.status);
      console.error("DATA:", err.response?.data);
      console.error("MESSAGE:", err.message);

      setError(
        err.response?.data?.error ||
          "Failed to optimize delivery"
      );
    } finally {
      setOptimizingId(null);
    }
  };

  // --------------------------------------------------
  // Accept & Assign Recommended Partner
  // --------------------------------------------------

  const acceptAndAssign = async (deliveryId, recommendation) => {
    if (!recommendation) {
      setError("No delivery recommendation available.");
      return;
    }

    try {
      setAssigningId(deliveryId);
      setError("");

      const token = localStorage.getItem("token");

      const requestBody = {
        partnerName: recommendation.recommendedPartner,
        deliveryCost: recommendation.estimatedCost,
        estimatedDays: recommendation.estimatedDays,
      };

      console.log(
        "Assigning Delivery:",
        requestBody
      );

      await axios.post(
        `${API_BASE_URL}/deliveries/${deliveryId}/assign`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove recommendation from local state
      setRecommendations((prev) => {
        const updated = { ...prev };
        delete updated[deliveryId];
        return updated;
      });

      // Refresh pending deliveries.
      // Since backend changes READY -> ONGOING,
      // this delivery will disappear from Pending.
      await fetchPendingDeliveries();

    } catch (err) {
      console.error(
        "Assignment STATUS:",
        err.response?.status
      );

      console.error(
        "Assignment DATA:",
        err.response?.data
      );

      console.error(
        "Assignment MESSAGE:",
        err.message
      );

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to assign delivery partner."
      );
    } finally {
      setAssigningId(null);
    }
  };

  // --------------------------------------------------
  // Loading State
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] text-white flex flex-col items-center justify-center gap-3">
        <FiLoader className="w-8 h-8 animate-spin text-purple-500" />

        <p className="text-gray-400 text-sm tracking-wide">
          Loading pending deliveries...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // Main UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white antialiased">

      <MerchantNavbar />

      {/* --------------------------------------------------
          Header
      -------------------------------------------------- */}

      <header className="border-b border-white/10 bg-black/40 backdrop-blur px-6 lg:px-10 py-6">

        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <div>
            <p className="text-purple-400 text-xs tracking-[0.3em] uppercase mb-1">
              Logistics
            </p>

            <h1 className="text-3xl font-light">
              Pending Deliveries
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Optimize logistics routes and partner allocation using AI
            </p>
          </div>

          <button
            onClick={fetchPendingDeliveries}
            className="px-4 py-2 text-sm font-semibold bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition"
          >
            Refresh
          </button>

        </div>

      </header>

      {/* --------------------------------------------------
          Main
      -------------------------------------------------- */}

      <main className="max-w-7xl mx-auto p-6 lg:p-10 space-y-6">

        {/* --------------------------------------------------
            Error Alert
        -------------------------------------------------- */}

        {error && (
          <div className="flex items-center justify-between p-4 bg-red-950/40 border border-red-800/60 rounded-2xl text-red-300 text-sm">

            <div className="flex items-center gap-2">

              <FiAlertCircle className="w-5 h-5 flex-shrink-0" />

              <span>{error}</span>

            </div>

            <button
              onClick={fetchPendingDeliveries}
              className="underline font-semibold hover:text-white ml-4"
            >
              Retry
            </button>

          </div>
        )}

        {/* --------------------------------------------------
            Empty State
        -------------------------------------------------- */}

        {deliveries.length === 0 && !error ? (

          <div className="border border-white/10 bg-white/5 rounded-3xl p-14 text-center">

            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">

              <FiPackage className="w-6 h-6 text-gray-400" />

            </div>

            <h2 className="text-lg font-semibold mt-5 text-gray-200">
              No Pending Deliveries
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Shipments waiting for dispatch or partner assignment will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {deliveries.map((delivery) => {

              const recommendation =
                recommendations[delivery.id];

              const isOptimizing =
                optimizingId === delivery.id;

              const isAssigning =
                assigningId === delivery.id;

              const isProfitable =
                recommendation?.profitImpact >= 0;

              return (

                <div
                  key={delivery.id}
                  className="border border-white/10 bg-white/5 rounded-3xl overflow-hidden shadow-sm hover:border-white/20 transition"
                >

                  {/* --------------------------------------------------
                      Card Header
                  -------------------------------------------------- */}

                  <div className="px-6 py-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">

                        <FiTruck className="w-5 h-5" />

                      </div>

                      <div>

                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Delivery Reference
                        </p>

                        <p className="font-semibold text-gray-100">
                          #{delivery.id}
                        </p>

                      </div>

                    </div>

                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold uppercase tracking-wider">

                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />

                      {delivery.deliveryStatus?.replace(
                        /_/g,
                        " "
                      ) || "Pending"}

                    </span>

                  </div>

                  {/* --------------------------------------------------
                      Address Grid
                  -------------------------------------------------- */}

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Pickup Address */}

                    <div>

                      <div className="flex items-center gap-2 mb-2">

                        <FiMapPin className="w-4 h-4 text-purple-400" />

                        <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                          Pickup Origin
                        </p>

                      </div>

                      <div className="bg-black/40 border border-white/10 rounded-2xl p-4">

                        <p className="text-sm text-gray-300">
                          {delivery.pickupAddress ||
                            "Merchant Store Location"}
                        </p>

                      </div>

                    </div>

                    {/* Delivery Address */}

                    <div>

                      <div className="flex items-center gap-2 mb-2">

                        <FiMapPin className="w-4 h-4 text-purple-400" />

                        <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                          Customer Destination
                        </p>

                      </div>

                      <div className="bg-black/40 border border-white/10 rounded-2xl p-4">

                        <p className="text-sm text-gray-300">
                          {delivery.deliveryAddress ||
                            "Address not provided"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* --------------------------------------------------
                      AI Optimize Button
                  -------------------------------------------------- */}

                  {!recommendation && (

                    <div className="px-6 pb-6">

                      <button
                        onClick={() =>
                          optimizeDelivery(delivery.id)
                        }
                        disabled={isOptimizing}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-black rounded-xl font-semibold text-sm hover:bg-gray-200 transition disabled:opacity-50"
                      >

                        {isOptimizing ? (

                          <>
                            <FiLoader className="w-4 h-4 animate-spin" />

                            Analyzing Partner Rates & Routes...
                          </>

                        ) : (

                          <>
                            <FiZap className="w-4 h-4" />

                            Optimize Delivery with AI
                          </>

                        )}

                      </button>

                    </div>

                  )}

                  {/* --------------------------------------------------
                      AI Recommendation Box
                  -------------------------------------------------- */}

                  {recommendation && (

                    <div className="mx-6 mb-6 border border-purple-500/20 bg-gradient-to-b from-purple-950/20 to-black/40 rounded-2xl overflow-hidden">

                      {/* AI Header */}

                      <div className="px-5 py-4 border-b border-purple-500/10 flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">

                            <FiZap className="w-4 h-4" />

                          </div>

                          <div>

                            <p className="font-semibold text-white text-sm">
                              AI Delivery Optimization
                            </p>

                            <p className="text-[11px] text-gray-500">
                              Optimized for merchant cost, speed and reliability
                            </p>

                          </div>

                        </div>

                        <FiCheckCircle className="w-5 h-5 text-purple-400" />

                      </div>

                      {/* --------------------------------------------------
                          Main Recommendation
                      -------------------------------------------------- */}

                      <div className="p-5">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                          {/* Recommended Partner */}

                          <div>

                            <p className="text-xs text-gray-500 uppercase tracking-wider">
                              Recommended Partner
                            </p>

                            <h3 className="text-xl font-semibold text-white mt-1">
                              {recommendation.recommendedPartner}
                            </h3>

                            <p className="text-sm text-gray-400 mt-1">
                              {isProfitable
                                ? "Best option for maximizing merchant profit"
                                : "Lowest-loss option — merchant review recommended"}
                            </p>

                          </div>

                          {/* Optimization Score */}

                          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-5 py-3">

                            <p className="text-xs text-gray-400 uppercase tracking-wider">
                              Optimization Score
                            </p>

                            <p className="text-2xl font-semibold text-purple-400 mt-1">

                              {recommendation.options
                                ?.find(
                                  (partner) =>
                                    partner.partnerName ===
                                    recommendation.recommendedPartner
                                )
                                ?.optimizationScore?.toFixed(1) ||
                                "N/A"}

                            </p>

                          </div>

                        </div>

                        {/* --------------------------------------------------
                            Key Metrics
                        -------------------------------------------------- */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">

                          {/* Order Value */}

                          <div className="bg-white/5 border border-white/10 rounded-xl p-4">

                            <p className="text-xs text-gray-400 uppercase tracking-wider">
                              Order Value
                            </p>

                            <p className="text-lg font-semibold text-white mt-1">
                              ₹
                              {Number(
                                recommendation.orderValue || 0
                              ).toLocaleString("en-IN")}
                            </p>

                          </div>

                          {/* Delivery Cost */}

                          <div className="bg-white/5 border border-white/10 rounded-xl p-4">

                            <p className="text-xs text-gray-400 uppercase tracking-wider">
                              Delivery Cost
                            </p>

                            <p className="text-lg font-semibold text-purple-400 mt-1">
                              ₹
                              {Number(
                                recommendation.estimatedCost || 0
                              ).toLocaleString("en-IN")}
                            </p>

                          </div>

                          {/* Delivery Time */}

                          <div className="bg-white/5 border border-white/10 rounded-xl p-4">

                            <p className="text-xs text-gray-400 uppercase tracking-wider">
                              Estimated Time
                            </p>

                            <p className="text-lg font-semibold text-white mt-1">
                              {recommendation.estimatedDays || 0} Days
                            </p>

                          </div>

                          {/* Reliability */}

                          <div className="bg-white/5 border border-white/10 rounded-xl p-4">

                            <p className="text-xs text-gray-400 uppercase tracking-wider">
                              Reliability
                            </p>

                            <p className="text-lg font-semibold text-white mt-1">
                              {recommendation.reliabilityScore || 0}%
                            </p>

                          </div>

                          {/* Profit / Loss */}

                          <div className="bg-white/5 border border-white/10 rounded-xl p-4">

                            <p className="text-xs text-gray-400 uppercase tracking-wider">

                              {isProfitable
                                ? "Estimated Merchant Profit"
                                : "Estimated Merchant Loss"}

                            </p>

                            <p
                              className={`text-lg font-semibold mt-1 ${
                                isProfitable
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >

                              ₹
                              {Math.abs(
                                Number(
                                  recommendation.profitImpact || 0
                                )
                              ).toLocaleString("en-IN")}

                            </p>

                          </div>

                        </div>

                        {/* --------------------------------------------------
                            Merchant Saving
                        -------------------------------------------------- */}

                        <div
                          className={`mt-4 rounded-xl p-4 ${
                            isProfitable
                              ? "bg-green-500/5 border border-green-500/20"
                              : "bg-red-500/5 border border-red-500/20"
                          }`}
                        >

                          <div className="flex items-center justify-between">

                            <div>

                              <p className="text-xs text-gray-400 uppercase tracking-wider">
                                Estimated Merchant Saving
                              </p>

                              <p className="text-sm text-gray-400 mt-1">
                                Compared with the most expensive available option
                              </p>

                            </div>

                            <p
                              className={`text-xl font-semibold ${
                                isProfitable
                                  ? "text-green-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ₹
                              {Number(
                                recommendation.merchantSaving || 0
                              ).toLocaleString("en-IN")}
                            </p>

                          </div>

                        </div>

                        {/* --------------------------------------------------
                            Backend Reason
                        -------------------------------------------------- */}

                        {recommendation.reason && (

                          <div className="mt-4 bg-black/30 border border-white/5 rounded-xl p-4">

                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                              Optimization Analysis
                            </p>

                            <p className="text-sm text-gray-300 leading-relaxed">
                              {recommendation.reason}
                            </p>

                          </div>

                        )}

                        {/* --------------------------------------------------
                            Risk Warning
                        -------------------------------------------------- */}

                        {recommendation.riskWarning && (

                          <div
                            className={`mt-4 rounded-xl p-4 border ${
                              isProfitable
                                ? "bg-green-500/5 border-green-500/20"
                                : "bg-red-500/5 border-red-500/20"
                            }`}
                          >

                            <div className="flex items-start gap-3">

                              <FiAlertCircle
                                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                  isProfitable
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              />

                              <div>

                                <p
                                  className={`text-xs uppercase tracking-wider font-semibold ${
                                    isProfitable
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >

                                  {isProfitable
                                    ? "Risk Status"
                                    : "Risk Warning"}

                                </p>

                                <p className="mt-1 text-sm text-gray-300 leading-relaxed">
                                  {recommendation.riskWarning}
                                </p>

                              </div>

                            </div>

                          </div>

                        )}

                        {/* --------------------------------------------------
                            AI Merchant Explanation
                        -------------------------------------------------- */}

                        {recommendation.aiExplanation && (

                          <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

                            <div className="flex items-start gap-3">

                              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">

                                <FiZap className="w-4 h-4 text-blue-400" />

                              </div>

                              <div>

                                <p className="text-xs text-blue-400 uppercase tracking-wider font-semibold">
                                  AI Merchant Explanation
                                </p>

                                <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                                  {recommendation.aiExplanation}
                                </p>

                              </div>

                            </div>

                          </div>

                        )}

                        {/* --------------------------------------------------
                            Partner Comparison
                        -------------------------------------------------- */}

                        {recommendation.options?.length > 0 && (

                          <div className="mt-6">

                            <div className="flex items-center justify-between mb-3">

                              <div>

                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                  Partner Comparison
                                </p>

                                <p className="text-sm text-gray-300 mt-1">
                                  AI evaluated all available delivery options
                                </p>

                              </div>

                            </div>

                            <div className="space-y-3">

                              {recommendation.options.map(
                                (partner) => {

                                  const isRecommended =
                                    partner.partnerName ===
                                    recommendation.recommendedPartner;

                                  return (

                                    <div
                                      key={partner.partnerName}
                                      className={`p-4 rounded-xl border transition ${
                                        isRecommended
                                          ? "border-purple-500/30 bg-purple-500/5"
                                          : "border-white/10 bg-white/[0.02]"
                                      }`}
                                    >

                                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                                        {/* Partner */}

                                        <div className="flex items-center gap-3">

                                          <div
                                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                              isRecommended
                                                ? "bg-purple-500/10 text-purple-400"
                                                : "bg-white/5 text-gray-400"
                                            }`}
                                          >

                                            <FiTruck className="w-4 h-4" />

                                          </div>

                                          <div>

                                            <div className="flex items-center gap-2">

                                              <p className="text-sm font-semibold text-white">
                                                {partner.partnerName}
                                              </p>

                                              {isRecommended && (

                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase">
                                                  Recommended
                                                </span>

                                              )}

                                            </div>

                                          </div>

                                        </div>

                                        {/* Partner Metrics */}

                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">

                                          {/* Cost */}

                                          <div>

                                            <p className="text-[10px] text-gray-500 uppercase">
                                              Cost
                                            </p>

                                            <p className="text-gray-200 font-medium">
                                              ₹
                                              {Number(
                                                partner.estimatedCost || 0
                                              ).toLocaleString("en-IN")}
                                            </p>

                                          </div>

                                          {/* Time */}

                                          <div>

                                            <p className="text-[10px] text-gray-500 uppercase">
                                              Time
                                            </p>

                                            <p className="text-gray-200 font-medium">
                                              {partner.estimatedDays} Days
                                            </p>

                                          </div>

                                          {/* Reliability */}

                                          <div>

                                            <p className="text-[10px] text-gray-500 uppercase">
                                              Reliability
                                            </p>

                                            <p className="text-gray-200 font-medium">
                                              {partner.reliabilityScore}%
                                            </p>

                                          </div>

                                          {/* Score */}

                                          <div>

                                            <p className="text-[10px] text-gray-500 uppercase">
                                              Score
                                            </p>

                                            <p
                                              className={`font-semibold ${
                                                isRecommended
                                                  ? "text-purple-400"
                                                  : "text-gray-300"
                                              }`}
                                            >
                                              {partner.optimizationScore?.toFixed(
                                                1
                                              )}
                                            </p>

                                          </div>

                                          {/* Merchant Profit */}

                                          <div>

                                            <p className="text-[10px] text-gray-500 uppercase">
                                              Profit
                                            </p>

                                            <p
                                              className={`font-semibold ${
                                                partner.merchantProfit >= 0
                                                  ? "text-green-400"
                                                  : "text-red-400"
                                              }`}
                                            >

                                              ₹
                                              {Math.abs(
                                                Number(
                                                  partner.merchantProfit || 0
                                                )
                                              ).toLocaleString("en-IN")}

                                              {partner.merchantProfit < 0 &&
                                                " loss"}

                                            </p>

                                          </div>

                                        </div>

                                      </div>

                                    </div>

                                  );

                                }
                              )}

                            </div>

                          </div>

                        )}

                        {/* --------------------------------------------------
                            Accept & Assign
                        -------------------------------------------------- */}

                        <div className="mt-6 pt-5 border-t border-white/10">

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                            <div>

                              <p className="text-sm font-semibold text-white">
                                Ready to assign?
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                This will assign {recommendation.recommendedPartner} and move the delivery to ongoing.
                              </p>

                            </div>

                            <button
                              onClick={() =>
                                acceptAndAssign(
                                  delivery.id,
                                  recommendation
                                )
                              }
                              disabled={isAssigning}
                              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold text-sm hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >

                              {isAssigning ? (

                                <>
                                  <FiLoader className="w-4 h-4 animate-spin" />
                                  Assigning...
                                </>

                              ) : (

                                <>
                                  <FiCheckCircle className="w-4 h-4" />
                                  Accept & Assign
                                </>

                              )}

                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  )}

                </div>

              );

            })}

          </div>

        )}

      </main>

    </div>
  );
};

export default MerchantPending;


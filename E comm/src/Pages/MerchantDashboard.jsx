import { useEffect, useMemo, useState } from "react";
import MerchantNavbar from "../Components/merchantNavbar";
import axios from "axios";
import MerchantChat from "../Components/Chatbot/MerchantChat";
import {
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiBarChart2,
  FiPieChart,
  FiAward,
  FiLoader,
  FiAlertCircle,
  FiPercent,
} from "react-icons/fi";

const API_BASE_URL = "http://localhost:8081/api/merchant";

const MerchantDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    revenueChart: [],
    profitChart: [],
    orderStatusChart: [],
    topProducts: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // Fetch Analytics Only
  // ---------------------------------------------------------
  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(`${API_BASE_URL}/dashboard`, { headers });
      const data = res.data || {};

      setDashboardData({
        totalRevenue: Number(data.totalRevenue || 0),
        totalProfit: Number(data.totalProfit || 0),
        totalOrders: Number(data.totalOrders || 0),
        pendingOrders: Number(data.pendingOrders || 0),
        processingOrders: Number(data.processingOrders || 0),
        shippedOrders: Number(data.shippedOrders || 0),
        deliveredOrders: Number(data.deliveredOrders || 0),
        revenueChart: data.revenueChart || [],
        profitChart: data.profitChart || [],
        orderStatusChart: data.orderStatusChart || [],
        topProducts: data.topProducts || [],
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to load analytics data. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ---------------------------------------------------------
  // Derived Analytics Computations
  // ---------------------------------------------------------
  const avgOrderValue = useMemo(() => {
    if (!dashboardData.totalOrders) return 0;
    return Math.round(dashboardData.totalRevenue / dashboardData.totalOrders);
  }, [dashboardData.totalRevenue, dashboardData.totalOrders]);

  const profitMargin = useMemo(() => {
    if (!dashboardData.totalRevenue) return 0;
    return ((dashboardData.totalProfit / dashboardData.totalRevenue) * 100).toFixed(1);
  }, [dashboardData.totalProfit, dashboardData.totalRevenue]);

  const statusTotal = useMemo(() => {
    return dashboardData.orderStatusChart.reduce(
      (sum, item) => sum + Number(item.count || 0),
      0
    );
  }, [dashboardData.orderStatusChart]);

  const getStatusPercentage = (count) => {
    if (!statusTotal) return 0;
    return Math.round((Number(count || 0) / statusTotal) * 100);
  };

  const revenueMax = useMemo(() => {
    if (!dashboardData.revenueChart.length) return 1;
    return Math.max(...dashboardData.revenueChart.map((i) => Number(i.revenue || 0)), 1);
  }, [dashboardData.revenueChart]);

  const profitMax = useMemo(() => {
    if (!dashboardData.profitChart.length) return 1;
    return Math.max(...dashboardData.profitChart.map((i) => Math.abs(Number(i.profit || 0))), 1);
  }, [dashboardData.profitChart]);

  // ---------------------------------------------------------
  // Formatters
  // ---------------------------------------------------------
  const formatCurrency = (val) =>
    `₹${Number(val || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const parsed = new Date(dateStr);
    return Number.isNaN(parsed.getTime())
      ? dateStr
      : parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] text-white flex flex-col items-center justify-center gap-3">
        <FiLoader className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-gray-400 text-sm tracking-wide">
          Loading performance analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white antialiased">
      <MerchantNavbar />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur px-6 lg:px-10 py-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-purple-400 text-xs tracking-[0.25em] uppercase font-medium mb-1">
              Store Intelligence
            </p>
            <h1 className="text-3xl font-light tracking-tight">Performance Analytics</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Live metrics, fulfillment breakdowns, and revenue trajectories
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            className="text-xs uppercase tracking-wider text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-3.5 py-2 rounded-xl transition"
          >
            Refresh Data
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
        {/* Error Alert */}
        {error && (
          <div className="flex items-center justify-between p-4 bg-red-950/40 border border-red-800/60 rounded-2xl text-red-300 text-sm">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchAnalytics}
              className="underline font-semibold hover:text-white ml-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* Primary Financial & Volume KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Gross Revenue</p>
                <h3 className="text-2xl font-semibold mt-2">
                  {formatCurrency(dashboardData.totalRevenue)}
                </h3>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                <FiDollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Total gross sales volume</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Net Profit</p>
                <h3
                  className={`text-2xl font-semibold mt-2 ${
                    dashboardData.totalProfit >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {formatCurrency(dashboardData.totalProfit)}
                </h3>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400">
                <FiTrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
              <FiPercent className="w-3.5 h-3.5 text-purple-400" />
              <span>{profitMargin}% profit margin</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Total Orders</p>
                <h3 className="text-2xl font-semibold mt-2">{dashboardData.totalOrders}</h3>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                <FiShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Processed customer purchases</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Avg. Order Value</p>
                <h3 className="text-2xl font-semibold mt-2">
                  {formatCurrency(avgOrderValue)}
                </h3>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400">
                <FiPieChart className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Revenue per fulfilled order</p>
          </div>
        </section>

        {/* Fulfillment Status Stream */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400">
                <FiClock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Pending</p>
                <p className="text-xl font-semibold mt-0.5">{dashboardData.pendingOrders}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <FiShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Processing</p>
                <p className="text-xl font-semibold mt-0.5">{dashboardData.processingOrders}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <FiTruck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">In Transit</p>
                <p className="text-xl font-semibold mt-0.5">{dashboardData.shippedOrders}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <FiCheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Delivered</p>
                <p className="text-xl font-semibold mt-0.5">{dashboardData.deliveredOrders}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Charts: Revenue & Profit Trends */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-medium">Revenue Timeline</h3>
                <p className="text-gray-500 text-xs mt-0.5">Periodic performance trajectory</p>
              </div>
              <div className="p-2 rounded-xl bg-white/5 text-emerald-400">
                <FiBarChart2 className="w-4 h-4" />
              </div>
            </div>

            {dashboardData.revenueChart.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-gray-500 text-sm">
                No revenue trends recorded yet.
              </div>
            ) : (
              <div className="h-56 flex items-end gap-3 overflow-x-auto pb-4">
                {dashboardData.revenueChart.map((item, index) => {
                  const value = Number(item.revenue || 0);
                  const height = Math.max((value / revenueMax) * 100, 5);

                  return (
                    <div
                      key={`rev-${item.date}-${index}`}
                      className="min-w-[46px] h-full flex flex-col justify-end items-center gap-2 group"
                    >
                      <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {formatCurrency(value)}
                      </span>
                      <div
                        className="w-8 bg-emerald-500/60 group-hover:bg-emerald-400 rounded-t-md transition-all duration-300"
                        style={{ height: `${height}%` }}
                        title={`${formatDate(item.date)}: ${formatCurrency(value)}`}
                      />
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Profit Chart */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-medium">Profit Margins</h3>
                <p className="text-gray-500 text-xs mt-0.5">Estimated gross returns</p>
              </div>
              <div className="p-2 rounded-xl bg-white/5 text-purple-400">
                <FiTrendingUp className="w-4 h-4" />
              </div>
            </div>

            {dashboardData.profitChart.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-gray-500 text-sm">
                No profit trends recorded yet.
              </div>
            ) : (
              <div className="h-56 flex items-end gap-3 overflow-x-auto pb-4">
                {dashboardData.profitChart.map((item, index) => {
                  const value = Number(item.profit || 0);
                  const height = Math.max((Math.abs(value) / profitMax) * 100, 5);
                  const positive = value >= 0;

                  return (
                    <div
                      key={`prof-${item.date}-${index}`}
                      className="min-w-[46px] h-full flex flex-col justify-end items-center gap-2 group"
                    >
                      <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {formatCurrency(value)}
                      </span>
                      <div
                        className={`w-8 rounded-t-md transition-all duration-300 ${
                          positive
                            ? "bg-purple-500/60 group-hover:bg-purple-400"
                            : "bg-red-500/60 group-hover:bg-red-400"
                        }`}
                        style={{ height: `${height}%` }}
                        title={`${formatDate(item.date)}: ${formatCurrency(value)}`}
                      />
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Status Distribution & Best Performing Products */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Distribution Progress Bars */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="mb-6">
              <h3 className="text-base font-medium">Order Status Composition</h3>
              <p className="text-gray-500 text-xs mt-0.5">Pipeline breakdown across all customer orders</p>
            </div>

            {dashboardData.orderStatusChart.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
                No order distribution available.
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.orderStatusChart.map((item) => {
                  const percentage = getStatusPercentage(item.count);

                  return (
                    <div key={item.status} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300 font-medium capitalize">
                          {item.status?.toLowerCase()}
                        </span>
                        <span className="text-gray-500">
                          {item.count} orders ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Products Rank */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-medium">Top Performing Items</h3>
                <p className="text-gray-500 text-xs mt-0.5">High-velocity volume drivers</p>
              </div>
              <div className="p-2 rounded-xl bg-white/5 text-amber-400">
                <FiAward className="w-4 h-4" />
              </div>
            </div>

            {dashboardData.topProducts.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
                No product volume registered yet.
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.topProducts.map((product, index) => (
                  <div
                    key={`${product.productName}-${index}`}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-semibold text-gray-400 shrink-0">
                        #{index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">
                          {product.productName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {product.quantitySold} units sold
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-medium text-emerald-400 whitespace-nowrap ml-4">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        <section>
          <MerchantChat />
        </section>
      </main>

    </div>
  );
};

export default MerchantDashboard;
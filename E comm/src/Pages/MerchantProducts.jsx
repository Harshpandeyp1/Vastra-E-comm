import { useEffect, useMemo, useState } from "react";
import MerchantNavbar from "../Components/merchantNavbar";
import axios from "axios";
import {
  FiPackage,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiAlertCircle,
  FiLoader,
  FiX
} from "react-icons/fi";

const API_BASE_URL = "http://localhost:8081/api/merchant";

const CATEGORY_OPTIONS = ["MEN", "WOMEN", "KIDS", "TRENDING"];

const initialProductState = {
  name: "",
  imageUrl: "",
  price: "",
  category: "MEN"
};

const MerchantProducts = () => {
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Actions & Modals
  const [isDeleting, setIsDeleting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(initialProductState);

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data || []);
    } catch (err) {
      console.error("Error fetching merchant products:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load products. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Category List
  const categories = useMemo(() => {
    const unique = new Set(
      products.map((p) => p.category).filter(Boolean)
    );
    return ["All", ...Array.from(unique)];
  }, [products]);

  // Search & Filter
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData(initialProductState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      imageUrl: product.imageUrl || "",
      price: product.price || "",
      category: product.category || "MEN"
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(initialProductState);
  };

  // Form Submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    const payload = {
      ...formData,
      price: Number(formData.price) || 0
    };

    try {
      if (editingProduct) {
        // Edit Mode
        const response = await axios.put(
          `${API_BASE_URL}/products/${editingProduct.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? response.data : p))
        );
      } else {
        // Add Mode
        const response = await axios.post(`${API_BASE_URL}/products`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        setProducts((prev) => [...prev, response.data]);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error submitting product:", err);
      alert(
        err.response?.data?.message || "Failed to save product. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setIsDeleting(id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] text-white flex flex-col items-center justify-center gap-3">
        <FiLoader className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-gray-400 text-sm">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white antialiased">
      <MerchantNavbar />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur px-6 lg:px-10 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-purple-400 text-xs tracking-[0.3em] uppercase mb-1">
              Inventory
            </p>
            <h1 className="text-3xl font-light">Products</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your Vastra store catalog and stock
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200 transition"
          >
            <FiPlus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        {/* Error Alert */}
        {error && (
          <div className="flex items-center justify-between p-4 mb-6 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300">
            <div className="flex items-center gap-2">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchProducts}
              className="underline font-semibold hover:text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by product name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-medium border whitespace-nowrap transition ${
                  selectedCategory === category
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/10 bg-black/40">
                <tr className="text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-white/[0.02] transition"
                    >
                      {/* Product Name & Thumbnail */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-11 h-11 object-cover rounded-xl bg-white/5 border border-white/10"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                              <FiPackage className="text-gray-500 text-lg" />
                            </div>
                          )}
                          <span className="font-medium text-gray-200">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md text-xs bg-white/5 border border-white/10 text-gray-300">
                          {product.category || "Uncategorized"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-medium text-gray-100">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
                            title="Edit product"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={isDeleting === product.id}
                            className="p-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10 transition disabled:opacity-50"
                            title="Delete product"
                          >
                            {isDeleting === product.id ? (
                              <FiLoader className="animate-spin w-4 h-4 text-red-400" />
                            ) : (
                              <FiTrash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-14 text-center text-gray-500 text-sm"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Unified Add / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#111116] border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingProduct
                      ? "Update the details for this item"
                      : "Fill in the details to publish a new product"}
                  </p>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Oversized Linen Shirt"
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="1499"
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://example.com/item.jpg"
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3 border border-white/10 text-gray-400 rounded-xl hover:text-white hover:bg-white/5 transition font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {isSubmitting
                      ? editingProduct
                        ? "Saving..."
                        : "Adding..."
                      : editingProduct
                      ? "Save Changes"
                      : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MerchantProducts;
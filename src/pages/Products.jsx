import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Package,
  Edit,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  X,
} from "lucide-react";
import client from "../utils/axiosInstance";
import { useDocumentTitle } from "../utils/useDocumentTitle";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useDocumentTitle("Products Management - RFID Vending Machine");

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    stock: "",
    slotNumber: "",
  });

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.get("/products");

      // Map API response to our expected format
      const formattedProducts = response.data.data.map((product) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        slotNumber: product.slotNumber,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        lowStock: product.stock < 3, // Changed to 3 for low stock
      }));

      setProducts(formattedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");

      // Show error toast
      toast.error("Failed to fetch products. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      slotNumber: product.slotNumber,
    });
    setShowEditModal(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    setEditFormData({
      name: "",
      price: "",
      stock: "",
      slotNumber: "",
    });
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" || name === "slotNumber"
          ? Number(value) || ""
          : value,
    }));
  };

  // Save updated product
  const handleSaveUpdate = async () => {
    if (
      !editFormData.name ||
      !editFormData.price ||
      !editFormData.stock ||
      !editFormData.slotNumber
    ) {
      toast.warning("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate stock (max 10)
    if (editFormData.stock > 10) {
      toast.warning("Maximum stock is 10 units!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await client.put(`/products/${editingProduct.id}`, {
        name: editFormData.name,
        price: editFormData.price,
        stock: editFormData.stock,
        slotNumber: editFormData.slotNumber,
      });

      // Update the product in state
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                name: response.data.data.name,
                price: response.data.data.price,
                stock: response.data.data.stock,
                slotNumber: response.data.data.slotNumber,
                updatedAt: response.data.data.updatedAt,
                lowStock: response.data.data.stock < 3,
              }
            : product
        )
      );

      // Close modal
      handleCloseEditModal();

      // Show success toast
      toast.success("Product updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Error updating product:", err);

      // Show error toast
      toast.error("Failed to update product. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Restock product to 10 (MAX)
  const handleRestock = async (id) => {
    try {
      const product = products.find((p) => p.id === id);
      const response = await client.put(`/products/${id}`, {
        name: product.name,
        price: product.price,
        stock: 10, // Restock to MAX 10
        slotNumber: product.slotNumber,
      });

      setProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? {
                ...product,
                stock: 10,
                updatedAt: new Date().toISOString(),
                lowStock: false,
              }
            : product
        )
      );

      // Show success toast
      toast.success(`${product.name} restocked to 10 units!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Error restocking product:", err);

      // Show error toast
      toast.error("Failed to restock product. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate totals
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.lowStock).length;
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.stock * p.price,
    0
  );

  const getStatusColor = (stock) => {
    return stock < 3
      ? "bg-red-100 text-red-800"
      : stock < 5
      ? "bg-yellow-100 text-yellow-800"
      : "bg-green-100 text-green-800";
  };

  const getStatusText = (stock) => {
    return stock === 0
      ? "Empty"
      : stock < 3
      ? "Low Stock"
      : stock < 5
      ? "Warning"
      : "In Stock";
  };

  if (loading) {
    return (
      <>
        <ToastContainer />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Product Management
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage vending machine products
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <button
              onClick={fetchProducts}
              className="btn btn-secondary flex items-center space-x-2"
              title="Refresh products"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Products</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalProducts}
                </p>
              </div>
              <Package className="h-10 w-10 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">
                {totalProducts} products loaded
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">
                  {lowStockCount}
                </p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <div className="mt-2 flex items-center">
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-xs text-red-600">Needs attention</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Stock Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₱{totalStockValue.toLocaleString()}
                </p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Based on current stock levels
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Slot #{product.slotNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">
                        ₱{product.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="font-medium text-gray-900">
                          {product.stock}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          units
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          (Max: 10)
                        </span>
                      </div>
                      <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${
                            product.stock < 3
                              ? "bg-red-500"
                              : product.stock < 5
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (product.stock / 10) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {product.stock === 10
                          ? "Full"
                          : product.stock >= 7
                          ? "Good"
                          : product.stock >= 4
                          ? "Average"
                          : product.stock >= 1
                          ? "Low"
                          : "Empty"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          product.stock
                        )}`}
                      >
                        {getStatusText(product.stock)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRestock(product.id)}
                          className="p-1 text-blue-600 hover:text-blue-900 rounded hover:bg-blue-50"
                          title="Restock to 10"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1 text-green-600 hover:text-green-900 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State - kapag walang products */}
          {products.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No products available
              </h3>
              <p className="mt-1 text-gray-500">
                Products will appear here when added
              </p>
            </div>
          )}
        </div>

        {/* EDIT MODAL */}
        {showEditModal && editingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Edit Product
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Update product details
                  </p>
                </div>
                <button
                  onClick={handleCloseEditModal}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Product name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₱)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock (Max: 10)
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={editFormData.stock}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex space-x-3 p-6 border-t">
                <button
                  onClick={handleCloseEditModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUpdate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;

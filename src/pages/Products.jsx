import React, { useState } from "react";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  MoreVertical,
} from "lucide-react";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([
    { id: 1, name: "Mask (Surgical)", price: 10, stock: 12, lowStock: true },
    { id: 2, name: "Alcohol Spray", price: 25, stock: 32, lowStock: false },
    { id: 3, name: "Wet Wipes", price: 15, stock: 8, lowStock: true },
    { id: 4, name: "Hand Sanitizer", price: 30, stock: 28, lowStock: false },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm)
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" ? Number(value) || "" : value,
    }));
  };

  // Add new product
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Please fill in all fields");
      return;
    }

    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    setProducts((prev) => [
      ...prev,
      {
        id: newId,
        name: newProduct.name,
        price: newProduct.price,
        stock: newProduct.stock,
        lowStock: newProduct.stock < 15,
      },
    ]);

    // Reset form
    setNewProduct({ name: "", price: "", stock: "" });
    setShowAddForm(false);
  };

  // Update product
  const handleUpdateProduct = (id) => {
    const productToUpdate = products.find((p) => p.id === id);
    if (!productToUpdate) return;

    setNewProduct({
      name: productToUpdate.name,
      price: productToUpdate.price,
      stock: productToUpdate.stock,
    });
    setEditingId(id);
    setShowAddForm(true);
  };

  // Save updated product
  const handleSaveUpdate = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Please fill in all fields");
      return;
    }

    setProducts((prev) =>
      prev.map((product) =>
        product.id === editingId
          ? {
              ...product,
              name: newProduct.name,
              price: newProduct.price,
              stock: newProduct.stock,
              lowStock: newProduct.stock < 15,
            }
          : product
      )
    );

    // Reset form
    setNewProduct({ name: "", price: "", stock: "" });
    setEditingId(null);
    setShowAddForm(false);
  };

  // Delete product
  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((product) => product.id !== id));
    }
  };

  // Restock product
  const handleRestock = (id) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, stock: 50, lowStock: false } : product
      )
    );
  };

  // Calculate totals
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.lowStock).length;
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.stock * p.price,
    0
  );

  const getStatusColor = (stock) => {
    return stock < 15
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800";
  };

  const getStatusText = (stock) => {
    return stock < 15 ? "Low Stock" : "In Stock";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your vending machine products
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingId(null);
            setNewProduct({ name: "", price: "", stock: "" });
          }}
          className="mt-4 lg:mt-0 btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>

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
            <span className="text-xs text-green-600">4 products available</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
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

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Mask (Surgical)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₱)
              </label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={newProduct.stock}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50"
                min="0"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={editingId ? handleSaveUpdate : handleAddProduct}
              className="btn btn-primary"
            >
              {editingId ? "Update Product" : "Add Product"}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                setNewProduct({ name: "", price: "", stock: "" });
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or ID..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-3">
            <button className="btn btn-secondary flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button
              onClick={() => setSearchTerm("")}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset</span>
            </button>
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
                  ID
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      #{product.id}
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
                      <span className="text-sm text-gray-500 ml-1">units</span>
                    </div>
                    <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full ${
                          product.stock < 15 ? "bg-red-500" : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            (product.stock / 50) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRestock(product.id)}
                        className="p-1 text-blue-600 hover:text-blue-900 rounded hover:bg-blue-50"
                        title="Restock"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateProduct(product.id)}
                        className="p-1 text-green-600 hover:text-green-900 rounded hover:bg-green-50"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1 text-red-600 hover:text-red-900 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No products found
            </h3>
            <p className="mt-1 text-gray-500">
              {searchTerm
                ? "Try adjusting your search"
                : "Add your first product to get started"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 btn btn-primary"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import client from "../utils/axiosInstance";
import {
  TrendingUp,
  TrendingDown,
  Package,
  CreditCard,
  DollarSign,
  ShoppingCart,
  Users,
  RefreshCw,
  TrendingUp as TrendingUpIcon,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("today");

  // State for fetched data
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    lowStockItems: 0,
    totalProducts: 0,
    todayRevenue: 0,
    averageOrderValue: 0,
    totalUsers: 0,
  });

  // Fetch all data
  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch products
      const productsResponse = await client.get("/products");
      const productsData = productsResponse.data.data || [];
      setProducts(productsData);

      // Fetch orders (transactions)
      const ordersResponse = await client.get("/orders");
      const ordersData = ordersResponse.data.data?.orders || [];
      setOrders(ordersData);

      // Fetch users
      const usersResponse = await client.get("/users");
      const usersData = usersResponse.data.data || [];
      setUsers(usersData);

      // Calculate statistics
      calculateStatistics(productsData, ordersData, usersData, timeRange);

      toast.success("Dashboard data updated", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Failed to load dashboard data", {
        position: "top-right",
        autoClose: 3000,
      });

      // Fallback data for demo
      setStats({
        totalRevenue: 12540,
        totalTransactions: 47,
        lowStockItems: 2,
        totalProducts: 4,
        todayRevenue: 2470,
        averageOrderValue: 21.5,
        totalUsers: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (productsData, ordersData, usersData, range) => {
    // Filter orders based on time range
    const now = new Date();
    let filteredOrders = ordersData;

    if (range === "today") {
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      filteredOrders = ordersData.filter(
        (order) => new Date(order.createdAt) >= todayStart
      );
    } else if (range === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredOrders = ordersData.filter(
        (order) => new Date(order.createdAt) >= weekAgo
      );
    } else if (range === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredOrders = ordersData.filter(
        (order) => new Date(order.createdAt) >= monthAgo
      );
    }

    // Calculate total revenue from all orders
    const totalRevenue = ordersData.reduce((sum, order) => {
      const price = order.productId?.price || 0;
      const quantity = order.quantity || 1;
      return sum + price * quantity;
    }, 0);

    // Calculate today's revenue from filtered orders
    const todayRevenue = filteredOrders.reduce((sum, order) => {
      const price = order.productId?.price || 0;
      const quantity = order.quantity || 1;
      return sum + price * quantity;
    }, 0);

    // Calculate average order value
    const averageOrderValue =
      ordersData.length > 0 ? totalRevenue / ordersData.length : 0;

    // Count low stock products (stock < 3)
    const lowStockItems = productsData.filter(
      (product) => product.stock < 3
    ).length;

    setStats({
      totalRevenue,
      totalTransactions: ordersData.length,
      lowStockItems,
      totalProducts: productsData.length,
      todayRevenue,
      averageOrderValue,
      totalUsers: usersData.length,
    });
  };

  // StatCard Component
  const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    trend,
    color,
    loading: isLoading,
    prefix = "",
    suffix = "",
  }) => {
    const colorClasses = {
      primary: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      red: "bg-red-50 text-red-600",
      purple: "bg-purple-50 text-purple-600",
      orange: "bg-orange-50 text-orange-600",
    };

    const trendColors = {
      up: "text-green-600 bg-green-50",
      down: "text-red-600 bg-red-50",
      neutral: "text-gray-600 bg-gray-50",
    };

    if (isLoading) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-24"></div>
              <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
            </div>
            <div className="mt-4">
              <div className="h-8 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-20 mt-2"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-2xl lg:text-3xl font-bold text-gray-900">
            {prefix}
            {typeof value === "number" ? value.toLocaleString() : value}
            {suffix}
          </p>
          <div className="flex items-center mt-2">
            {trend && change && (
              <>
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${trendColors[trend]}`}
                >
                  {trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : trend === "down" ? (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  ) : null}
                  {change}
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  from yesterday
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: stats.totalRevenue,
      icon: DollarSign,
      change: "+12.5%",
      trend: "up",
      color: "green",
      loading,
      prefix: "₱",
    },
    {
      title: "Today's Revenue",
      value: stats.todayRevenue,
      icon: ShoppingCart,
      change: "+15.3%",
      trend: "up",
      color: "primary",
      loading,
      prefix: "₱",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      change: "+2.1%",
      trend: "up",
      color: "purple",
      loading,
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems,
      icon: AlertTriangle,
      change: stats.lowStockItems > 0 ? "Need attention" : "All good",
      trend: stats.lowStockItems > 0 ? "down" : "neutral",
      color: stats.lowStockItems > 0 ? "red" : "green",
      loading,
    },
  ];

  // Get recent transactions (last 5 orders)
  const recentTransactions = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((order) => ({
      id: order._id?.substring(0, 8) || `ORDER${order._id}`,
      userName: order.userId?.name || "User",
      rfidTag: order.userId?.rfid_tag || "N/A",
      productName: order.productId?.name || "Product",
      productPrice: order.productId?.price || 0,
      quantity: order.quantity || 1,
      totalPrice: (order.productId?.price || 0) * (order.quantity || 1),
      status: order.status || "dispensed",
      deviceResponse: order.deviceResponse || "success",
      createdAt: order.createdAt,
      timeAgo: formatTimeAgo(order.createdAt),
    }));

  // Get low stock products
  const lowStockProducts = products
    .filter((product) => product.stock < 3)
    .slice(0, 4)
    .map((product) => ({
      id: product._id?.substring(0, 8) || product.id,
      name: product.name,
      stock: product.stock,
      maxStock: 10,
      slotNumber: product.slotNumber || 0,
      lowStock: true,
    }));

  // Format time ago
  function formatTimeAgo(dateString) {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Calculate hourly activity for chart - IMPROVED FOR RECHARTS
  const calculateHourlyActivity = () => {
    const hourlyData = Array(12)
      .fill(0)
      .map((_, i) => ({
        name: `${8 + i}:00`,
        hour: `${8 + i}:00`,
        transactions: 0,
        revenue: 0,
      }));

    orders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours();
      if (hour >= 8 && hour <= 19) {
        const index = hour - 8;
        hourlyData[index].transactions++;
        const price = order.productId?.price || 0;
        const quantity = order.quantity || 1;
        hourlyData[index].revenue += price * quantity;
      }
    });

    return hourlyData;
  };

  // Calculate daily revenue for line chart (last 7 days)
  const calculateDailyRevenue = () => {
    const dailyData = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= dayStart && orderDate <= dayEnd;
      });

      const dayRevenue = dayOrders.reduce((sum, order) => {
        const price = order.productId?.price || 0;
        const quantity = order.quantity || 1;
        return sum + price * quantity;
      }, 0);

      dailyData.push({
        name: dateStr,
        revenue: dayRevenue,
        transactions: dayOrders.length,
      });
    }

    return dailyData;
  };

  // Calculate product sales for bar chart
  const calculateProductSales = () => {
    const productSales = {};

    orders.forEach((order) => {
      const productName = order.productId?.name || "Unknown";
      const quantity = order.quantity || 1;

      if (!productSales[productName]) {
        productSales[productName] = {
          name: productName,
          sales: 0,
          revenue: 0,
        };
      }

      const price = order.productId?.price || 0;
      productSales[productName].sales += quantity;
      productSales[productName].revenue += price * quantity;
    });

    return Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  };

  const hourlyActivity = calculateHourlyActivity();
  const dailyRevenue = calculateDailyRevenue();
  const productSales = calculateProductSales();

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.name.includes("₱") ? `₱${entry.value}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading && products.length === 0 && orders.length === 0) {
    return (
      <>
        <ToastContainer />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
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
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time analytics for your RFID vending machine
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={fetchDashboardData}
              className="btn btn-primary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Grid - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Line Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Revenue Trend (7 Days)
                </h2>
                <div className="flex items-center space-x-2">
                  <TrendingUpIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    {stats.totalTransactions} total transactions
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyRevenue}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(value) => `₱${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Product Sales Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Top Selling Products
                </h2>
                <span className="text-sm text-gray-500">By sales volume</span>
              </div>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productSales}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      fontSize={11}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="sales"
                      name="Quantity Sold"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Transactions
                </h2>
                <span className="text-sm text-gray-500">
                  {recentTransactions.length} transactions
                </span>
              </div>
            </div>
            <div className="p-6">
              {recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            transaction.status === "dispensed"
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.userName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {transaction.productName} • Qty:{" "}
                            {transaction.quantity}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            RFID: {transaction.rfidTag}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₱{transaction.totalPrice}
                        </p>
                        <div className="flex items-center justify-end space-x-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              transaction.status === "dispensed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {transaction.timeAgo}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="mt-4 text-gray-500">No recent transactions</p>
                </div>
              )}
              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View all transactions →
                </button>
              </div>
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Low Stock Alert
                </h2>
                <span className="text-sm text-red-600 font-medium">
                  {lowStockProducts.length} items
                </span>
              </div>
            </div>
            <div className="p-6">
              {lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-red-50 text-red-600">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Slot #{product.slotNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          {product.stock} / {product.maxStock}
                        </p>
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-red-500"
                            style={{
                              width: `${
                                (product.stock / product.maxStock) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-red-500 mt-1">
                          {product.stock === 0 ? "OUT OF STOCK" : "LOW STOCK"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto" />
                  <p className="mt-4 text-gray-500">
                    All products are well stocked
                  </p>
                </div>
              )}
              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Manage products →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    {stats.totalUsers}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-700">
                  {orders.length > 0 ? (
                    <>
                      {
                        orders.reduce((unique, order) => {
                          const userId = order.userId?._id;
                          if (userId && !unique.includes(userId)) {
                            unique.push(userId);
                          }
                          return unique;
                        }, []).length
                      }{" "}
                      active today
                    </>
                  ) : (
                    "No activity today"
                  )}
                </p>
              </div>
            </div>
            <p className="text-sm text-blue-700 mt-3">
              Registered RFID users in system
            </p>
          </div>

          {/* Machine Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Machine Status
                  </p>
                  <p className="text-2xl font-bold text-green-800">
                    OPERATIONAL
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs text-green-700">Online</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-green-700 mt-3">
              {orders.length} successful dispenses today
            </p>
          </div>

          {/* System Status */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-purple-900">
                    Last Updated
                  </p>
                  <p className="text-2xl font-bold text-purple-800">
                    {formatTimeAgo(new Date().toISOString())}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <RefreshCw className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-purple-700 mt-3">
              Real-time data from vending machine
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

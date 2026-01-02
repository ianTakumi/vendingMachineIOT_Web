import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  CreditCard,
  Activity,
  AlertCircle,
  RefreshCw,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Clock,
  CheckCircle,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("today");

  const [stats, setStats] = useState({
    totalSales: 0,
    activeUsers: 0,
    lowStockItems: 0,
    todayTransactions: 0,
    averageTransaction: 0,
    successRate: 0,
  });

  // Sample data
  const transactions = [
    {
      id: "TX001",
      user: "Juan Dela Cruz",
      product: "Mask",
      amount: "₱10",
      time: "2 min ago",
      status: "success",
    },
    {
      id: "TX002",
      user: "Maria Santos",
      product: "Alcohol Spray",
      amount: "₱25",
      time: "5 min ago",
      status: "success",
    },
    {
      id: "TX003",
      user: "Pedro Bautista",
      product: "Wet Wipes",
      amount: "₱15",
      time: "15 min ago",
      status: "failed",
    },
    {
      id: "TX004",
      user: "Ana Reyes",
      product: "Sanitizer",
      amount: "₱30",
      time: "30 min ago",
      status: "success",
    },
    {
      id: "TX005",
      user: "Carlos Lim",
      product: "Mask",
      amount: "₱10",
      time: "1 hour ago",
      status: "success",
    },
  ];

  const productInventory = [
    { id: 1, name: "Mask (Surgical)", stock: 12, capacity: 50, lowStock: true },
    { id: 2, name: "Alcohol Spray", stock: 32, capacity: 50, lowStock: false },
    { id: 3, name: "Wet Wipes", stock: 8, capacity: 50, lowStock: true },
    { id: 4, name: "Hand Sanitizer", stock: 28, capacity: 50, lowStock: false },
  ];

  const hourlyActivity = [
    { time: "8-9 AM", transactions: 12, peak: false },
    { time: "9-10 AM", transactions: 24, peak: true },
    { time: "10-11 AM", transactions: 32, peak: true },
    { time: "11-12 PM", transactions: 28, peak: false },
    { time: "12-1 PM", transactions: 41, peak: true },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalSales: 12540,
        activeUsers: 324,
        lowStockItems: 2,
        todayTransactions: 47,
        averageTransaction: 21.5,
        successRate: 96.8,
      });
      setLoading(false);
    }, 1000);
  }, []);

  // StatCard Component
  const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    trend,
    color,
    loading: isLoading,
  }) => {
    const colorClasses = {
      primary: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      red: "bg-red-50 text-red-600",
      purple: "bg-purple-50 text-purple-600",
    };

    const trendColors = {
      up: "text-green-600 bg-green-50",
      down: "text-red-600 bg-red-50",
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
            {value}
          </p>
          <div className="flex items-center mt-2">
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${trendColors[trend]}`}
            >
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {change}
            </div>
            <span className="text-xs text-gray-500 ml-2">from yesterday</span>
          </div>
        </div>
      </div>
    );
  };

  const statCards = [
    {
      title: "Total Sales",
      value: `₱${stats.totalSales.toLocaleString()}`,
      icon: DollarSign,
      change: "+12.5%",
      trend: "up",
      color: "primary",
      loading,
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: Users,
      change: "+8.2%",
      trend: "up",
      color: "green",
      loading,
    },
    {
      title: "Today's Transactions",
      value: stats.todayTransactions,
      icon: ShoppingCart,
      change: "+15.3%",
      trend: "up",
      color: "purple",
      loading,
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      icon: CheckCircle,
      change: "+2.1%",
      trend: "up",
      color: "green",
      loading,
    },
  ];

  // Sales data for chart
  const salesData = [
    { hour: "8AM", sales: 450 },
    { hour: "9AM", sales: 820 },
    { hour: "10AM", sales: 1200 },
    { hour: "11AM", sales: 950 },
    { hour: "12PM", sales: 1500 },
    { hour: "1PM", sales: 1100 },
    { hour: "2PM", sales: 850 },
    { hour: "3PM", sales: 700 },
    { hour: "4PM", sales: 600 },
    { hour: "5PM", sales: 900 },
  ];

  const maxSales = Math.max(...salesData.map((d) => d.sales));

  return (
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
          </select>
          <button className="btn btn-primary flex items-center space-x-2">
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

      {/* Sales Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Sales Analytics
            </h2>
            <div className="flex items-center space-x-2">
              <TrendingUpIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">
                +15.3% today
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-3xl font-bold text-gray-900">₱8,070</p>
              <p className="text-sm text-gray-600">Total sales today</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                47 transactions
              </p>
              <p className="text-xs text-gray-500">Average: ₱21.50</p>
            </div>
          </div>

          <div className="relative h-48">
            <div className="absolute inset-0 flex items-end space-x-1">
              {salesData.map((item, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center group"
                >
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg hover:opacity-90 transition-opacity cursor-pointer group"
                    style={{ height: `${(item.sales / maxSales) * 100}%` }}
                  >
                    <div className="hidden group-hover:block absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      ₱{item.sales} at {item.hour}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">
                    {item.hour}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.status === "success"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.user}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {transaction.amount}
                    </p>
                    <div className="flex items-center justify-end space-x-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          transaction.status === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {transaction.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View all transactions →
              </button>
            </div>
          </div>
        </div>

        {/* Product Inventory */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Product Inventory Status
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {productInventory.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        product.lowStock
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">ID: {product.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {product.stock} / {product.capacity}
                    </p>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full ${
                          product.stock < 15
                            ? "bg-red-500"
                            : product.stock < 25
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${(product.stock / product.capacity) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Manage inventory →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Peak Hour Analysis
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {hourlyActivity.map((hour, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-20">
                    <span
                      className={`text-sm font-medium ${
                        hour.peak ? "text-blue-600" : "text-gray-600"
                      }`}
                    >
                      {hour.time}
                    </span>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            hour.peak ? "bg-blue-500" : "bg-gray-400"
                          } rounded-full transition-all duration-500`}
                          style={{
                            width: `${(hour.transactions / 41) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {hour.transactions}
                      </span>
                    </div>
                  </div>
                  {hour.peak && (
                    <TrendingUp className="h-4 w-4 text-blue-500 ml-2" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Peak hour:</span>
                <span className="text-sm font-medium text-blue-600">
                  12-1 PM (41 transactions)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              System Status
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-medium text-gray-900">RFID Reader</span>
                </div>
                <span className="text-sm text-green-600 font-medium">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="font-medium text-gray-900">Database</span>
                </div>
                <span className="text-sm text-green-600 font-medium">
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="font-medium text-gray-900">Network</span>
                </div>
                <span className="text-sm text-green-600 font-medium">42ms</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="font-medium text-gray-900">
                    API Response
                  </span>
                </div>
                <span className="text-sm text-green-600 font-medium">18ms</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium text-gray-900">
                  2 minutes ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {stats.lowStockItems > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Low Stock Alert
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>• Mask (Surgical) - Only 12 items remaining</p>
                <p className="mt-1">• Wet Wipes - Only 8 items remaining</p>
              </div>
              <div className="mt-3">
                <button className="text-sm font-medium text-yellow-800 hover:text-yellow-900">
                  Restock Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

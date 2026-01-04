// Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  CreditCard,
  BarChart3,
  Shield,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/products", icon: Package, label: "Products" },
    { path: "/users", icon: Users, label: "Users" },
    { path: "/transactions", icon: ShoppingCart, label: "Transactions" },
  ];

  // Auto-close sidebar on mobile when route changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:fixed inset-y-0 left-0 z-40 
          h-screen
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <aside className="w-64 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-700/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                <Home className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  Vending Pro
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Smart Dispenser System
                </p>
              </div>
            </div>
          </div>

          {/* Navigation - Scrollable if needed */}
          <div className="flex-1 overflow-y-auto py-6">
            <nav className="px-4 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
                Main Menu
              </p>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-xl
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border-l-4 border-cyan-400"
                          : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                      }
                    `}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isActive
                          ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                          : "bg-gray-800"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Footer/User Info & Logout */}
          <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Administrator
                  </p>
                  <p className="text-xs text-gray-400">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/products", icon: Package, label: "Products" },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setCollapsed(false)}
        />
      )}

      <aside
        className={`${
          collapsed ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:flex lg:flex-col`}
      >
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

import React, { useState } from "react";
import { Bell, User, LogOut, Menu, X, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      message: "Low stock for Mask (Surgical)",
      time: "10 min ago",
      read: false,
    },
    {
      id: 2,
      message: "Machine #1 requires maintenance",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      message: "Successful transaction: User #324",
      time: "2 hours ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side with Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">
                  RFID Vending Machine
                </h1>
                <p className="text-xs text-gray-500">
                  Automated Hygiene Products
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RiHome5Line,
  RiMovie2Line,
  RiTvLine,
  RiUserLine,
  RiStarLine,
  RiSettings4Line,
  RiLogoutBoxRLine,
} from "react-icons/ri";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navigation = [
    {
      name: "Home",
      icon: RiHome5Line,
      href: "/",
    },
    {
      name: "Movies",
      icon: RiMovie2Line,
      href: "/movies",
    },
    {
      name: "TV Shows",
      icon: RiTvLine,
      href: "/tv",
    },
    {
      name: "People",
      icon: RiUserLine,
      href: "/people",
    },
    {
      name: "Favorites",
      icon: RiStarLine,
      href: "/favorites",
    },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname !== "/") {
      return false;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900/95 backdrop-blur-xl transform transition-transform duration-300 ease-in-out shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b border-zinc-800">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-[#6556CD] to-[#9747FF] bg-clip-text text-transparent"
            onClick={() => setIsOpen(false)}
          >
            Cineplay
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                isActive(item.href)
                  ? "bg-[#6556CD] text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <item.icon
                className={`flex-shrink-0 w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110 ${
                  isActive(item.href) ? "text-white" : "text-zinc-400"
                }`}
              />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800">
          <div className="space-y-1">
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-sm font-medium text-zinc-400 rounded-lg hover:bg-zinc-800 hover:text-white transition-all duration-200 group"
            >
              <RiSettings4Line className="flex-shrink-0 w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
              Settings
            </Link>
            <button
              onClick={() => {
                // Handle logout
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-zinc-400 rounded-lg hover:bg-zinc-800 hover:text-white transition-all duration-200 group"
            >
              <RiLogoutBoxRLine className="flex-shrink-0 w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

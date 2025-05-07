import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  return (
    <div className="h-full p-6 bg-gradient-to-b from-zinc-900/95 to-zinc-900/80 backdrop-blur-xl border-r border-zinc-800/50 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
      {/* Logo with premium animation */}
      <div className="flex items-center gap-2 mb-12 group cursor-pointer">
        <div className="relative">
          <div className="absolute -inset-3 bg-gradient-to-r from-[#6556CD] to-purple-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
          <i className="relative text-[#6556CD] ri-tv-fill text-2xl transition-all duration-500 group-hover:scale-110 group-hover:text-white"></i>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-[#6556CD] via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
          Cineplay
        </span>
      </div>

      {/* Navigation Sections */}
      <div className="space-y-10">
        {/* Main Navigation */}
        <div>
          <h2 className="text-zinc-400 font-medium text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <i className="ri-menu-line text-[#6556CD]"></i>
            Menu
          </h2>
          <div className="space-y-1">
            {[
              { path: "/", icon: "ri-home-4-line", label: "Home" },
              { path: "/trending", icon: "ri-fire-fill", label: "Trending" },
              { path: "/popular", icon: "ri-movie-fill", label: "Popular" },
              { path: "/movies", icon: "ri-film-fill", label: "Movies" },
              { path: "/tv-shows", icon: "ri-tv-fill", label: "TV Shows" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative text-zinc-400 hover:text-white duration-300 text-lg flex items-center gap-3 p-3 rounded-xl transition-all overflow-hidden ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-[#6556CD]/20 to-purple-500/20 text-white"
                    : "hover:bg-zinc-800/50"
                }`}
              >
                <div className="relative">
                  <i
                    className={`${item.icon} transition-all duration-300 group-hover:scale-110`}
                  ></i>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6556CD] to-purple-500 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="relative z-10 font-medium">{item.label}</span>
                {location.pathname === item.path && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#6556CD] to-purple-500 rounded-full"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#6556CD] to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>
        </div>

        {/* Library Section */}
        <div>
          <h2 className="text-zinc-400 font-medium text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <i className="ri-book-2-line text-[#6556CD]"></i>
            Library
          </h2>
          <div className="space-y-1">
            {[
              {
                path: "/watchlist",
                icon: "ri-bookmark-fill",
                label: "Watchlist",
              },
              { path: "/favorites", icon: "ri-heart-fill", label: "Favorites" },
              { path: "/history", icon: "ri-history-fill", label: "History" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative text-zinc-400 hover:text-white duration-300 text-lg flex items-center gap-3 p-3 rounded-xl transition-all overflow-hidden ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-[#6556CD]/20 to-purple-500/20 text-white"
                    : "hover:bg-zinc-800/50"
                }`}
              >
                <div className="relative">
                  <i
                    className={`${item.icon} transition-all duration-300 group-hover:scale-110`}
                  ></i>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6556CD] to-purple-500 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="relative z-10 font-medium">{item.label}</span>
                {location.pathname === item.path && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#6556CD] to-purple-500 rounded-full"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#6556CD] to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>
        </div>

        {/* Settings Section */}
        <div>
          <h2 className="text-zinc-400 font-medium text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <i className="ri-settings-3-line text-[#6556CD]"></i>
            Settings
          </h2>
          <div className="space-y-1">
            {[
              { path: "/profile", icon: "ri-user-fill", label: "Profile" },
              {
                path: "/settings",
                icon: "ri-settings-4-fill",
                label: "Settings",
              },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative text-zinc-400 hover:text-white duration-300 text-lg flex items-center gap-3 p-3 rounded-xl transition-all overflow-hidden ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-[#6556CD]/20 to-purple-500/20 text-white"
                    : "hover:bg-zinc-800/50"
                }`}
              >
                <div className="relative">
                  <i
                    className={`${item.icon} transition-all duration-300 group-hover:scale-110`}
                  ></i>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6556CD] to-purple-500 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="relative z-10 font-medium">{item.label}</span>
                {location.pathname === item.path && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#6556CD] to-purple-500 rounded-full"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#6556CD] to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

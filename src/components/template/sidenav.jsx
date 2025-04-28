import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="h-full p-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <i className="text-[#6556CD] ri-tv-fill text-2xl"></i>
        <span className="text-2xl font-bold">Cineplay</span>
      </div>

      {/* Navigation Sections */}
      <div className="space-y-8">
        {/* Main Navigation */}
        <div>
          <h2 className="text-white font-semibold text-xl mb-4">Menu</h2>
          <div className="space-y-2">
            <Link
              to="/"
              className="text-zinc-400 hover:text-white duration-300 text-lg flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 transition-all"
            >
              <i className="ri-home-4-line"></i>
              <span>Home</span>
            </Link>
            <Link
              to="/trending"
              className="text-zinc-400 hover:text-white duration-300 text-lg flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 transition-all"
            >
              <i className="ri-fire-fill"></i>
              <span>Trending</span>
            </Link>
            <Link
              to="/popular"
              className="text-zinc-400 hover:text-white duration-300 text-lg flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 transition-all"
            >
              <i className="ri-movie-fill"></i>
              <span>Popular</span>
            </Link>
            <Link
              to="/movies"
              className="text-zinc-400 hover:text-white duration-300 text-lg flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 transition-all"
            >
              <i className="ri-film-fill"></i>
              <span>Movies</span>
            </Link>
            <Link
              to="/tv-shows"
              className="text-zinc-400 hover:text-white duration-300 text-lg flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 transition-all"
            >
              <i className="ri-tv-fill"></i>
              <span>TV Shows</span>
            </Link>
          </div>
        </div>

        {/* Library Section */}
        <div>
          <h2 className="text-white font-semibold text-xl mb-4">Library</h2>
          <div className="space-y-2">
            <Link
              to="/watchlist"
              className="text-zinc-400 hover:text-white duration-300 text-lg flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 transition-all"
            >
              <i className="ri-bookmark-fill"></i>
              <span>Watchlist</span>
            </Link>
            <Link
              to="/favorites"
              className="text-zinc-400 hover:text-white duration-300 text-lg flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 transition-all"
            >
              <i className="ri-heart-fill"></i>
              <span>Favorites</span>
            </Link>
            <Link
              to="/history"
              className="text-zinc-400 hover:text-white duration-300 text-lg flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 transition-all"
            >
              <i className="ri-history-fill"></i>
              <span>History</span>
            </Link>
          </div>
        </div>

        {/* Settings Section */}
        <div>
          <h2 className="text-white font-semibold text-xl mb-4">Settings</h2>
          <div className="space-y-2">
            <Link
              to="/profile"
              className="text-zinc-400 hover:text-white duration-300 text-lg flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 transition-all"
            >
              <i className="ri-user-fill"></i>
              <span>Profile</span>
            </Link>
            <Link
              to="/settings"
              className="text-zinc-400 hover:text-white duration-300 text-lg flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 transition-all"
            >
              <i className="ri-settings-4-fill"></i>
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

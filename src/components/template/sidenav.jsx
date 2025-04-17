import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-[20%] h-full border-r border-zinc-400 p-3">
      <h1 className="flex items-center gap-2">
        <i className="text-[#6556CD] ri-tv-fill text-2xl"></i>
        <span className="text-2xl font-bold">Cineplay App</span>
      </h1>
      <nav>
        <h1 className="text-white font-semibold text-xl mt-10 mb-5">
          New Feeds
        </h1>
        <Link
          className="text-zinc-400 hover:text-white duration-500 text-xl flex items-center gap-2 p-2 rounded-lg hover:bg-gradient-to-r from-zinc-800/50 to-transparent hover:scale-[1.02] transition-all ease-out hover:translate-x-2 group relative overflow-hidden"
          to="/trending"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <i className="ri-fire-fill group-hover:text-orange-500 transition-all duration-500"></i>
          <span className="group-hover:font-semibold transition-all duration-500 relative">
            Trending
          </span>
        </Link>
        <Link
          className="text-zinc-400 hover:text-white duration-500 text-xl flex items-center gap-2 p-2 rounded-lg hover:bg-gradient-to-r from-zinc-800/50 to-transparent hover:scale-[1.02] transition-all ease-out hover:translate-x-2 group relative overflow-hidden"
          to="/popular"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <i className="ri-movie-fill group-hover:text-blue-500 transition-all duration-500"></i>
          <span className="group-hover:font-semibold transition-all duration-500 relative">
            Popular
          </span>
        </Link>
        <Link
          className="text-zinc-400 hover:text-white duration-500 text-xl flex items-center gap-2 p-2 rounded-lg hover:bg-gradient-to-r from-zinc-800/50 to-transparent hover:scale-[1.02] transition-all ease-out hover:translate-x-2 group relative overflow-hidden"
          to="/movies"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <i className="ri-film-fill group-hover:text-purple-500 transition-all duration-500"></i>
          <span className="group-hover:font-semibold transition-all duration-500 relative">
            Movies
          </span>
        </Link>
        <Link
          className="text-zinc-400 hover:text-white duration-500 text-xl flex items-center gap-2 p-2 rounded-lg hover:bg-gradient-to-r from-zinc-800/50 to-transparent hover:scale-[1.02] transition-all ease-out hover:translate-x-2 group relative overflow-hidden"
          to="/tv-shows"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <i className="ri-tv-fill group-hover:text-green-500 transition-all duration-500"></i>
          <span className="group-hover:font-semibold transition-all duration-500 relative">
            TV Shows
          </span>
        </Link>
        <Link
          className="text-zinc-400 hover:text-white duration-500 text-xl flex items-center gap-2 p-2 rounded-lg hover:bg-gradient-to-r from-zinc-800/50 to-transparent hover:scale-[1.02] transition-all ease-out hover:translate-x-2 group relative overflow-hidden"
          to="/people"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <i className="ri-user-fill group-hover:text-pink-500 transition-all duration-500"></i>
          <span className="group-hover:font-semibold transition-all duration-500 relative">
            Peoples
          </span>
        </Link>
      </nav>

      <hr className="my-8 border-zinc-800" />

      <nav>
        <h1 className="text-white font-semibold text-xl mb-5 flex items-center gap-2">
          <i className="ri-information-fill text-[#6556CD]"></i>
          Website Information
        </h1>
        <Link
          className="text-zinc-400 hover:text-white duration-500 text-lg flex items-center gap-2 p-2 rounded-lg hover:bg-gradient-to-r from-zinc-800/50 to-transparent hover:scale-[1.02] transition-all ease-out hover:translate-x-2 group relative overflow-hidden"
          to="/about"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <i className="ri-information-line group-hover:text-cyan-500 transition-all duration-500"></i>
          <span className="group-hover:font-semibold transition-all duration-500 relative">
            About Us
          </span>
        </Link>
        <Link
          className="text-zinc-400 hover:text-white duration-500 text-lg flex items-center gap-2 p-2 rounded-lg hover:bg-gradient-to-r from-zinc-800/50 to-transparent hover:scale-[1.02] transition-all ease-out hover:translate-x-2 group relative overflow-hidden"
          to="/contact"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <i className="ri-customer-service-2-line group-hover:text-cyan-500 transition-all duration-500"></i>
          <span className="group-hover:font-semibold transition-all duration-500 relative">
            Contact Us
          </span>
        </Link>
        <Link
          className="text-zinc-400 hover:text-white duration-500 text-lg flex items-center gap-2 p-2 rounded-lg hover:bg-gradient-to-r from-zinc-800/50 to-transparent hover:scale-[1.02] transition-all ease-out hover:translate-x-2 group relative overflow-hidden"
          to="/privacy"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <i className="ri-shield-check-line group-hover:text-cyan-500 transition-all duration-500"></i>
          <span className="group-hover:font-semibold transition-all duration-500 relative">
            Privacy Policy
          </span>
        </Link>
        <Link
          className="text-zinc-400 hover:text-white duration-500 text-lg flex items-center gap-2 p-2 rounded-lg hover:bg-gradient-to-r from-zinc-800/50 to-transparent hover:scale-[1.02] transition-all ease-out hover:translate-x-2 group relative overflow-hidden"
          to="/terms"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <i className="ri-file-list-3-line group-hover:text-cyan-500 transition-all duration-500"></i>
          <span className="group-hover:font-semibold transition-all duration-500 relative">
            Terms of Service
          </span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;

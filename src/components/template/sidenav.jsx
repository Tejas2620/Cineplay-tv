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
          className="text-zinc-400 hover:text-white duration-300 text-xl flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 hover:scale-105 transition-all ease-in-out hover:translate-x-2 group"
          to="/trending"
        >
          <i className="ri-fire-fill group-hover:text-orange-500 transition-colors duration-300"></i>
          <span className="group-hover:font-semibold transition-all duration-300">Trending</span>
        </Link>
        <Link
          className="text-zinc-400 hover:text-white duration-300 text-xl flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 hover:scale-105 transition-all ease-in-out hover:translate-x-2 group"
          to="/popular"
        >
          <i className="ri-movie-fill group-hover:text-blue-500 transition-colors duration-300"></i>
          <span className="group-hover:font-semibold transition-all duration-300">Popular</span>
        </Link>
        <Link
          className="text-zinc-400 hover:text-white duration-300 text-xl flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 hover:scale-105 transition-all ease-in-out hover:translate-x-2 group"
          to="/movies"
        >
          <i className="ri-film-fill group-hover:text-purple-500 transition-colors duration-300"></i>
          <span className="group-hover:font-semibold transition-all duration-300">Movies</span>
        </Link>
        <Link
          className="text-zinc-400 hover:text-white duration-300 text-xl flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 hover:scale-105 transition-all ease-in-out hover:translate-x-2 group"
          to="/tv-shows"
        >
          <i className="ri-tv-fill group-hover:text-green-500 transition-colors duration-300"></i>
          <span className="group-hover:font-semibold transition-all duration-300">TV Shows</span>
        </Link>
        <Link
          className="text-zinc-400 hover:text-white duration-300 text-xl flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 hover:scale-105 transition-all ease-in-out hover:translate-x-2 group"
          to="/people"
        >
          <i className="ri-user-fill group-hover:text-pink-500 transition-colors duration-300"></i>
          <span className="group-hover:font-semibold transition-all duration-300">Peoples</span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiSearchLine, RiCloseLine } from "react-icons/ri";
import axios from "../../utils/axios";

function Topnav() {
  const [query, setQuery] = useState("");
  const [searches, setSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const getSearches = async () => {
    try {
      const { data } = await axios.get(`/search/multi?query=${query}`);
      setSearches(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (query.length > 0) {
      setIsSearching(true);
      const debounce = setTimeout(() => {
        getSearches();
        setIsSearching(false);
      }, 1000);
      return () => clearTimeout(debounce);
    } else {
      setSearches([]);
    }
  }, [query]);

  const getImageUrl = (mediaType, posterPath) => {
    if (mediaType === "person") {
      return `https://image.tmdb.org/t/p/w500${posterPath}`;
    }
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  return (
    <div className="w-full h-full flex justify-center items-center px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="relative w-full max-w-2xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for movies, TV shows, people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-9 sm:h-10 px-3 sm:px-4 pr-10 rounded-lg bg-zinc-800/50 text-white text-sm sm:text-base placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#6556CD] transition-all duration-300"
          />
          {query.length > 0 && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors duration-300"
            >
              <RiCloseLine className="text-lg sm:text-xl" />
            </button>
          )}
          <RiSearchLine className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg sm:text-xl" />
        </div>

        {query.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/90 backdrop-blur-xl rounded-lg shadow-xl max-h-[60vh] overflow-y-auto custom-scrollbar">
            {isSearching ? (
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#6556CD]"></div>
              </div>
            ) : searches.length > 0 ? (
              <div className="p-2">
                {searches.map((item) => (
                  <Link
                    key={item.id}
                    to={`/${item.media_type}/${item.id}`}
                    className="flex items-center gap-3 p-2 hover:bg-zinc-800/50 rounded-lg transition-colors duration-300"
                  >
                    <div className="w-12 h-16 sm:w-14 sm:h-20 flex-shrink-0 rounded overflow-hidden">
                      <img
                        src={getImageUrl(
                          item.media_type,
                          item.poster_path || item.profile_path
                        )}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm sm:text-base truncate">
                        {item.title || item.name}
                      </h3>
                      <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm">
                        <span className="capitalize">{item.media_type}</span>
                        <span>•</span>
                        <span>
                          {item.media_type === "movie"
                            ? item.release_date?.split("-")[0]
                            : item.first_air_date?.split("-")[0]}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-zinc-400">
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Topnav;

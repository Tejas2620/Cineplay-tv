import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiSearchLine, RiCloseLine } from "react-icons/ri";
import axios from "../../utils/axios";

const Topnav = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSearches = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`/search/multi?query=${searchQuery}`);
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce the search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      getSearches();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Function to get the appropriate image URL or placeholder
  const getImageUrl = (result) => {
    const defaultImage =
      "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fcdn4.iconfinder.com%2Fdata%2Ficons%2Fsolid-part-6%2F128%2Fimage_icon-512.png&sp=1745693948Tb2a8cc02cfd126ff7be597f4c0657d79d5ca410a1c76d0929069d9b6b349aba0";

    if (result.media_type === "person") {
      return result.profile_path
        ? `https://image.tmdb.org/t/p/w500${result.profile_path}`
        : defaultImage;
    } else {
      return result.poster_path
        ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
        : defaultImage;
    }
  };

  return (
    <div className="w-full h-[10vh] relative flex justify-center items-center bg-zinc-900 px-5">
      <div className="relative w-[50%] flex items-center">
        <i className="text-zinc-400 text-3xl mr-4 ri-search-line"></i>
        <input
          className="w-full mx-10 p-5 pl-10 text-zinc-100 text-xl outline-none border-none bg-transparent"
          type="text"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {searchQuery.length > 0 && (
          <i
            onClick={() => setSearchQuery("")}
            className="text-zinc-400 text-3xl mr-4 ri-close-line cursor-pointer hover:text-zinc-200"
          ></i>
        )}
      </div>

      {/* Search Results Navigation - Only shown when there's a search query */}
      {searchQuery.length > 0 && (
        <div className="absolute w-[50%] max-h-[50vh] bg-zinc-800 top-[90%] overflow-y-auto rounded-md shadow-lg z-50 custom-scrollbar">
          <div className="p-4">
            <h3 className="text-zinc-100 font-semibold mb-3">Search Results</h3>

            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-100"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="block p-2 hover:bg-zinc-700 rounded-md transition-colors cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex-shrink-0 mr-3 bg-zinc-700 rounded overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={getImageUrl(result)}
                          alt={result.title || result.name || "Untitled"}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-zinc-100 font-medium truncate">
                          {result.title || result.name || "Untitled"}
                        </p>
                        <p className="text-zinc-400 text-sm truncate">
                          {result.media_type === "movie"
                            ? "Movie"
                            : result.media_type === "tv"
                            ? "TV Show"
                            : result.media_type === "person"
                            ? "Person"
                            : "Other"}
                          {result.release_date &&
                            ` • ${result.release_date.split("-")[0]}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-zinc-400 text-center py-4">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Topnav;

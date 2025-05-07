import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Trending() {
  const [mediaType, setMediaType] = useState("movie");
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [timeWindow, setTimeWindow] = useState("all"); // all, month, week, day
  const [sortBy, setSortBy] = useState("popularity"); // popularity, vote_average, release_date
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Auto-change featured item every 5 seconds
  useEffect(() => {
    if (trending.length > 0) {
      const interval = setInterval(() => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % trending.length);
        setFeatured(trending[currentFeaturedIndex]);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [trending, currentFeaturedIndex]);

  // Fetch genres for tags
  const fetchGenres = async () => {
    try {
      const response = await axios.get(`/genre/${mediaType}/list`);
      setGenres(response.data.genres);
    } catch (error) {
      setGenres([]);
    }
  };

  // Search function with debouncing
  const handleSearch = useCallback(
    async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const response = await axios.get(`/search/${mediaType}`, {
          params: {
            query: query,
            page: 1,
          },
        });

        // Filter results to ensure they match the search query
        const filteredResults = response.data.results.filter((item) => {
          const title = (item.title || item.name || "").toLowerCase();
          const searchTerm = query.toLowerCase();
          return title.includes(searchTerm);
        });

        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Error searching:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [mediaType]
  );

  // Debounced search effect
  useEffect(() => {
    const search = async () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(searchQuery);
      }, 200); // Reduced debounce time to 200ms

      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    };

    search();
  }, [searchQuery, handleSearch]);

  const fetchTrending = async () => {
    try {
      setLoading(true);
      let endpoint;
      let params = { page };

      // Set endpoint based on time window
      switch (timeWindow) {
        case "all":
          endpoint = mediaType === "movie" ? "/movie/popular" : "/tv/popular";
          break;
        case "month":
          // For month, we'll use discover endpoint with date filtering
          endpoint = mediaType === "movie" ? "/discover/movie" : "/discover/tv";
          const today = new Date();
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);

          params = {
            ...params,
            sort_by: "popularity.desc",
            "primary_release_date.gte": monthAgo.toISOString().split("T")[0],
            "primary_release_date.lte": today.toISOString().split("T")[0],
            include_adult: false,
            include_video: false,
            language: "en-US",
          };
          break;
        case "week":
          endpoint = `/trending/${mediaType}/week`;
          break;
        case "day":
          endpoint = `/trending/${mediaType}/day`;
          break;
        default:
          endpoint = `/trending/${mediaType}/day`;
      }

      const response = await axios.get(endpoint, { params });
      const results = response.data.results;
      const totalPages = response.data.total_pages;

      // Update hasMore based on current page and total pages
      setHasMore(page < totalPages);
      setTotalPages(totalPages);

      // Apply sorting
      const sortedResults = [...results].sort((a, b) => {
        switch (sortBy) {
          case "popularity":
            return b.popularity - a.popularity;
          case "vote_average":
            return b.vote_average - a.vote_average;
          case "release_date":
            return (
              new Date(b.release_date || b.first_air_date) -
              new Date(a.release_date || a.first_air_date)
            );
          default:
            return 0;
        }
      });

      // Apply genre filter
      const filteredResults =
        selectedGenres.length > 0
          ? sortedResults.filter((item) =>
              item.genre_ids.some((id) => selectedGenres.includes(id))
            )
          : sortedResults;

      if (page === 1) {
        setTrending(filteredResults);
        setFeatured(filteredResults[0]);
        setCurrentFeaturedIndex(0);
      } else {
        // Only add new results that aren't already in the list
        const newResults = filteredResults.filter(
          (newItem) =>
            !trending.some((existingItem) => existingItem.id === newItem.id)
        );
        setTrending((prev) => [...prev, ...newResults]);
      }
    } catch (error) {
      console.error("Error fetching trending:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle scroll to load more content
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500 &&
      !loading &&
      hasMore &&
      !searchQuery
    ) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore, searchQuery]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Reset page and fetch new content when filters change
  useEffect(() => {
    setPage(1);
    setTrending([]);
    setHasMore(true);
    fetchTrending();
    fetchGenres();
  }, [mediaType, timeWindow, sortBy, selectedGenres]);

  // Fetch more content when page changes
  useEffect(() => {
    if (page > 1) {
      fetchTrending();
    }
  }, [page]);

  // Handle scroll to expand search
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading && page === 1) {
    return null;
  }

  const getGenreNames = (genreIds) => {
    return genreIds
      ?.map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2);
  };

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  // Determine which items to display
  const displayItems = searchQuery ? searchResults : trending;

  return (
    <div className="min-h-screen bg-[#1F1E24] overflow-x-hidden">
      {/* Dynamic Search Bar */}
      <motion.div
        className={`fixed top-0 left-0 right-0 z-50 ${
          scrollPosition > 100
            ? "bg-[#1F1E24]/95 backdrop-blur-lg"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex-1 max-w-2xl mx-auto"
              animate={{
                scale: scrollPosition > 100 ? 1.1 : 1,
                transition: { duration: 0.3 },
              }}
            >
              <div className="relative">
                <motion.input
                  type="text"
                  placeholder="Search movies and TV shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchExpanded(true)}
                  onBlur={() => setIsSearchExpanded(false)}
                  className={`w-full bg-zinc-800/50 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6556CD] transition-all duration-300 ${
                    isSearchExpanded ? "pr-12" : "pr-10"
                  }`}
                  animate={{
                    paddingLeft: isSearchExpanded ? "1.5rem" : "1rem",
                    paddingRight: isSearchExpanded ? "3rem" : "2.5rem",
                  }}
                />
                <motion.i
                  className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  animate={{
                    scale: isSearchExpanded ? 1.2 : 1,
                    color: isSearchExpanded ? "#6556CD" : "#9CA3AF",
                  }}
                />
                {isSearching && (
                  <motion.div
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-4 h-4 border-2 border-[#6556CD] border-t-transparent rounded-full animate-spin"></div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 right-0 z-40 bg-[#1F1E24]/95 backdrop-blur-lg"
          >
            <div className="max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 py-4">
              {isSearching ? (
                <div className="flex justify-center items-center py-4">
                  <div className="w-8 h-8 border-4 border-[#6556CD] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      to={`/${mediaType}/${item.id}`}
                      className="group relative bg-zinc-800/50 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="relative aspect-[2/3]">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt={item.title || item.name}
                          className="w-full h-full object-cover group-hover:brightness-90 transition"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-2 space-y-1">
                            <h3 className="text-white font-semibold text-sm line-clamp-2">
                              {item.title || item.name}
                            </h3>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">
                                <i className="ri-star-fill text-xs"></i>
                              </span>
                              <span className="text-white text-xs">
                                {item.vote_average.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      {featured && !searchQuery && (
        <div className="relative h-[70vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-700"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(31,30,36,0.98) 0%, rgba(31,30,36,0.7) 50%, rgba(31,30,36,0.98) 100%), url(https://image.tmdb.org/t/p/original${featured.backdrop_path})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1E24] to-transparent" />

          <div className="relative h-full w-full max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
            <div className="flex gap-8 w-full">
              <div className="hidden md:block w-64 h-96 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src={`https://image.tmdb.org/t/p/w500${featured.poster_path}`}
                  alt={featured.title || featured.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-block bg-gradient-to-r from-[#6556CD] to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest animate-pulse shadow-lg">
                    TRENDING NOW
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up truncate">
                  {featured.title || featured.name}
                </h1>
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  <span className="text-yellow-400">
                    <i className="ri-star-fill"></i>
                  </span>
                  <span>{featured.vote_average.toFixed(1)}</span>
                  <span>•</span>
                  <span>
                    {mediaType === "movie"
                      ? featured.release_date?.split("-")[0]
                      : featured.first_air_date?.split("-")[0]}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline text-xs text-zinc-300 truncate">
                    {getGenreNames(featured.genre_ids)?.join(", ")}
                  </span>
                </div>
                <p className="text-gray-300 text-lg mb-6 line-clamp-3 animate-fade-in-up delay-100">
                  {featured.overview}
                </p>
                <div className="flex gap-4">
                  <Link
                    to={`/${mediaType}/${featured.id}`}
                    className="inline-flex items-center gap-2 bg-[#6556CD] hover:bg-[#4f42a3] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors duration-300 animate-fade-in-up delay-200"
                  >
                    <i className="ri-information-line"></i>
                    More Info
                  </Link>
                  <button className="inline-flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-700/50 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors duration-300 animate-fade-in-up delay-200">
                    <i className="ri-bookmark-line"></i>
                    Add to Watchlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls Section */}
      <div className="sticky top-0 z-30 bg-[#1F1E24]/90 backdrop-blur-md py-4 mb-4">
        <div className="max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Media Type and Time Window */}
            <div className="flex gap-2">
              <div className="bg-zinc-800/50 rounded-lg p-1 flex gap-2">
                <button
                  onClick={() => setMediaType("movie")}
                  className={`px-4 py-2 rounded-md transition-colors duration-300 font-semibold ${
                    mediaType === "movie"
                      ? "bg-gradient-to-r from-[#6556CD] to-purple-500 text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Movies
                </button>
                <button
                  onClick={() => setMediaType("tv")}
                  className={`px-4 py-2 rounded-md transition-colors duration-300 font-semibold ${
                    mediaType === "tv"
                      ? "bg-gradient-to-r from-[#6556CD] to-purple-500 text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  TV Shows
                </button>
              </div>
              {!searchQuery && (
                <div className="bg-zinc-800/50 rounded-lg p-1 flex gap-2">
                  <button
                    onClick={() => setTimeWindow("all")}
                    className={`px-4 py-2 rounded-md transition-colors duration-300 font-semibold ${
                      timeWindow === "all"
                        ? "bg-gradient-to-r from-[#6556CD] to-purple-500 text-white shadow"
                        : "text-gray-400 hover:text-white"
                    }`}
                    title="All popular content"
                  >
                    All Popular
                  </button>
                  <button
                    onClick={() => setTimeWindow("month")}
                    className={`px-4 py-2 rounded-md transition-colors duration-300 font-semibold ${
                      timeWindow === "month"
                        ? "bg-gradient-to-r from-[#6556CD] to-purple-500 text-white shadow"
                        : "text-gray-400 hover:text-white"
                    }`}
                    title="Content released in the last month"
                  >
                    Last Month
                  </button>
                  <button
                    onClick={() => setTimeWindow("week")}
                    className={`px-4 py-2 rounded-md transition-colors duration-300 font-semibold ${
                      timeWindow === "week"
                        ? "bg-gradient-to-r from-[#6556CD] to-purple-500 text-white shadow"
                        : "text-gray-400 hover:text-white"
                    }`}
                    title="Content trending this week"
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setTimeWindow("day")}
                    className={`px-4 py-2 rounded-md transition-colors duration-300 font-semibold ${
                      timeWindow === "day"
                        ? "bg-gradient-to-r from-[#6556CD] to-purple-500 text-white shadow"
                        : "text-gray-400 hover:text-white"
                    }`}
                    title="Content trending today"
                  >
                    Today
                  </button>
                </div>
              )}
            </div>

            {/* Search and Filters */}
            <div className="flex gap-2">
              {!searchQuery && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-zinc-800/50 hover:bg-zinc-700/50 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
                >
                  <i className="ri-filter-3-line"></i>
                  Filters
                </button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && !searchQuery && (
            <div className="mt-4 bg-zinc-800/50 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sort Options */}
                <div>
                  <h3 className="text-white font-semibold mb-2">Sort By</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortBy("popularity")}
                      className={`px-3 py-1 rounded-md transition-colors duration-300 ${
                        sortBy === "popularity"
                          ? "bg-[#6556CD] text-white"
                          : "bg-zinc-700/50 text-gray-400 hover:text-white"
                      }`}
                    >
                      Popularity
                    </button>
                    <button
                      onClick={() => setSortBy("vote_average")}
                      className={`px-3 py-1 rounded-md transition-colors duration-300 ${
                        sortBy === "vote_average"
                          ? "bg-[#6556CD] text-white"
                          : "bg-zinc-700/50 text-gray-400 hover:text-white"
                      }`}
                    >
                      Rating
                    </button>
                    <button
                      onClick={() => setSortBy("release_date")}
                      className={`px-3 py-1 rounded-md transition-colors duration-300 ${
                        sortBy === "release_date"
                          ? "bg-[#6556CD] text-white"
                          : "bg-zinc-700/50 text-gray-400 hover:text-white"
                      }`}
                    >
                      Release Date
                    </button>
                  </div>
                </div>

                {/* Genre Filters */}
                <div>
                  <h3 className="text-white font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre.id}
                        onClick={() => toggleGenre(genre.id)}
                        className={`px-3 py-1 rounded-full text-xs transition-colors duration-300 ${
                          selectedGenres.includes(genre.id)
                            ? "bg-[#6556CD] text-white"
                            : "bg-zinc-700/50 text-gray-400 hover:text-white"
                        }`}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="w-full max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {displayItems.map((item, idx) => (
            <Link
              key={item.id}
              to={`/${mediaType}/${item.id}`}
              className="group relative bg-zinc-800/50 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300 fade-in-card"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="relative aspect-[2/3]">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover group-hover:brightness-90 transition"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-2 space-y-1">
                    <h3 className="text-white font-semibold text-sm line-clamp-2">
                      {item.title || item.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">
                        <i className="ri-star-fill text-xs"></i>
                      </span>
                      <span className="text-white text-xs">
                        {item.vote_average.toFixed(1)}
                      </span>
                      <span className="text-white text-xs">
                        •{" "}
                        {mediaType === "movie"
                          ? item.release_date?.split("-")[0]
                          : item.first_air_date?.split("-")[0]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getGenreNames(item.genre_ids).map((genre, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-[#6556CD]/80 text-white px-1.5 py-0.5 rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Loading Indicator */}
        {loading && page > 1 && !searchQuery && (
          <div className="flex justify-center mt-8">
            <div className="w-8 h-8 border-4 border-[#6556CD] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* No More Content Message */}
        {!hasMore && !loading && !searchQuery && (
          <div className="text-center mt-8 text-gray-400">
            No more content to load
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        .fade-in-card {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.5s forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.7s forwards;
        }
        .animate-fade-in-up.delay-100 {
          animation-delay: 0.1s;
        }
        .animate-fade-in-up.delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}

export default Trending;

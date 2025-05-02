import React, { useState, useEffect, useCallback } from "react";
import axios from "../utils/axios";
import { Link } from "react-router-dom";

function Trending() {
  const [mediaType, setMediaType] = useState("movie");
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

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

  const fetchTrending = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/trending/${mediaType}/day`, {
        params: { page },
      });
      const results = response.data.results;
      setTotalPages(response.data.total_pages);
      if (page === 1) {
        setTrending(results);
        setFeatured(results[0]);
        setCurrentFeaturedIndex(0);
      } else {
        const newResults = results.filter(
          (newItem) =>
            !trending.some((existingItem) => existingItem.id === newItem.id)
        );
        setTrending((prev) => [...prev, ...newResults]);
      }
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500 &&
      !loading &&
      page < totalPages
    ) {
      setPage((prev) => prev + 1);
    }
  }, [loading, page, totalPages]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setPage(1);
    setTrending([]);
    fetchTrending();
    fetchGenres();
  }, [mediaType]);

  useEffect(() => {
    if (page > 1) {
      fetchTrending();
    }
  }, [page]);

  if (loading && page === 1) {
    return null; // App-level loading will handle this
  }

  // Helper to get genre names
  const getGenreNames = (genreIds) => {
    return genreIds
      ?.map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#1F1E24] overflow-x-hidden">
      {/* Hero Section */}
      {featured && (
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
                <Link
                  to={`/${mediaType}/${featured.id}`}
                  className="inline-flex items-center gap-2 bg-[#6556CD] hover:bg-[#4f42a3] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors duration-300 animate-fade-in-up delay-200"
                >
                  <i className="ri-information-line"></i>
                  More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Media Type Selector */}
      <div className="sticky top-0 z-30 bg-[#1F1E24]/90 backdrop-blur-md py-4 mb-4 flex justify-center shadow-lg">
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
      </div>

      {/* Trending Grid */}
      <div className="w-full max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {trending.map((item, idx) => (
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
        {loading && page > 1 && (
          <div className="flex justify-center mt-8">
            <div className="w-8 h-8 border-4 border-[#6556CD] border-t-transparent rounded-full animate-spin"></div>
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

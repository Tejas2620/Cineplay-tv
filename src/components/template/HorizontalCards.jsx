import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";
import MediaSelector from "./MediaSelector";

function HorizontalCards({ title, endpoint }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mediaType, setMediaType] = useState("movie");
  const [selectedItem, setSelectedItem] = useState(null);
  const [genres, setGenres] = useState([]);

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`/genre/${mediaType}/list`);
      setGenres(response.data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      let apiEndpoint = endpoint;

      if (endpoint === "/trending/all/day") {
        apiEndpoint = `/trending/${mediaType}/day`;
      } else if (endpoint === "/movie/popular") {
        apiEndpoint = mediaType === "movie" ? "/movie/popular" : "/tv/popular";
      } else if (endpoint === "/movie/upcoming") {
        apiEndpoint =
          mediaType === "movie" ? "/movie/upcoming" : "/tv/on_the_air";
      }

      const response = await axios.get(apiEndpoint);
      setMedia(response.data.results);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
    fetchGenres();
  }, [endpoint, mediaType]);

  const getTitle = () => {
    if (title === "Popular Movies") {
      return mediaType === "movie" ? "Popular Movies" : "Popular TV Shows";
    } else if (title === "Upcoming Movies") {
      return mediaType === "movie" ? "Upcoming Movies" : "On The Air TV Shows";
    }
    return title;
  };

  const getGenreNames = (genreIds) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="w-full h-[50vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-[50vh] p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">{getTitle()}</h1>
          <MediaSelector selectedType={mediaType} onTypeChange={setMediaType} />
        </div>
        <Link
          to={`/${title.toLowerCase().replace(/\s+/g, "-")}?type=${mediaType}`}
          className="text-[#6556CD] hover:text-[#4f42a3] transition-colors duration-300 flex items-center gap-2"
        >
          View All
          <i className="ri-arrow-right-line"></i>
        </Link>
      </div>

      <div className="relative group">
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {media.map((item) => (
            <div
              key={item.id}
              className="flex-none w-[200px] h-[300px] rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 relative group"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 p-4 w-full">
                  <h3 className="text-white font-semibold line-clamp-2">
                    {item.title || item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-400">
                      <i className="ri-star-fill"></i>
                    </span>
                    <span className="text-white text-sm">
                      {item.vote_average.toFixed(1)}
                    </span>
                    <span className="text-white text-sm">
                      •{" "}
                      {mediaType === "movie"
                        ? item.release_date?.split("-")[0]
                        : item.first_air_date?.split("-")[0]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {getGenreNames(item.genre_ids).map((genre, index) => (
                      <span
                        key={index}
                        className="text-xs bg-[#6556CD]/80 text-white px-2 py-1 rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="w-full mt-3 bg-[#6556CD] hover:bg-[#4f42a3] text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient Overlays for Scroll Indication */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#1F1E24] to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#1F1E24] to-transparent pointer-events-none"></div>
      </div>

      {/* Quick View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl bg-[#1F1E24] rounded-lg overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-300 z-10"
            >
              <i className="ri-close-line text-3xl"></i>
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left Section - Poster */}
              <div className="w-full md:w-1/3 relative">
                <img
                  src={`https://image.tmdb.org/t/p/w500${selectedItem.poster_path}`}
                  alt={selectedItem.title || selectedItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Right Section - Details */}
              <div className="p-6 flex-1">
                {/* Title and Rating */}
                <div className="flex items-start justify-between mb-4 pr-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedItem.title || selectedItem.name}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {selectedItem.tagline}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#6556CD]/20 px-3 py-1 rounded-full">
                    <i className="ri-star-fill text-yellow-400"></i>
                    <span className="text-white font-semibold">
                      {selectedItem.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Meta Information */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                  <span>
                    {mediaType === "movie"
                      ? selectedItem.release_date?.split("-")[0]
                      : selectedItem.first_air_date?.split("-")[0]}
                  </span>
                  <span>•</span>
                  <span>
                    {selectedItem.runtime || selectedItem.episode_run_time?.[0]}{" "}
                    min
                  </span>
                  <span>•</span>
                  <span>
                    {selectedItem.genres?.map((genre) => genre.name).join(", ")}
                  </span>
                </div>

                {/* Overview */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Overview
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                      {selectedItem.overview}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-800/50 p-3 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-400 mb-1">
                          Release Date
                        </h4>
                        <p className="text-white">
                          {mediaType === "movie"
                            ? new Date(
                                selectedItem.release_date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : new Date(
                                selectedItem.first_air_date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                        </p>
                      </div>
                      <div className="bg-zinc-800/50 p-3 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-400 mb-1">
                          Runtime
                        </h4>
                        <p className="text-white">
                          {selectedItem.runtime ||
                            selectedItem.episode_run_time?.[0]}{" "}
                          minutes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/${mediaType}/${selectedItem.id}`}
                    className="bg-[#6556CD] hover:bg-[#4f42a3] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2"
                  >
                    <i className="ri-information-line"></i>
                    View Full Details
                  </Link>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2">
                    <i className="ri-heart-line"></i>
                    Add to Favorites
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2">
                    <i className="ri-bookmark-line"></i>
                    Add to Watchlist
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-zinc-800/50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-400 mb-1">
                      Language
                    </h4>
                    <p className="text-white">
                      {selectedItem.original_language?.toUpperCase()}
                    </p>
                  </div>
                  <div className="bg-zinc-800/50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-400 mb-1">
                      Popularity
                    </h4>
                    <p className="text-white">
                      {selectedItem.popularity?.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HorizontalCards;

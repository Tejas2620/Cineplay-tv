import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";
import MediaSelector from "./MediaSelector";

function HorizontalCards({ title, endpoint, className = "" }) {
  const [media, setMedia] = useState([]);
  const [mediaType, setMediaType] = useState("movie");
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
      let apiEndpoint = endpoint;

      if (endpoint === "/trending/all/day") {
        apiEndpoint = `/trending/${mediaType}/day`;
      } else if (endpoint === "/movie/popular") {
        apiEndpoint = mediaType === "movie" ? "/movie/popular" : "/tv/popular";
      } else if (endpoint === "/movie/upcoming") {
        if (mediaType === "movie") {
          apiEndpoint = "/movie/upcoming";
        } else {
          apiEndpoint = "/tv/on_the_air";
        }
      }

      const response = await axios.get(apiEndpoint);
      let filteredMedia = response.data.results;

      // Filter out already released content for upcoming section
      if (endpoint === "/movie/upcoming") {
        const today = new Date();
        filteredMedia = filteredMedia.filter((item) => {
          if (mediaType === "movie") {
            return new Date(item.release_date) > today;
          } else {
            // For TV shows, we want to show currently airing shows
            return true;
          }
        });
      }

      setMedia(filteredMedia);
    } catch (error) {
      console.error("Error fetching media:", error);
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
    } else if (title === "Trending") {
      return mediaType === "movie" ? "Trending Movies" : "Trending TV Shows";
    }
    return title;
  };

  const getViewAllPath = () => {
    if (title === "Popular Movies") {
      return mediaType === "movie" ? "/popular/movies" : "/popular/tv";
    } else if (title === "Upcoming Movies") {
      return mediaType === "movie" ? "/upcoming/movies" : "/on-the-air/tv";
    } else if (title === "Trending") {
      return mediaType === "movie" ? "/trending/movies" : "/trending/tv";
    }
    return `/${title.toLowerCase().replace(/\s+/g, "-")}`;
  };

  const getGenreNames = (genreIds) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2);
  };

  if (!media.length) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">
            {getTitle()}
          </h2>
          <MediaSelector selectedType={mediaType} onTypeChange={setMediaType} />
        </div>
        <Link
          to={getViewAllPath()}
          className="text-[#6556CD] hover:text-[#4f42a3] transition-colors duration-300 flex items-center gap-1.5 text-xs sm:text-sm"
        >
          View All
          <i className="ri-arrow-right-line"></i>
        </Link>
      </div>

      <div className="relative group">
        <div className="flex gap-2.5 sm:gap-3 md:gap-4 overflow-x-auto pb-3 sm:pb-4 custom-scrollbar">
          {media.map((item) => (
            <Link
              key={item.id}
              to={`/${mediaType}/${item.id}`}
              className="flex-none w-[130px] sm:w-[150px] md:w-[170px] bg-zinc-800/50 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300 group/card"
            >
              <div className="relative aspect-[2/3]">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-2.5 space-y-1.5">
                    <h3 className="text-white font-semibold text-xs sm:text-sm line-clamp-2 group-hover/card:text-[#6556CD] transition-colors duration-300">
                      {item.title || item.name}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 bg-[#6556CD]/20 px-1.5 py-0.5 rounded-full">
                        <i className="ri-star-fill text-yellow-400 text-[10px] sm:text-xs"></i>
                        <span className="text-white text-[10px] sm:text-xs">
                          {item.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-300 text-[10px] sm:text-xs">
                        {mediaType === "movie"
                          ? item.release_date?.split("-")[0]
                          : item.first_air_date?.split("-")[0]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {getGenreNames(item.genre_ids).map((genre, index) => (
                        <span
                          key={index}
                          className="text-[9px] sm:text-[10px] bg-[#6556CD]/20 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/card:opacity-100 transition-all duration-300">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#6556CD] rounded-full flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-transform duration-300">
                    <i className="ri-play-fill text-sm sm:text-base text-white"></i>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Gradient Overlays for Scroll Indication */}
        <div className="absolute left-0 top-0 bottom-3 sm:bottom-4 w-3 sm:w-4 md:w-6 bg-gradient-to-r from-[#1F1E24] to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-3 sm:bottom-4 w-3 sm:w-4 md:w-6 bg-gradient-to-l from-[#1F1E24] to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}

export default HorizontalCards;

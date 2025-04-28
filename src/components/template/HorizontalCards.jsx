import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";
import MediaSelector from "./MediaSelector";

function HorizontalCards({ title, endpoint }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mediaType, setMediaType] = useState("movie");

  const fetchMedia = async () => {
    try {
      setLoading(true);
      let apiEndpoint = endpoint;

      // Adjust endpoint based on media type
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
  }, [endpoint, mediaType]);

  const getTitle = () => {
    if (title === "Popular Movies") {
      return mediaType === "movie" ? "Popular Movies" : "Popular TV Shows";
    } else if (title === "Upcoming Movies") {
      return mediaType === "movie" ? "Upcoming Movies" : "On The Air TV Shows";
    }
    return title;
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
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {media.map((item) => (
            <Link
              key={item.id}
              to={`/${mediaType}/${item.id}`}
              className="flex-none w-[200px] h-[300px] rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 relative group"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 p-4">
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
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Gradient Overlays for Scroll Indication */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#1F1E24] to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#1F1E24] to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}

export default HorizontalCards;

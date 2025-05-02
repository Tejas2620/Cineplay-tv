import React, { useState, useEffect } from "react";
import axios from "../utils/axios";
import { useParams, useLocation } from "react-router-dom";
import MediaSelector from "../components/template/MediaSelector";
import HorizontalCards from "../components/template/HorizontalCards";
import Loading from "../components/Loading";

function AllItems() {
  const { category, type } = useParams();
  const location = useLocation();
  const [mediaType, setMediaType] = useState(type || "movie");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const getEndpoint = () => {
    switch (category) {
      case "popular":
        return mediaType === "movie" ? "/movie/popular" : "/tv/popular";
      case "upcoming":
        return mediaType === "movie" ? "/movie/upcoming" : "/tv/on_the_air";
      case "trending":
        return `/trending/${mediaType}/day`;
      default:
        return "";
    }
  };

  const getTitle = () => {
    switch (category) {
      case "popular":
        return mediaType === "movie" ? "Popular Movies" : "Popular TV Shows";
      case "upcoming":
        return mediaType === "movie"
          ? "Upcoming Movies"
          : "On The Air TV Shows";
      case "trending":
        return mediaType === "movie" ? "Trending Movies" : "Trending TV Shows";
      default:
        return "";
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const endpoint = getEndpoint();
      const response = await axios.get(`${endpoint}?page=${page}`);
      setItems((prevItems) => [...prevItems, ...response.data.results]);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setItems([]);
    setPage(1);
    fetchItems();
  }, [category, mediaType]);

  useEffect(() => {
    fetchItems();
  }, [page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="min-h-screen bg-[#1F1E24] p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            {getTitle()}
          </h1>
          <MediaSelector selectedType={mediaType} onTypeChange={setMediaType} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-800/50 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative aspect-[2/3]">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
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
            </div>
          ))}
        </div>

        {!loading && items.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 bg-[#6556CD] text-white rounded-lg hover:bg-[#4f42a3] transition-colors duration-300"
            >
              Load More
            </button>
          </div>
        )}

        {!items.length && (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-400">No items found</p>
          </div>
        )}

        {loading && <Loading />}
      </div>
    </div>
  );
}

export default AllItems;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function Trending() {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Cineplay | Trending";
    const fetchTrending = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/trending/all/day?api_key=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setTrending(data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending data:", error);
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    if (trending.length > 0) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % trending.length);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [trending]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#6556CD] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-[100] flex items-center gap-2 px-4 py-2 bg-[#6556CD]/80 backdrop-blur-md rounded-full text-white hover:bg-[#6556CD] transition-all duration-300 group shadow-lg"
      >
        <i className="ri-arrow-left-line text-xl group-hover:-translate-x-1 transition-transform duration-300"></i>
        <span className="font-medium">Back</span>
      </motion.button>

      {/* Hero Section */}
      <div className="w-full h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[60vh] relative">
        {trending.length > 0 && (
          <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F1E24] via-[#1F1E24]/50 to-transparent z-10"></div>
            <img
              src={`https://image.tmdb.org/t/p/original${trending[currentBanner].backdrop_path}`}
              alt={
                trending[currentBanner].title || trending[currentBanner].name
              }
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-20">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {trending[currentBanner].title || trending[currentBanner].name}
              </h1>
              <p className="text-sm sm:text-base text-gray-300 line-clamp-2">
                {trending[currentBanner].overview}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="w-full px-4 sm:px-6 md:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trending.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/${item.media_type}/${item.id}`)}
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                {/* Poster Image */}
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                    {/* Title */}
                    <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-[#6556CD] transition-colors duration-300">
                      {item.title || item.name}
                    </h3>

                    {/* Rating and Year */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-[#6556CD]/20 px-2 py-1 rounded-full">
                        <i className="ri-star-fill text-yellow-400 text-xs"></i>
                        <span className="text-white text-xs">
                          {item.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-300 text-xs">
                        {item.release_date?.split("-")[0] ||
                          item.first_air_date?.split("-")[0]}
                      </span>
                    </div>

                    {/* Genre Tags */}
                    <div className="flex flex-wrap gap-1">
                      {item.genre_ids?.slice(0, 2).map((genreId) => (
                        <span
                          key={genreId}
                          className="text-[10px] bg-[#6556CD]/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm"
                        >
                          {genreId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Play Button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-12 h-12 bg-[#6556CD] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <i className="ri-play-fill text-xl text-white"></i>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Trending;

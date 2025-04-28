import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";

function Header() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  const fetchMovies = async () => {
    try {
      const randomPage = Math.floor(Math.random() * 500) + 1;
      const response = await axios.get(`/movie/popular`, {
        params: {
          page: randomPage,
        },
      });

      const allMovies = response.data.results;
      // Get 5 random movies
      const randomMovies = allMovies
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)
        .map(async (movie) => {
          const trailerResponse = await axios.get(`/movie/${movie.id}/videos`);
          const trailers = trailerResponse.data.results;
          const officialTrailer = trailers.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );

          return {
            title: movie.title,
            backdrop_path: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
            poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            overview: movie.overview,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            trailerKey: officialTrailer?.key || null,
          };
        });

      const moviesWithTrailers = await Promise.all(randomMovies);
      setMovies(moviesWithTrailers);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + movies.length) % movies.length
    );
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (movies.length > 0) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [movies.length]);

  if (loading) {
    return (
      <div className="w-full h-[50vh] flex justify-center items-center bg-zinc-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-[50vh] relative overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-700"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.95) 100%), url(${movies[currentIndex].backdrop_path})`,
        }}
      />

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="flex gap-8 items-center">
          {/* Movie Poster */}
          <div className="hidden md:block w-48 h-72 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 relative group">
            <img
              src={movies[currentIndex].poster_path}
              alt={movies[currentIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Movie Info */}
          <div className="flex-1 text-white">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {movies[currentIndex].title}
              </h1>

              <div className="flex items-center gap-4">
                <span className="bg-[#6556CD]/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <i className="ri-calendar-line"></i>
                  {movies[currentIndex].release_date?.split("-")[0]}
                </span>
                <div className="flex items-center gap-1 bg-[#6556CD]/80 backdrop-blur-sm px-3 py-1 rounded-full">
                  <i className="ri-star-fill text-yellow-400"></i>
                  <span className="text-sm font-semibold">
                    {movies[currentIndex].vote_average.toFixed(1)}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 text-base md:text-lg line-clamp-2 md:line-clamp-3 leading-relaxed">
                {movies[currentIndex].overview}
              </p>

              {movies[currentIndex].trailerKey && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="bg-[#6556CD] hover:bg-[#4f42a3] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2"
                >
                  <i className="ri-play-fill"></i>
                  Watch Trailer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
      >
        <i className="ri-arrow-left-s-line text-3xl"></i>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
      >
        <i className="ri-arrow-right-s-line text-3xl"></i>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-[#6556CD] w-4" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Trailer Modal */}
      {showTrailer && movies[currentIndex].trailerKey && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors duration-300"
            >
              <i className="ri-close-line text-3xl"></i>
            </button>
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${movies[currentIndex].trailerKey}?autoplay=1`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;

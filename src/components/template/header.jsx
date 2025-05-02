import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";
import Loading from "../Loading";

function Header() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const randomPage = Math.floor(Math.random() * 500) + 1;
      const response = await axios.get(`/movie/popular`, {
        params: {
          page: randomPage,
        },
      });

      const allMovies = response.data.results;
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
            id: movie.id,
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

  useEffect(() => {
    if (movies.length > 0) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [movies.length]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-700"
        style={{
          backgroundImage: `url(${movies[currentIndex].backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/95"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center h-full gap-6 md:gap-12">
          {/* Movie Poster */}
          <div className="w-32 h-48 md:w-48 md:h-72 flex-shrink-0 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <Link to={`/movie/${movies[currentIndex].id}`}>
              <img
                src={movies[currentIndex].poster_path}
                alt={movies[currentIndex].title}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>

          {/* Movie Info */}
          <div className="flex-1 text-center md:text-left max-w-2xl">
            <div className="space-y-4">
              <Link to={`/movie/${movies[currentIndex].id}`}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  {movies[currentIndex].title}
                </h1>
              </Link>

              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="bg-[#6556CD]/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 text-white">
                  <i className="ri-calendar-line"></i>
                  {movies[currentIndex].release_date?.split("-")[0]}
                </span>
                <div className="flex items-center gap-1 bg-[#6556CD]/80 backdrop-blur-sm px-3 py-1 rounded-full">
                  <i className="ri-star-fill text-yellow-400"></i>
                  <span className="text-sm font-semibold text-white">
                    {movies[currentIndex].vote_average.toFixed(1)}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 text-sm md:text-base lg:text-lg line-clamp-3 md:line-clamp-4 leading-relaxed max-w-3xl">
                {movies[currentIndex].overview}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-4">
                <Link
                  to={`/movie/${movies[currentIndex].id}`}
                  className="bg-[#6556CD] hover:bg-[#4f42a3] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2"
                >
                  <i className="ri-information-line"></i>
                  More Info
                </Link>
                {movies[currentIndex].trailerKey && (
                  <a
                    href={`https://www.youtube.com/watch?v=${movies[currentIndex].trailerKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-zinc-800/80 hover:bg-zinc-700/80 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2 backdrop-blur-sm"
                  >
                    <i className="ri-play-fill"></i>
                    Watch Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300 backdrop-blur-sm"
      >
        <i className="ri-arrow-left-s-line text-2xl"></i>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300 backdrop-blur-sm"
      >
        <i className="ri-arrow-right-s-line text-2xl"></i>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-[#6556CD] w-6"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Header;

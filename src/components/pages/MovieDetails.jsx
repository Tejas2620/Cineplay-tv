import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import Loading from "../template/Loading";
import {
  RiArrowLeftLine,
  RiStarFill,
  RiPlayFill,
  RiAddLine,
  RiShareLine,
  RiTimeLine,
  RiCalendarLine,
  RiMovieLine,
  RiUserLine,
  RiHeartLine,
  RiBookmarkLine,
} from "react-icons/ri";

function MovieDetails() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchDetails = async () => {
    try {
      const [detailsRes, castRes, similarRes, videosRes] = await Promise.all([
        axios.get(`/${type}/${id}`),
        axios.get(`/${type}/${id}/credits`),
        axios.get(`/${type}/${id}/similar`),
        axios.get(`/${type}/${id}/videos`),
      ]);

      setDetails(detailsRes.data);
      setCast(castRes.data.cast.slice(0, 6));
      setSimilar(similarRes.data.results.slice(0, 6));

      const officialTrailer = videosRes.data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      setTrailer(officialTrailer);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id, type]);

  if (!details) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-[#1F1E24] text-white overflow-x-hidden">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
      >
        <RiArrowLeftLine className="text-2xl" />
      </button>

      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%), url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1E24] to-transparent" />

        <div className="relative h-full w-full max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div className="flex gap-8 w-full">
            <div className="hidden md:block w-64 h-96 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                alt={details.title || details.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 truncate">
                {details.title || details.name}
              </h1>
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <span className="text-yellow-400">
                  <RiStarFill />
                </span>
                <span>{details.vote_average.toFixed(1)}</span>
                <span>•</span>
                <span>
                  {type === "movie"
                    ? details.release_date?.split("-")[0]
                    : details.first_air_date?.split("-")[0]}
                </span>
                <span>•</span>
                <span>
                  {details.runtime || details.episode_run_time?.[0]} min
                </span>
              </div>
              <p className="text-gray-300 text-lg mb-6">{details.overview}</p>
              <div className="flex gap-4 flex-wrap">
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="bg-[#6556CD] hover:bg-[#4f42a3] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2"
                  >
                    <RiPlayFill />
                    Watch Trailer
                  </button>
                )}
                <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2">
                  <RiAddLine />
                  Add to List
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2">
                  <RiShareLine />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-zinc-800 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 px-4 font-semibold transition-colors duration-300 whitespace-nowrap ${
              activeTab === "overview"
                ? "text-[#6556CD] border-b-2 border-[#6556CD]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("cast")}
            className={`pb-4 px-4 font-semibold transition-colors duration-300 whitespace-nowrap ${
              activeTab === "cast"
                ? "text-[#6556CD] border-b-2 border-[#6556CD]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Cast
          </button>
          <button
            onClick={() => setActiveTab("similar")}
            className={`pb-4 px-4 font-semibold transition-colors duration-300 whitespace-nowrap ${
              activeTab === "similar"
                ? "text-[#6556CD] border-b-2 border-[#6556CD]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Similar
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-300 text-lg mb-6">{details.overview}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <RiCalendarLine className="text-[#6556CD]" />
                    <span className="font-semibold">Release Date</span>
                  </div>
                  <p className="text-gray-300">
                    {type === "movie"
                      ? details.release_date
                      : details.first_air_date}
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <RiTimeLine className="text-[#6556CD]" />
                    <span className="font-semibold">Runtime</span>
                  </div>
                  <p className="text-gray-300">
                    {details.runtime || details.episode_run_time?.[0]} minutes
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <RiStarFill className="text-[#6556CD]" />
                    <span className="font-semibold">Rating</span>
                  </div>
                  <p className="text-gray-300">
                    {details.vote_average.toFixed(1)}
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <RiMovieLine className="text-[#6556CD]" />
                    <span className="font-semibold">Genre</span>
                  </div>
                  <p className="text-gray-300">
                    {details.genres?.map((genre) => genre.name).join(", ")}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-zinc-800/50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-[#6556CD] hover:bg-[#4f42a3] text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2">
                  <RiHeartLine />
                  Add to Favorites
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2">
                  <RiBookmarkLine />
                  Add to Watchlist
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2">
                  <RiShareLine />
                  Share
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "cast" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {cast.map((person) => (
                <div
                  key={person.id}
                  className="bg-zinc-800 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                    alt={person.name}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold truncate">{person.name}</h3>
                    <p className="text-sm text-gray-400 truncate">
                      {person.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "similar" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Similar {type === "movie" ? "Movies" : "TV Shows"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {similar.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-800 rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
                  onClick={() => navigate(`/${type}/${item.id}`)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold line-clamp-2">
                      {item.title || item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-yellow-400">
                        <RiStarFill className="text-sm" />
                      </span>
                      <span className="text-sm">
                        {item.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
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
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
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

export default MovieDetails;

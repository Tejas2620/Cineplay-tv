import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import MovieDetails from "./components/pages/MovieDetails";
import AllItems from "./components/pages/AllItems";
import Loading from "./components/template/Loading";
import Trending from "./components/pages/Trending";
import { useState, useEffect } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#1F1E24] text-white overflow-x-hidden">
      {isLoading && <Loading />}
      <div
        className={
          isLoading
            ? "opacity-0"
            : "opacity-100 transition-opacity duration-300"
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:type/:id" element={<MovieDetails />} />
          <Route path="/popular/movies" element={<AllItems />} />
          <Route path="/popular/tv" element={<AllItems />} />
          <Route path="/upcoming/movies" element={<AllItems />} />
          <Route path="/on-the-air/tv" element={<AllItems />} />
          <Route path="/trending" element={<Trending />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

// │   - Local:    http://localhost:3000    │
// │   - Network:  http://10.14.0.2:3000

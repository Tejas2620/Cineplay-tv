import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import MovieDetails from "./components/MovieDetails";

function App() {
  return (
    <div className="w-screen min-h-screen bg-[#1F1E24] text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:type/:id" element={<MovieDetails />} />
      </Routes>
    </div>
  );
}

export default App;

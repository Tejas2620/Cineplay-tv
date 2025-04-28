import React from "react";

function MediaSelector({ selectedType, onTypeChange }) {
  return (
    <div className="relative">
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="appearance-none bg-[#6556CD]/20 text-white px-4 py-2 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[#6556CD] cursor-pointer"
      >
        <option value="movie">Movies</option>
        <option value="tv">TV Shows</option>
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <i className="ri-arrow-down-s-line text-white"></i>
      </div>
    </div>
  );
}

export default MediaSelector;

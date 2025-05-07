import React from "react";
import loader from "../../../public/loader.webm";
// D:\PROGRAMMING\Sheriyan School\Cineplay\public\loader.webm

function Loading() {
  return (
    <div className="fixed inset-0 bg-[#1F1E24]/95 backdrop-blur-sm flex flex-col justify-center items-center z-50">
      <div className="relative">
        {/* Glowing effect */}
        <div className="absolute -inset-4 bg-[#6556CD]/20 rounded-full blur-xl animate-pulse"></div>

        {/* Main loader */}
        <video autoPlay loop muted className="w-32 h-32 relative z-10">
          <source src={loader} type="video/webm" />
        </video>
      </div>

      {/* Loading text with animation */}
      <p className="mt-4 text-[#6556CD] font-semibold text-lg animate-pulse">
        Loading...
      </p>
    </div>
  );
}

export default Loading;

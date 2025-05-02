import React, { useState } from "react";
import Sidenav from "./template/sidenav";
import Topnav from "./template/topnav";
import Header from "./template/header";
import HorizontalCards from "./template/HorizontalCards";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  document.title = "Cineplay App | Home";

  return (
    <div className="flex min-h-screen w-full bg-[#1F1E24]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-2.5 left-2.5 z-50 lg:hidden p-1.5 rounded-lg bg-[#6556CD] hover:bg-[#4f42a3] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
        aria-label="Toggle Menu"
      >
        <i
          className={`ri-${
            isSidebarOpen ? "close" : "menu"
          }-line text-lg text-white transition-transform duration-300 ${
            isSidebarOpen ? "rotate-180" : ""
          }`}
        ></i>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-[280px] lg:w-[20%] z-50 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidenav />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-h-screen w-full lg:w-[80%] lg:ml-[20%]">
        {/* Top Navigation */}
        <div className="fixed top-0 right-0 left-0 lg:left-[20%] h-[52px] border-b border-zinc-800/50 backdrop-blur-md z-30">
          <div className="w-full h-full flex items-center">
            <div className="w-10 lg:hidden"></div>{" "}
            {/* Spacer for mobile menu button */}
            <div className="flex-1">
              <Topnav />
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="mt-[52px] overflow-x-hidden overflow-y-auto custom-scrollbar">
          {/* Hero Section */}
          <div className="w-full h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[60vh]">
            <Header />
          </div>

          {/* Content Sections */}
          <div className="w-full px-2.5 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-5 space-y-4 sm:space-y-6">
            <div className="w-full backdrop-blur-xl bg-zinc-900/50 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 md:p-5 shadow-xl">
              <HorizontalCards
                title="Trending"
                endpoint="/trending/all/day"
                className="mb-4 sm:mb-6"
              />
              <HorizontalCards
                title="Popular Movies"
                endpoint="/movie/popular"
                className="mb-4 sm:mb-6"
              />
              <HorizontalCards
                title="Upcoming Movies"
                endpoint="/movie/upcoming"
                className="mb-4 sm:mb-6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

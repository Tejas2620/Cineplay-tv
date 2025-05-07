import React, { useState } from "react";
import Sidenav from "../template/sidenav";
import Topnav from "../template/topnav";
import Header from "../template/header";
import HorizontalCards from "../template/HorizontalCards";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  document.title = "Cineplay App | Home";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden lg:block w-[15%] fixed left-0 top-0 h-screen bg-[#1F1E24] border-r border-zinc-800/50">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <Sidenav />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen w-full lg:w-[85%] lg:ml-[15%]">
        {/* Top Navigation */}
        <div className="fixed top-0 right-0 left-0 lg:left-[15%] h-[52px] border-b border-zinc-800/50 backdrop-blur-md z-30">
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

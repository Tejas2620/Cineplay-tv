import React from "react";
import Sidenav from "./template/sidenav";
import Topnav from "./template/topnav";
import Header from "./template/header";
import HorizontalCards from "./template/HorizontalCards";

function Home() {
  document.title = "Cineplay App | Home";
  return (
    <div className="flex w-full h-screen bg-[#1F1E24]">
      {/* Sidebar */}
      <div className="w-[20%] h-full border-r border-zinc-800">
        <Sidenav />
      </div>

      {/* Main Content */}
      <div className="w-[80%] h-full flex flex-col">
        {/* Top Navigation */}
        <div className="h-[10vh] border-b border-zinc-800">
          <Topnav />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Hero Section */}
          <div className="h-[50vh]">
            <Header />
          </div>

          {/* Content Sections */}
          <div className="space-y-8 py-8">
            <HorizontalCards title="Trending" endpoint="/trending/all/day" />
            <HorizontalCards title="Popular Movies" endpoint="/movie/popular" />
            <HorizontalCards
              title="Upcoming Movies"
              endpoint="/movie/upcoming"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

import React from "react";
import Sidenav from "./template/sidenav";
import Topnav from "./template/topnav";
import Header from "./template/header";
import HorizontalCards from "./template/HorizontalCards";

function Home() {
  document.title = "Cineplay App | Home";
  return (
    <>
      <Sidenav />
      <div className="w-[80%] h-full">
        <Topnav />
        <div className="h-[90vh] overflow-y-auto">
          <Header />
          <HorizontalCards title="Trending" endpoint="/trending/all/day" />
          <HorizontalCards title="Popular Movies" endpoint="/movie/popular" />
          <HorizontalCards title="Upcoming Movies" endpoint="/movie/upcoming" />
        </div>
      </div>
    </>
  );
}

export default Home;

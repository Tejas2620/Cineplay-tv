import React from "react";
import Sidenav from "./template/sidenav";
import Topnav from "./template/topnav";
function Home() {
  document.title = "Cineplay App | Home";
  return (
    <>
      <Sidenav />
      <div className="w-[80%] h-full">
        <Topnav />
      </div>
    </>
  );
}

export default Home;

import React from "react";
import Sidenav from "./template/sidenav";
function Home() {
  document.title = "Cineplay App | Home";
  return (
    <>
      <Sidenav />
      <div className="w-[80%] h-full"></div>
    </>
  );
}

export default Home;

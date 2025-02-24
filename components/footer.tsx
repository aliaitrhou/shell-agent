"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="w-full mt-3 text-center text-gray-400 font-light text-xs sm:text-sm font-mono mx-auto">
      <p className="">
        © {new Date().getFullYear()} By{" "}
        <span className="text-orange-400 font-bold text-xs">
          <a href="https://aliaitrahou.me">Ali</a>
        </span>
        , All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

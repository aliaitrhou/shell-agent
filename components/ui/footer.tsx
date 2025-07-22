"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="w-full text-center text-zinc-500 mx-auto">
      <p className="font-light text-xs sm:text-sm md:text-md font-mplus">
        © {new Date().getFullYear()} By{" "}
        <a href="https://aliaitrahou.me" target="_blank">
          <span className="text-orange-500 font-semibold">Ali</span>
        </a>
        , All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

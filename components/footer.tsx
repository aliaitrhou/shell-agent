"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="w-full text-center text-zinc-500 mx-auto">
      <p className="font-light text-xs sm:text-sm md:text-md font-kanit">
        © {new Date().getFullYear()} By{" "}
        <span className="text-orange-400/80 font-semibold">
          <a href="https://aliaitrahou.me" target="_blank">
            Ali
          </a>
        </span>
        , All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

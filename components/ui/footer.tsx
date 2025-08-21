"use client";

import { lexend } from "@/app/fonts";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`w-full font-light text-zinc-500 ${lexend.className}`}>
      <div className="w-1/2 px-20 mx-auto flex flex-row items-center justify-evenly">
        <p className="">© {currentYear} All rights reserved.</p>
        <Link
          href={"/user-guide"}
          className="hover:underline hover:underline-offset-2"
        >
          User Guide
        </Link>
        <Link
          href="https://aliaitrahou.me"
          target="_blank"
          className="hover:underline hover:underline-offset-2"
        >
          <span>Made by Ali</span>
        </Link>

        <Link
          href={"https://www.aliaitrahou.me/contact"}
          target="_blank"
          className="hover:underline hover:underline-offset-2"
        >
          <span>Request a feature</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

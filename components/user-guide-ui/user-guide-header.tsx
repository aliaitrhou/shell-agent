"use client";

import React, { useEffect, useState } from "react";
import { useUserGuideStore } from "@/stores/user-guide-store";
import { lexend } from "@/app/fonts";
import { Logo } from "../ui/logo";

const UserGuidePageHeader = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const { title } = useUserGuideStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 10);
    };

    handleScroll(); // Run initially in case page is already scrolled
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky z-10 top-4 flex items-center gap-2 sm:gap-4 md:gap-6 ml-6 sm:ml-10 md:ml-24">
      <div
        className={`${isScrolling ? "border-[1px] bg-neutral-800/90 backdrop-blur-sm border-neutral-700/60 rounded-full" : ""} px-2 py-1 lg:px-3 flex items-center gap-2 sm:gap-4 md:gap-6`}
      >
        <Logo />
        <h2 className={`${lexend.className} text-lg sm:text-xl md:text-2xl`}>
          {title}
        </h2>
      </div>
    </div>
  );
};

export default UserGuidePageHeader;

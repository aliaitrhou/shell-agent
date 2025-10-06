"use client";

import React, { useEffect, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useUser } from "@clerk/nextjs";
import { lexend, montserrat } from "@/app/fonts";
import { Logo } from "./logo";

const Header = () => {
  const [isClient, setIsClient] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    setIsClient(true);
  }, []);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  return (
    <header className="sticky top-0 z-40 sm:z-0 sm:static bg-transparent w-full flex flex-row justify-between items-center p-2 sm:px-2 md:px-4 lg:px-5 lg:pt-5">
      <Logo />

      <div className="space-x-2">
        {isClient && (
          <>
            <div className="flex flex-row items-center ">
              {user && (
                <p className={` pr-2 text-white ${montserrat.className} text-xs sm:text-sm sm:text-md`}>
                  {getGreeting()} {user?.firstName}
                </p>
              )}
              <SignedIn>
                <UserButton
                  appearance={{
                    baseTheme: dark,
                    elements: {
                      userButtonAvatarBox:
                        "w-8 h-8 sm:w-9 sm:h-9 shadow-xl border-2 border-white rounded-full",
                    },
                  }}
                />
              </SignedIn>
            </div>
            <SignedOut>
              <div
                className={`flex flex-row gap-1 sm:gap-2 ${lexend.className}`}
              >
                <SignInButton mode="modal">
                  <button className="text-yellow-400 text-sm sm:text-md font-extralight border border-yellow-400  hover:bg-yellow-300/20 py-0 px-2 sm:px-2 md:py-1 md:px-3 rounded-md transition duration-300 ease-in-out">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-zinc-100 hover:bg-zinc-300 border border-zinc-100 text-black font-extralight py-0 px-2 sm:px-2 md:py-1 md:px-3 rounded-md text-sm sm:text-md transition duration-300 ease-in-out">
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

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
import Link from "next/link";
import { TbBrandPowershell } from "react-icons/tb";
import { useUser } from "@clerk/nextjs";

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
    <nav className="mx-auto flex flex-row justify-between items-center px-2 py-2 sm:px-2 md:px-4 lg:px-6 sm:py-3">
      <Link href="/">
        <div className="flex flex-row items-center gap-1">
          <TbBrandPowershell className="font-bold text-orange-600  w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
          <p className="text-xl sm:text-2xl lg:text-3xl italic font-kanit font-bold bg-gradient-to-r from-orange-600  to-yellow-500 bg-clip-text text-transparent">
            ShellAgent
          </p>
        </div>
      </Link>
      <div className="space-x-2">
        {isClient && (
          <>
            <div className="flex items-center gap-2 md:gap-4">
              {user && (
                <p className="text-zinc-400 font-kanit text-xs sm:text-sm sm:text-md">
                  {getGreeting()} {user?.firstName}
                </p>
              )}
              <SignedIn>
                <UserButton
                  appearance={{
                    baseTheme: dark,
                    elements: {
                      userButtonAvatarBox:
                        "w-8 h-8 sm:w-10 sm:h-10 border-[2px] border-zinc-400",
                    },
                  }}
                />
              </SignedIn>
            </div>
            <SignedOut>
              <div className="flex flex-row gap-1 sm:gap-2 font-mono">
                <SignInButton mode="modal">
                  <button className="text-orange-500 font-bold text-xs sm:text-sm border border-orange-500 hover:text-orange-300 hover:bg-[#ff7a064a] py-1 px-3 sm:py-2 sm:px-4 rounded-md transition duration-300 ease-in-out">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-zinc-300 hover:bg-zinc-300/90 border border-zinc-100 text-black text-xs sm:text-sm font-bold py-1 px-3 sm:py-2 sm:px-4 rounded-md transition duration-300 ease-in-out">
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;

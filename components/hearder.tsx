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

const Header = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <nav className="w-full flex flex-row justify-between items-center px-4 py-2 sm:px-6 sm:py-3 xl:mb-6">
      <Link href="/">
        <div className="flex flex-row items-center gap-1">
          <TbBrandPowershell className="font-bold text-orange-600 w-9 h-9 sm:w-10 sm:h-10" />
          <p className="text-xl sm:text-2xl italic font-spaceMono font-bold bg-gradient-to-r from-orange-600  to-yellow-500 bg-clip-text text-transparent">
            AceOS
          </p>
        </div>
      </Link>
      <div className="space-x-2">
        {isClient && (
          <>
            <SignedIn>
              <UserButton
                appearance={{
                  baseTheme: dark,
                  elements: {
                    userButtonAvatarBox:
                      "w-8 h-8 sm:w-10 sm:h-10 border-[2px] border-orange-500",
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-orange-500 font-bold text-sm font-mono border border-orange-500 hover:text-orange-300 hover:bg-[#ff7a064a] py-2 px-4 rounded-full transition duration-300 ease-in-out">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-white text-black font-spaceMono text-sm font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;

"us client";
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
import { useUser } from "@clerk/nextjs";
import { MdLocalFireDepartment } from "react-icons/md";
import { mplus } from "@/app/fonts";

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
    <nav className="w-full flex flex-row justify-between items-center p-2 sm:px-2 md:px-4 lg:px-6 sm:py-3">
      <Link href="/">
        <div className="flex flex-row items-center gap-1">
          <MdLocalFireDepartment className="font-bold text-orange-600  size-9 sm:size-10 lg:size-10" />

          <p
            className={`${mplus.className} text-xl sm:text-2xl lg:text-3xl italic font-bold text-orange-600`}
          >
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
              <div className="flex flex-row gap-1 sm:gap-2 font-kanit">
                <SignInButton mode="modal">
                  <button className="text-orange-600 text-xs sm:text-sm border border-orange-600  hover:bg-orange-400/20 py-1 px-3 sm:py-2 sm:px-4 rounded-full transition duration-300 ease-in-out">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-zinc-300 hover:bg-zinc-300/80 border border-zinc-100 text-black text-xs sm:text-sm py-1 px-3 sm:py-2 sm:px-4 rounded-full transition duration-300 ease-in-out">
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

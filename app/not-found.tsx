"use client";

import Link from "next/link";
import { montserrat } from "./fonts";

export default function NotFound() {
  return (
    <div className={`${montserrat.className} w-full h-[70dvh] flex flex-col items-center justify-center text-lg  md:text-xl text-zinc-300 gap-3 md:gap-4`}>
      <div className="text-center">
        <h1 className="text-2xl mb-4">404 - Page Not Found</h1>
        <Link href="/" className="text-sm md:text-lg text-bold text-black bg-zinc-300 border border-white px-2 py-0 rounded-lg">
          Go Home
        </Link>
      </div>
    </div>
  );
}

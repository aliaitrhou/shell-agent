import React from "react";
import Link from "next/link";
import { MdLocalFireDepartment } from "react-icons/md";
import { lexend } from "@/app/fonts";

export const Logo = () => {
  return (
    <Link href="/">
      <div className="flex flex-row items-center gap-0">
        <MdLocalFireDepartment className="font-bold text-yellow-400 size-9 sm:size-10 lg:size-10" />
        <div className="w-[1px] h-8 bg-gray-400/60 mr-2" />
        <div className={`${lexend.className} flex flex-col -space-y-1`}>
          <span className="text-[10px] text-gray-400">Shell</span>
          <span className="">Agent</span>
        </div>
      </div>
    </Link>
  );
};

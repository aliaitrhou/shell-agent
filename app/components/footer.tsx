import React from "react";
import GithubLogo from "@/public/github.svg";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="absolute bottom-0 w-full text-center text-gray-400 font-light text-sm font-mono pb-8 mx-auto">
      <div className="w-full flex items-center justify-center gap-2">
        <p>
          © 2024 By{" "}
          <span className="text-orange-400 font-bold text-md">
            <a href="https://x.com/AliRhou17481">Ali</a>
          </span>
          , source code
        </p>
        <Link href={"https://github.com/aliaitrhou/AceOS"}>
          <div className="hidden bg-gray-400 sm:flex items-center gap-1 rounded-lg w-fit p-[1px]">
            <p className="font-bold text-xs text-black">Github</p>
            <Image src={GithubLogo} alt="github" className="w-3 h-3" />
          </div>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

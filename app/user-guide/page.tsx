import React from "react";
import UserGuideContainer from "@/components/user-guide-ui/user-guide-container";
import UserGuideMarkdownView from "@/components/user-guide-ui/user-guide-markdown-view";
import UserGuideOutlineView from "@/components/user-guide-ui/user-guide-outline-view";
import Link from 'next/link'
import { lexend, mplus } from "../fonts";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoChevronBackOutline } from "react-icons/io5";
// TODO: <delete this later> import UserGuidePageHeader from "@/components/user-guide-ui/user-guide-header";

const UserGuide = () => {
  return (
    <UserGuideContainer>
      <div className="flex flex-row gap-0 sm:gap-2 md:gap-4 lg:gap-6">
        <div className="flex-grow min-w-0">
          <Link href="/" className={`ml-8 flex flex-row items-center w-fit gap-1 ${lexend.className} font-thin hover:underline text-zinc-400`}>
            <IoChevronBackOutline className="size-4" />
            <span>
              Go Back
            </span>
          </Link>
          <UserGuideMarkdownView />
        </div>
        <div className="hidden md:block grow-0 shrink-0 basis-0 md:basis-[200] lg:basis-[300]">
          <div className="sticky top-14 max-h-[calc(100vh - 70px)]">
            <UserGuideOutlineView />
          </div>
        </div>
      </div>
    </UserGuideContainer>
  );
};

export default UserGuide;

import React from "react";
import UserGuideContainer from "@/components/user-guide-ui/user-guide-container";
import UserGuideMarkdownView from "@/components/user-guide-ui/user-guide-markdown-view";
import UserGuideOutlineView from "@/components/user-guide-ui/user-guide-outline-view";
import UserGuidePageHeader from "@/components/user-guide-ui/user-guide-header";

const UserGuide = () => {
  return (
    <UserGuideContainer>
      <UserGuidePageHeader />
      <div className="flex flex-row gap-0 sm:gap-2 md:gap-4 lg:gap-6">
        <div className="flex-grow min-w-0 ">
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

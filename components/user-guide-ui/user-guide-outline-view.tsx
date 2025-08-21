"use client";

import React from "react";
import { useTocStore } from "@/stores/table-of-content-store";
import { OutlineViewItem } from "./outline-view-item";
import { lexend, mplus } from "@/app/fonts";
import { OutlineActiveSectionHighlight } from "./active-section-highlight";

const UserGuideOutlineView = () => {
  const sections = useTocStore((state) => state.sections);

  const minimumLevel = (sections || []).reduce(
    (p, c) => Math.min(p, c.level),
    6,
  );
  return (
    <div className="">
      <h2 className={`${lexend.className} text-lg mb-2`}>Page Navigator</h2>
      <div className="relative overflow-hidden">
        <span className="absolute top-0 bottom-0 left-3 w-[1px] bg-neutral-700" />
        <OutlineActiveSectionHighlight sections={sections} />
        <ul className={`m-0 pl-6 ${mplus.className}`}>
          {sections &&
            sections.map((heading) => {
              console.log("outline view - isVisible: ", heading.isVisible);
              return (
                <OutlineViewItem
                  key={heading.id}
                  id={heading.id}
                  level={heading.level - minimumLevel}
                  value={heading.value}
                  active={heading.isVisible}
                />
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default UserGuideOutlineView;

"use client";

import React from "react";
import { useTocStore } from "@/stores/table-of-content-store";
import { OutlineViewItem } from "./outline-view-item";
import { montserrat } from "@/app/fonts";
import { OutlineActiveSectionHighlight } from "./active-section-highlight";
import { FaCircle } from "react-icons/fa6";
import { CgMenuLeftAlt } from "react-icons/cg";

const UserGuideOutlineView = () => {
  const sections = useTocStore((state) => state.sections);

  const minimumLevel = (sections || []).reduce(
    (p, c) => Math.min(p, c.level),
    6,
  );

  const firstHeading = sections[0]
  const lastHeading = sections[sections.length - 1]
  return (
    <div className="">
      <h2 className={`${montserrat.className} text-lg font-[700] lg:font-[900] mb-2 text-neutral-200 flex flex-row items-center gap-2`}>
        <CgMenuLeftAlt className="size-5" />
        <span>
          Page Navigator
        </span>
      </h2>
      <div className="relative ml-2">
        <FaCircle className={`absolute z-30 left-2 top-0 size-2 ${firstHeading?.isVisible ? "text-cyan-400" : "text-neutral-700"} `} />
        <span className="absolute top-0 bottom-0 left-3 w-[1px] bg-neutral-700" />
        <FaCircle className={`absolute z-30 left-2 bottom-0 size-2 ${lastHeading?.isVisible ? "text-cyan-400" : "text-neutral-700"}`} />

        <OutlineActiveSectionHighlight sections={sections} />
        <ul className={`m-0 pl-7 ${montserrat.className} font-light text-sm`}>
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

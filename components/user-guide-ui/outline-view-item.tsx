"use client";

import React, { RefObject, useEffect, useRef } from "react";
import Link from "next/link";
import { TOCHeading } from "@/utils/mdast-extract-headings";
import { useTocStore } from "@/stores/table-of-content-store";

type Props = TOCHeading & {
  active: boolean;
};

export const OutlineViewItem = ({ id, level, value, active, index }: Props) => {
  console.log(`Id is : ${id} and Level ${level}, is Active: ${active}`);
  const refItem = useRef<HTMLLIElement>(null);
  const registerOutlineItem = useTocStore((state) => state.registerOutlienItem);

  useEffect(() => {
    if (id) registerOutlineItem(id, refItem as RefObject<HTMLLIElement>);
  }, [id, registerOutlineItem]);


  return (
    <li ref={refItem} className="py-1">
      <span
        style={{
          marginLeft: `${level * 20}px`,
        }}
      >
        <Link
          href={`#${id}`}
          style={{
            color: active ? "white" : "gray",
            transition: "color 0.2s ease-in-out",
          }}
        >
          {value}
        </Link>
      </span>
    </li>
  );
};

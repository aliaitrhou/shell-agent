"use client";

import React, { useState } from "react";
import { IoTriangleSharp } from "react-icons/io5";

interface ButtonHoverProps {
  children: React.ReactNode;
  desc: string;
}

const ButtonHoverEffect: React.FC<ButtonHoverProps> = ({ children, desc }) => {
  const [isMouseOver, setMouseOver] = useState(false);

  return (
    <div
      className="relative"
      onMouseOver={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      {/* {isMouseOver && ( */}
      {/*   <> */}
      {/*     <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 px-3 py-1 w-fit rounded-md text-xs whitespace-nowrap bg-zinc-800 border border-zinc-700/40 z-30  text-zinc-400"> */}
      {/*       {desc} */}
      {/*     </div> */}
      {/*     <IoTriangleSharp */}
      {/*       className={`absolute z-40 rotate-180 text-zinc-700 h-5 w-5 mb-4`} */}
      {/*     /> */}
      {/*   </> */}
      {/* )} */}
      {isMouseOver && (
        <>
          <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 w-fit rounded-md text-xs whitespace-nowrap bg-zinc-800 border-[1px] border-zinc-700 z-40  text-zinc-400 font-kanit font-light">
            {desc}
          </p>
          <IoTriangleSharp
            className={`absolute bottom-full right-1/2 left-1/2 -translate-x-1/2 rotate-180 text-zinc-700 h-5 w-5 mb-[1px]`}
          />
        </>
      )}
      {children}
    </div>
  );
};

export default ButtonHoverEffect;

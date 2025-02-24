"use client";

import React, { useState } from "react";

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
      {isMouseOver && (
        <>
          <div className="absolute -top-8  px-3 py-1 w-fit rounded-md text-xs whitespace-nowrap bg-zinc-800/90 border border-zinc-700 z-40  text-zinc-400">
            {desc}
          </div>
        </>
      )}
      {children}
    </div>
  );
};

export default ButtonHoverEffect;

"use client";

import React from "react";
interface Props {
  children: React.ReactNode;
  className: string;
}

const SidebarWrapper: React.FC<Props> = ({ children, className }) => {
  return (
    <section className={className}>
      <div className={`relative w-full h-full whitespace-nowrap`}>
        {children}
      </div>
    </section>
  );
};

export default SidebarWrapper;

import React from "react";

interface Props {
  children: React.ReactNode;
}

const UserGuideContainer = ({ children }: Props) => {
  return (
    <div className="max-w-full min-h-screen bg-neutral-900">
      <main
        className={`max-w-full w-auto sm:w-auto md:w-[723px] lg:w-[933px] xl:w-[1127px] mx-0 sm:mx-[1em] md:mx-auto py-4`}
      >
        {children}
      </main>
    </div>
  );
};

export default UserGuideContainer;

import React from "react";
import { IoTriangleSharp } from "react-icons/io5";

interface shellPromptProps {
  type: "left-side" | "cwd";
  content?: string;
  children?: React.ReactNode;
}

const ShellPromptUi: React.FC<shellPromptProps> = ({
  type,
  content,
  children,
}) => {
  return (
    <div
      className={`relative flex flex-row justify-start items-center self-start shrink-0 text-white px-2 ${type != "cwd" ? "rounded-s-full bg-blue-400/80 ml-1" : "bg-orange-400/80 pl-4"}  rounded-e-sm`}
    >
      {children ? (
        <>{children}</>
      ) : (
        <span
          className={`text-xs font-thin font-mono ${type == "left-side" && content ? "text-blue-300" : "w-fit"}`}
        >
          {content}
        </span>
      )}
      <IoTriangleSharp
        className={`absolute -right-4 z-30 rotate-90 ${type != "cwd" ? "text-blue-400/80" : "text-orange-400/80"}  h-4 w-5`}
      />
    </div>
  );
};

export default ShellPromptUi;

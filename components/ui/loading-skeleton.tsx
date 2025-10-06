import { Mode } from "@/types";
import React from "react";
import { IoTriangleSharp } from "react-icons/io5";
import { BsArrow90DegDown, BsArrow90DegRight } from "react-icons/bs";

interface shellPromptProps {
  type: "left-side" | "cwd";
  content?: string;
  children?: React.ReactNode;
}

export const ShellPromptUi: React.FC<shellPromptProps> = ({
  type,
  content,
  children,
}) => {
  return (
    <div
      className={`relative flex flex-row justify-start items-center self-start shrink-0 text-transparent text-xs px-2 ${type != "cwd" ? "rounded-s-full bg-zinc-700 z-20" : "bg-zinc-600 pl-4"}  rounded-e-sm`}
    >
      {children ? (
        <>{children}</>
      ) : (
        <span
          className={`text-xs font-thin font-mono ${type == "left-side" && content ? "text-zinc-700 z-30" : "w-fit"}`}
        >
          {content}
        </span>
      )}
      <IoTriangleSharp
        className={`absolute -right-4 z-20 rotate-90 ${type != "cwd" ? "text-zinc-700" : "text-zinc-600"}  h-4 w-5`}
      />
    </div>
  );
};

const TerminalPrompt = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-center gap-1">
      <div className="flex flex-row items-center justify-between">
        <div className="animate-pulse relative flex flex-row items-center gap-0">
          <ShellPromptUi type="left-side">test</ShellPromptUi>
          <ShellPromptUi type="cwd" content={"tst"} />
          <BsArrow90DegRight className="absolute -left-2 -bottom-[6px] size-5 text-zinc-600" />
          <BsArrow90DegDown className="absolute -left-2 -bottom-[19px] size-5 text-zinc-600 rotate-[271deg]" />
        </div>

        <div className="animate-pulse relative flex flex-row justify-start items-center self-start shrink-0 text-zinc-700 px-2 rounded-s-full rounded-e-full bg-zinc-700 mr-1 font-spaceMono text-xs">
          <IoTriangleSharp className="absolute -left-[11px] z-20 rotate-[269deg] text-zinc-700 h-4 w-5" />
          <div>loading</div>
        </div>
      </div>
      <div className="px-4 space-y-4">{children}</div>
    </div>
  );
};

const LoadingSkeleton = () => {
  const randomNum = Math.floor(Math.random() * 3) + 2;
  return (
    <>
      {Array.from({ length: randomNum }).map((_, index) => (
        <TerminalPrompt key={index}>
          <div className="rounded-sm w-[80%] h-4 animate-pulse bg-zinc-700" />
          <div className="-ml-4 w-[60%] rounded-sm  h-4 animate-pulse bg-zinc-700" />
          <div className="-ml-4 w-[70%] rounded-sm h-4 animate-pulse bg-zinc-700" />
          <div className="-ml-4 w-[50%] rounded-sm h-4 animate-pulse bg-zinc-700" />
        </TerminalPrompt>
      ))}
    </>
  );
};

export default LoadingSkeleton;

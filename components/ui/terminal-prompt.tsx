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
      className={`relative flex flex-row justify-start items-center self-start shrink-0 text-white px-2 ${type != "cwd" ? "rounded-s-full bg-blue-400 z-20" : "bg-orange-400/80 pl-4"}  rounded-e-sm`}
    >
      {children ? (
        <>{children}</>
      ) : (
        <span
          className={`text-xs font-thin font-mono ${type == "left-side" && content ? "text-blue-200 z-30" : "w-fit"}`}
        >
          {content}
        </span>
      )}
      <IoTriangleSharp
        className={`absolute -right-4 z-20 rotate-90 ${type != "cwd" ? "text-blue-400/80" : "text-orange-400/80"}  h-4 w-5`}
      />
    </div>
  );
};

interface TerminalPromptProps {
  mode: Mode;
  children?: React.ReactNode;
  handleToggleModes?: () => void;
  handleOpenPage?: (n: number) => void;
  pageNumber?: number;
  pwd: string;
}

const TerminalPrompt: React.FC<TerminalPromptProps> = ({
  mode,
  children,
  handleToggleModes,
  handleOpenPage,
  pageNumber,
  pwd,
}) => {
  console.log("termianl prompt mounts");

  return (
    <div className="flex flex-col justify-center gap-1">
      <div className="flex flex-row items-center justify-between">
        <div className="relative flex flex-row items-center gap-0">
          <ShellPromptUi type="left-side">
            {handleToggleModes ? (
              <button
                onClick={handleToggleModes}
                className="text-xs font-bold font-spaceMono text-blue-50 focus:outline-none"
              >
                {mode}
              </button>
            ) : (
              <span className="font-spaceMono text-xs text-blue-200">
                {mode}
              </span>
            )}
          </ShellPromptUi>
          <ShellPromptUi type="cwd" content={pwd} />
          <BsArrow90DegRight className="absolute -left-2 -bottom-[6px] size-5 text-blue-400" />
          <BsArrow90DegDown className="absolute -left-2 -bottom-[19px] size-5 text-blue-400 rotate-[271deg]" />
        </div>
        <div
          className={`relative flex flex-row justify-start items-center self-start shrink-0 text-white px-2  rounded-s-full rounded-e-full bg-white mr-1 font-spaceMono`}
        >
          <IoTriangleSharp
            className={`absolute -left-[11px] z-20 rotate-[269deg] text-white h-4 w-5`}
          />
          {/*TODO: make the button opens the pdf page used in rag */}
          {pageNumber && handleOpenPage ? (
            <button
              onClick={() => {
                handleOpenPage(pageNumber);
              }}
              className={`text-xs font-thin text-zinc-700 focus:outline-none`}
            >
              Page {pageNumber}
            </button>
          ) : (
            <span
              className={`text-xs font-thin text-zinc-700 focus:outline-none`}
            >
              Pending
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default TerminalPrompt;

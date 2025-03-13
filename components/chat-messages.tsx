"use client";

import { message } from "@/types";
import React from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import { linuxCommands } from "@/constants";
import ShellPromptUi from "./shell-prompt-ui";
import { BsArrow90DegDown, BsArrow90DegRight } from "react-icons/bs";
import { IoTriangleSharp } from "react-icons/io5";

// the model returns a markdown so i use this component to render it as html
const MemoizedMarkdownRenderer = React.memo(MarkdownRenderer);

interface Props extends React.ComponentPropsWithoutRef<"textarea"> {
  pwd: string;
  // handlePageNumberClick: (pageNumber: number) => void;
  messages: message[];
}

const ChatMessages: React.FC<Props> = React.memo(({ pwd, messages }) => {
  console.log("chat messages component mounts");

  return (
    <>
      {messages.map((msg, index) => {
        // to hightlight commands of every "Command" mode messaege
        const keyword = msg.text.split(" ");
        const command =
          msg.mode === "Command" && linuxCommands.includes(keyword[0]);

        return (
          <div
            key={index}
            className={`w-full font-mono ${msg.role != "user" ? "flex gap-0 sm:gap-2 items-start" : "flex flex-col justify-center gap-1"} mb-2`}
          >
            {/* display the shell prompt ui only for user */}
            {msg.role == "user" && (
              <div className="flex flex-row items-center justify-between">
                <div className="relative flex flex-row items-center gap-0">
                  <ShellPromptUi
                    type="left-side"
                    content={
                      msg.mode === "Command" && msg.role === "user"
                        ? "Command"
                        : "Prompt"
                    }
                  />
                  <ShellPromptUi
                    type="cwd"
                    content={index === messages.length - 1 ? pwd : msg.cwd}
                  />

                  <BsArrow90DegRight className="absolute -left-2 -bottom-[6px] size-5 text-blue-400" />
                  <BsArrow90DegDown className="absolute -left-2 -bottom-[19px] size-5 text-blue-400 rotate-[271deg]" />
                </div>
                <div
                  className={`relative flex flex-row justify-start items-center self-start shrink-0 text-white px-2  rounded-s-full rounded-e-full bg-white mr-1`}
                >
                  <IoTriangleSharp
                    className={`absolute -left-[11px] z-20 rotate-[269deg] text-white h-4 w-5`}
                  />
                  {/*TODO: make the button opens the pdf page used in RAG */}
                  <button
                    className={`pl-1 text-xs font-thin font-mono text-black`}
                  >
                    page {index + 1}
                  </button>
                </div>
              </div>
            )}
            <div
              className={`max-w-full font-light  ${
                msg?.role !== "user"
                  ? "font-spaceMono text-xs sm:text-sm text-green-600"
                  : "text-xs text-white font-mono mt-[1px]"
              }  break-words ${msg.text === "done" && "mb-2"}`}
            >
              {msg?.role == "user" ? (
                <>
                  <p className="pl-4 w-full break-words font-spaceMono">
                    {/* this might look tricky, i used this to hightlight the first word 
                    if it is a commnd*/}
                    {command ? (
                      <>
                        <span className="text-yellow-400">{keyword[0]}</span>{" "}
                        {msg.text.slice(keyword[0].length)}
                      </>
                    ) : (
                      <>{msg.text === "done" ? "" : msg.text}</>
                    )}
                  </p>
                </>
              ) : (
                <MemoizedMarkdownRenderer>
                  {/* done indicate that input is empty so render nothing */}
                  {msg.text === "done" ? "" : msg.text}
                </MemoizedMarkdownRenderer>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
});

ChatMessages.displayName = "ChatMessages";

export default ChatMessages;

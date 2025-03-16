"use client";

import { message } from "@/types";
import React from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import { linuxCommands } from "@/constants";
import TerminalPrompt from "./terminal-prompt";

// the model returns a markdown so i use this component to render it as html
const MemoizedMarkdownRenderer = React.memo(MarkdownRenderer);

interface Props extends React.ComponentPropsWithoutRef<"textarea"> {
  // handlePageNumberClick: (pageNumber: number) => void;
  messages: message[];
}

const ChatMessages: React.FC<Props> = React.memo(({ messages }) => {
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
            {msg.role == "user" && (
              <TerminalPrompt
                mode={msg.mode || "Command"}
                pwd={msg.cwd || "~"}
                pageNumber={index + 1}
                handleOpenPage={() => console.log("hello, world")}
              />
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
                  {/* "done" indicate that input is empty so render nothing */}
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

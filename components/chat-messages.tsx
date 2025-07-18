"use client";

import { message } from "@/types";
import React from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import TerminalPrompt from "./terminal-prompt";
import MessageHighlight from "./message-highlight";

// the model returns a markdown so i use this component to render it as html
const MemoizedMarkdownRenderer = React.memo(MarkdownRenderer);

interface Props extends React.ComponentPropsWithoutRef<"textarea"> {
  messages: message[];
  handleClick: (pageNumber: number) => void;
}

const ChatMessages: React.FC<Props> = React.memo(
  ({ messages, handleClick }) => {
    console.log("chat messages component mounts");

    return (
      <>
        {messages.map((msg, index) => {
          // to hightlight commands of every "Command" mode messaege
          console.log("msg is : ", msg);

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
                  handleOpenPage={() => handleClick(index + 1)}
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
                      {msg.text === "done" ? (
                        ""
                      ) : (
                        <MessageHighlight text={msg.text} />
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
  },
);

ChatMessages.displayName = "ChatMessages";

export default ChatMessages;

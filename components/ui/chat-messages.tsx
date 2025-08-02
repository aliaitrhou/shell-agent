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
          // NOTE: use real page numbers later and remove `index`
          console.log("msg is : ", msg);
          // to hightlight commands of every "Command" mode messaege

          switch (msg.role) {
            case "User":
              return (
                <div
                  key={index}
                  className="w-full font-mono flex flex-col justify-center gap-1 mb-2"
                >
                  <TerminalPrompt
                    //@ts-expect-error test
                    mode={msg.mode}
                    //@ts-expect-error test
                    pwd={msg.cwd}
                    pageNumber={index + 1}
                    handleOpenPage={() => handleClick(index + 1)}
                  />
                  <div
                    className={`max-w-full font-light text-xs text-white font-mono mt-[1px] break-words ${msg.text === "empty_message" ? "mb-2" : ""}`}
                  >
                    <p className="pl-4 w-full break-words font-spaceMono">
                      {msg.text === "empty_message" ? (
                        ""
                      ) : (
                        <MessageHighlight
                          text={msg.text}
                          classNames="!bg-transparent !text-white"
                        />
                      )}
                    </p>
                  </div>
                </div>
              );
            case "Assistant":
              return (
                <div
                  key={index}
                  className={`w-full font-mono flex gap-0 sm:gap-2 items-start mb-2`}
                >
                  <div
                    className={`max-w-full font-light font-spaceMono text-xs sm:text-sm text-green-600 break-words ${msg.text === "empty_message" && "mb-2"}`}
                  >
                    <MemoizedMarkdownRenderer>
                      {/* "empty_message" indicate that input or output is empty so render nothing*/}
                      {msg.text === "empty_message" ? "" : msg.text}
                    </MemoizedMarkdownRenderer>
                  </div>
                </div>
              );
            case "ShellOutput":
              return (
                <div
                  key={index}
                  className={`w-full font-mono flex gap-0 sm:gap-2 items-start mb-2`}
                >
                  <div
                    className={`max-w-full font-light 
                        font-spaceMono text-xs sm:text-sm text-green-600
                     break-words ${msg.text === "empty_message" && "mb-2"}`}
                  >
                    {/* "empty_message" indicate that input or output is empty so render nothing */}
                    <MessageHighlight
                      text={msg.text === "empty_message" ? "" : msg.text}
                    />
                  </div>
                </div>
              );
            default:
              throw new Error("There was an error message role!");
          }
        })}
      </>
    );
  },
);

ChatMessages.displayName = "ChatMessages";

export default ChatMessages;

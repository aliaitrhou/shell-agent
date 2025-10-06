"use client";

import { message } from "@/types";
import React from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import TerminalPrompt from "./terminal-prompt";
import MessageHighlight from "./message-highlight";
import { firaCode, mplus } from "@/app/fonts";

// the model returns a markdown so i use this component to render it as html
const MemoizedMarkdownRenderer = React.memo(MarkdownRenderer);


interface Props extends React.ComponentPropsWithoutRef<"textarea"> {
  messages: message[];
  handleClick: () => void;
}


const ChatMessages: React.FC<Props> = React.memo(
  ({ messages, handleClick }) => {

    return (
      <>
        {messages.map((msg, index) => {
          const prevAssistant = messages
            .slice(0, index)
            .reverse()
            .find((m) => m.role === "Assistant" && m.pageNumber != null);


          switch (msg.role) {
            case "User":
              return (
                <div
                  key={index}
                  className="w-full flex flex-col justify-center gap-1 mb-2"
                >
                  <TerminalPrompt
                    mode={msg.mode}
                    pwd={msg.cwd}
                    pageNumber={prevAssistant?.pageNumber || msg.pageNumber || null}
                    chapterName={msg.chapterName || prevAssistant?.chapterName || null}
                    containerExpiry={msg.containerExpiry}
                    handleOpenPdf={() => handleClick()}
                  />
                  <div
                    className={`max-w-full font-light text-xs text-zinc-300 mt-[1px] break-words ${msg.text === "empty_message" ? "mb-2" : ""}`}
                  >
                    <div className="pl-4 w-full break-words">
                      {msg.text === "empty_message" ? (
                        ""
                      ) : (
                        <>
                          {msg.mode === "Prompt" ? (
                            <p
                              className={`text-xs sm:text-[13px] font-medium ${mplus.className}`}
                            >
                              {msg.text}
                            </p>
                          ) : (
                            <MessageHighlight
                              text={msg.text}
                              classNames={`font-light !bg-transparent text-[13px] ${firaCode.className} text-white tracking-tighter`}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            case "Assistant":
              return (
                <div
                  key={index}
                  className={`w-full flex gap-0 sm:gap-2 items-start mb-2 `}
                >
                  <div
                    className={`${mplus.className} text-start w-full max-w-full font-normal text-xs sm:text-sm text-green-600
                    ${msg.text === "empty_message" && msg.mode === "Command" ? "my-2" : ""}`}
                  >
                    {/* render differently depending on mode */}
                    {msg.text === "empty_message" ? (
                      ""
                    ) : msg.mode === "Prompt" ? (
                      <MemoizedMarkdownRenderer>
                        {msg.text}
                      </MemoizedMarkdownRenderer>
                    ) : (
                      <p className="text-xs sm:text-[13px] font-medium leading-snug m-0">
                        {msg.text}
                      </p>
                    )}
                  </div>
                </div>
              );
            case "ShellOutput":
              return (
                <div
                  key={index}
                  className={` w-full flex gap-0 sm:gap-2 items-start mb-2`}
                >
                  <pre
                    className={`${mplus.className} max-w-full whitespace-pre-line font-light  text-xs sm:text-sm  text-green-600 ${msg.mode === "Prompt" ? "text-white" : ""}`}
                  >
                    {/* "empty_message" indicate that input or output is empty so render nothing */}
                    {msg.text === "empty_message" ? "" : msg.text}
                  </pre>
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

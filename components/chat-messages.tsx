"use client";

import { message, Mode } from "@/types";
import React, { FormEvent, useEffect, useRef } from "react";
import { IoTriangleSharp } from "react-icons/io5";
import MarkdownRenderer from "./MarkdownRenderer";
import { linuxCommands } from "@/constants";

// the model returns a markdown so i use this component render it as html
const MemoizedMarkdownRenderer = React.memo(MarkdownRenderer);

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
          className={`text-xs font-thin font-mono ${type == "left-side" && content && "text-blue-200"}`}
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

interface Props extends React.ComponentPropsWithoutRef<"textarea"> {
  isInput: boolean;
  mode: Mode;
  setModeCallback: React.Dispatch<React.SetStateAction<Mode>>;
  inputValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
  messages: message[];
}

const ChatMessages: React.FC<Props> = ({
  isInput,
  mode,
  inputValue,
  setModeCallback,
  messages,
  handleInputChange,
  handleFormSubmit,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [messages]);

  const handleToggleModes = () => {
    setModeCallback((prev: Mode) => (prev == "Prompt" ? "Command" : "Prompt"));
  };

  console.log("input value is : ", inputValue);
  const keywords = inputValue.split(" ");
  const currentValueIsCommand =
    mode === "Command" && linuxCommands.includes(keywords[0]);

  return (
    <>
      {messages.map((msg, index) => {
        // to hightlight commands of every "Command" mode messaege
        const keyword = msg.text.split(" ");
        const command =
          mode === "Command" && linuxCommands.includes(keyword[0]);

        return (
          <div
            key={index}
            className={`w-full  flex gap-0 sm:gap-2 items-start font-mono ${msg.role != "user" ? " pl-1 sm:pl-2 md:pl-3" : "h-5"} mb-2`}
          >
            {/* display the shell prompt ui only for user */}
            {msg.role == "user" && (
              <div className="flex flex-row items-center gap-0">
                <ShellPromptUi type="left-side" content={"prompt"} />
                <ShellPromptUi type="cwd" content={"~"} />
              </div>
            )}
            <div
              className={`max-w-full  sm:text-md font-light  ${
                msg?.role !== "user"
                  ? "font-spaceMono text-sm text-green-600"
                  : "text-xs text-white ml-3 font-mono"
              }  break-words`}
            >
              {msg?.role == "user" ? (
                <p className="w-full break-words">
                  {/* this might look tricky, i used this to hightlight the first word 
                    if it is a commnd*/}
                  {command ? (
                    <>
                      <span className="text-blue-400">{keyword[0]}</span>{" "}
                      {msg.text.slice(keyword[0].length)}
                    </>
                  ) : (
                    msg.text
                  )}
                </p>
              ) : (
                <MemoizedMarkdownRenderer>{msg.text}</MemoizedMarkdownRenderer>
              )}
            </div>
          </div>
        );
      })}

      {/* command/prompt inserting */}
      {isInput && (
        <div className="flex flex-row items-center justify-start h-4">
          <ShellPromptUi type="left-side">
            <button
              onClick={handleToggleModes}
              className="text-xs font-bold font-mono text-white"
            >
              {mode}
            </button>
          </ShellPromptUi>
          {/* teh content currnt working directory should be dynamic later: */}
          <ShellPromptUi type="cwd" content={"~"} />
          <form
            onSubmit={handleFormSubmit}
            className="relative w-full h-full p-0 flex items-center justify-start"
          >
            {/* this is used to hightlight the first word user types if the current mode is "Command" 
              and the that word is included in linux commands array
            */}
            <div className="absolute w-full h-full  font-mono text-xs text-white bg-transparent ml-5 pointer-events-none">
              {keywords.map((word, index) => (
                <span
                  key={index}
                  className={
                    index === 0 && currentValueIsCommand ? "text-blue-400" : ""
                  }
                >
                  {word}{" "}
                </span>
              ))}
            </div>
            <textarea
              onChange={handleInputChange}
              value={inputValue}
              maxLength={115}
              ref={textareaRef}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const form = e.currentTarget.form;
                  if (form) {
                    form.requestSubmit(); // this will trigger the form's onSubmit handler
                  }
                }
              }}
              className="w-full h-full font-mono text-xs text-white rounded-none border-none focus:outline-none resize-none bg-zinc-800/5 ml-5"
            />
          </form>
        </div>
      )}
    </>
  );
};

export default ChatMessages;

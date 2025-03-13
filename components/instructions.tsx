import React from "react";
import { FaInfoCircle } from "react-icons/fa";

const Keyword = ({ children }: { children: string }) => {
  return <span className="text-white font-semibold ">{children}</span>;
};

const Instructions = () => {
  return (
    <div className="max-w-lg sm:max-w-xl md:max-w-3xl mx-auto px-4 pt-2 pb-3 space-y-1">
      <div className="pl-2 text-xl sm:text-3xl md:text-4xl flex items-center gap-2 sm:gap-3 ">
        <FaInfoCircle className="size-8" />
        <span className="font-kanit">Instructions</span>
      </div>
      <ul
        role="list"
        className="list-disc font-light text-sm sm:text-lg  font-kanit text-zinc-300 pl-2 sm:pl-3 md:pl-4"
      >
        <li>
          You are represanted with two modes <Keyword>Prompt</Keyword> and{" "}
          <Keyword>Command</Keyword>.
        </li>
        <li>
          Use Prompt to learn the command then use Command to try it yourself
        </li>
        <li>
          The model would <Keyword>dynamically</Keyword> switch you to Command
          mode if it wants you to try a command.
        </li>
        <li>
          Your starting point is user directory &apos;
          <Keyword>~</Keyword>
          &apos;, if you don&apos;t know what that mean just ask with Prompt
          mode
        </li>
        <li>
          Typing <Keyword>clear</Keyword> with Command mode would reset the chat
          view, don&apos;t worry my friend your message history is saved
        </li>
        <li>
          Typing <Keyword>exit</Keyword> with Command mode would close the
          terminal
        </li>
        <li>
          {/* If you want to see the answer relative to the course click on the page */}
          {/* number of any answer, that would open a pdf */}
          If you want to know where the answer came from click on the page
          number at the left side.
        </li>
      </ul>
    </div>
  );
};

export default Instructions;

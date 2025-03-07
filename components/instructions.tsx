import React from "react";
import { GiOpenBook } from "react-icons/gi";

const Instructions = () => {
  return (
    <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto px-4 pt-2 pb-3 space-y-1">
      <div className="pl-2 text-md sm:text-2xl md:text-3xl flex items-center gap-2 sm:gap-3 ">
        <GiOpenBook />
        <span className="font-kanit">Instructions</span>
      </div>
      <ul
        role="list"
        className="list-disc font-light text-xs sm:text-sm md:text-md lg:text-lg font-kanit text-zinc-400 pl-2 sm:pl-3 md:pl-4"
      >
        <li>
          You are represanted with two modes{" "}
          <span className="text-emerald-500 font-semibold">Prompt</span> and{" "}
          <span className="text-emerald-500 font-semibold">Command</span>.
        </li>
        <li>
          Use Prompt to learn the command and use Command to try it yourself
        </li>
        <li>
          Your starting point is user directory &apos;
          <span className="text-emerald-500 font-semibold font-mono">~</span>
          &apos;, if you don&apos;t know what it mean just ask with Prompt mode
        </li>
        <li>
          Typing <span className="text-emerald-500 font-semibold">clear</span>{" "}
          with Command mode would reset the chat view, don&apos;t worry your
          message history is saved
        </li>
        <li>
          Typing <span className="text-emerald-500 font-semibold">exit</span>{" "}
          with Command mode would close the terminal
        </li>
      </ul>
    </div>
  );
};

export default Instructions;

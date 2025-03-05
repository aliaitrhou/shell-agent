import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const Instructions = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <div className="mx-auto max-w-md sm:max-w-lg md:max-w-xl border border-zinc-600 rounded-xl bg-zinc-700/50 px-4 pt-2 pb-3 space-y-1">
      <div className="flex items-center justify-between">
        <div className="text-md sm:text-xl md:text-2xl flex items-center gap-2 ">
          <FaInfoCircle />
          <span className="font-kanit">Instructions</span>
        </div>
        <button onClick={handleClick} className="text-zinc-500">
          <IoClose />
        </button>
      </div>
      <ul
        role="list"
        className="list-disc text-xs sm:text-sm md:text-md font-kanit text-zinc-300 pl-2 sm:pl-3 md:pl-4"
      >
        <li>You are represanted with two modes Prompt and Command</li>
        <li>
          Use Prompt to learn the command and Command to try the command
          yourself
        </li>
        <li>
          Your starting point is user directory '~', if you don&apos;t know what
          it mean just ask with Prompt mode
        </li>
        <li>
          Type clear to reset the chat view, don't worry your message history is
          saved
        </li>
      </ul>
    </div>
  );
};

export default Instructions;

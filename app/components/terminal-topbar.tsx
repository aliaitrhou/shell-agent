import React from "react";
import { message } from "@/types";
import { XMarkIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

interface Props {
  setMessages: React.Dispatch<React.SetStateAction<message[]>>;
}

const TerminalToolBar: React.FC<Props> = ({ setMessages }) => {
  const handleRedButtonClick = () => {
    setMessages([
      {
        role: "user",
        m: "",
      },
      {
        role: "assistent",
        m: "",
      },
    ]);
  };

  return (
    <div className="sticky z-40 top-0 left-0 right-0 w-full bg-zinc-800 h-8 sm:h-10 flex items-center border-b-[1px] border-zinc-700  px-4 justify-between">
      <div className="group flex items-center gap-2">
        <button
          onClick={handleRedButtonClick}
          className="bg-red-500 w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center"
        >
          <XMarkIcon className="w-3 h-3 text-black opacity-0 group-hover:opacity-100 flex justify-center items-center" />
        </button>
        <button className="bg-yellow-500 w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center">
          <MinusIcon className="w-3 h-3 text-black opacity-0 group-hover:opacity-100" />
        </button>
        <button className="bg-green-500 w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center">
          <PlusIcon className="w-3 h-3 text-black opacity-0 group-hover:opacity-100" />
        </button>
      </div>
      <p className="font-semibold text-xs sm:text-sm text-gray-100/45 font-sans">
        Terminal
      </p>
    </div>
  );
};

export default TerminalToolBar;

import React from "react";
import { XMarkIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import ButtonHoverEffect from "./button-hover-effect";

interface Props {
  currentChatId: string;
  openSidebar: boolean;
  disableDelete: boolean;
  disableCreate: boolean;
  handleToggleSidebar: () => void;
  handleAddSession: () => void;
  handleDeleteSession: (chatId: string) => void;
}

const TerminalTopBar: React.FC<Props> = ({
  openSidebar,
  disableDelete,
  disableCreate,
  handleToggleSidebar,
  handleAddSession,
  currentChatId,
  handleDeleteSession,
}) => {
  return (
    <div className="absolute z-30 top-0 left-0 right-0 w-full bg-zinc-800 h-8 sm:h-10 flex items-center border-b-[1px] border-b-zinc-700 px-4 justify-between rounded-t-xl">
      <div className="group flex items-center gap-2">
        <ButtonHoverEffect desc="Remove current chat">
          <button
            onClick={() => handleDeleteSession(currentChatId)}
            disabled={disableDelete}
            className={`bg-red-500 w-4 h-4 rounded-full flex items-center justify-center ${disableDelete && "cursor-not-allowed"}`}
          >
            <XMarkIcon className="w-3 h-3 text-black sm:opacity-0 group-hover:opacity-100 flex justify-center items-center" />
          </button>
        </ButtonHoverEffect>
        <ButtonHoverEffect desc={`${openSidebar ? "Close" : "Open"} Sidebar`}>
          <button
            onClick={handleToggleSidebar}
            className="bg-yellow-500 w-4 h-4 rounded-full flex items-center justify-center"
          >
            <MinusIcon className="w-3 h-3 text-black sm:opacity-0 group-hover:opacity-100" />
          </button>
        </ButtonHoverEffect>
        <ButtonHoverEffect desc="Create New Chat">
          <button
            onClick={handleAddSession}
            disabled={disableCreate}
            className={`bg-green-500 w-4 h-4 rounded-full flex items-center justify-center`}
          >
            <PlusIcon className="w-3 h-3 text-black sm:opacity-0 group-hover:opacity-100" />
          </button>
        </ButtonHoverEffect>
      </div>
      <p className="text-sm text-zinc-500 font-kanit">Terminal</p>
    </div>
  );
};

export default TerminalTopBar;

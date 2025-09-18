import React from "react";
import { XMarkIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import ButtonHoverEffect from "./button-hover-effect";
import { useTerminalTabs } from "@/stores/terminal-tabs-store";
import Sidebar from "./sidebar";
import { lexend } from "@/app/fonts";

interface Props {
  closeEditor: () => void;
  chatId: string;
}

const TerminalTopBar: React.FC<Props> = ({ closeEditor, chatId }) => {
  // TODO: use the function from useTerminalTabs
  const { handleAddChat, disableAddChat, disableRemoveChat, handleRemoveChat } =
    useTerminalTabs();
  const openSidebar = true;

  return (
    <div
      className={`absolute z-30 top-0 left-0 right-0 ${lexend.className} font-light w-full bg-neutral-900 h-10 lg:h-12 border-b-[2px] border-b-zinc-700/40 rounded-t-md px-3 lg:px-4 flex items-center gap-1`}
    >
      <div className="group flex items-center gap-2 shrink-0">
        <ButtonHoverEffect desc="Remove current chat">
          <button
            onClick={() => {
              closeEditor();
              handleRemoveChat(chatId);
            }}
            disabled={disableRemoveChat}
            className={`bg-red-500 border border-red-400/70 w-3 h-3 rounded-full flex items-center justify-center focus:outline-none  ${disableRemoveChat && "cursor-not-allowed"}`}
          >
            <XMarkIcon className="w-3 h-3 text-black sm:opacity-0 group-hover:opacity-100 flex justify-center items-center" />
          </button>
        </ButtonHoverEffect>
        <ButtonHoverEffect desc={`${openSidebar ? "Close" : "Open"} Sidebar`}>
          <button
            // onClick={handleToggleSidebar}
            className="bg-yellow-500 border border-yellow-300/70 w-3 h-3 rounded-full flex items-center justify-center  focus:outline-none"
          >
            <MinusIcon className="w-3 h-3 text-black sm:opacity-0 group-hover:opacity-100" />
          </button>
        </ButtonHoverEffect>
        <ButtonHoverEffect desc="Create New Chat">
          <button
            onClick={() => {
              closeEditor();
              handleAddChat();
            }}
            disabled={disableAddChat}
            className={`bg-green-500 border border-green-300/70 w-3 h-3 rounded-full flex items-center justify-center  focus:outline-none`}
          >
            <PlusIcon className="w-3 h-3 text-black sm:opacity-0 group-hover:opacity-100" />
          </button>
        </ButtonHoverEffect>
      </div>
      <div className="flex-1 min-w-0">
        <Sidebar />
      </div>
    </div>
  );
};

export default TerminalTopBar;

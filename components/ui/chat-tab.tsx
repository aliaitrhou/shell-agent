"use client";

import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { BsThreeDots } from "react-icons/bs";
import { lexend } from "@/app/fonts";
import { useTerminalTabs } from "@/stores/terminal-tabs-store";
import { HiOutlineXMark } from "react-icons/hi2";
import { FaLock } from "react-icons/fa6";
import { FiEdit2, FiTrash } from "react-icons/fi";

interface Props {
  name: string;
  maxWidth: number;
  chatId: string;
  active: boolean;
  isClosed: boolean;
}

const ChatItem: React.FC<Props> = ({
  name,
  maxWidth,
  chatId,
  active,
  isClosed,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [newName, setNewName] = useState(name);
  const [openInput, setOpenInput] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {
    disableRemoveChat,
    handleRemoveChat,
    handleRenameChat,
    setActiveChatId,
  } = useTerminalTabs();

  useEffect(() => {
    setNewName(name);
  }, [name]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleThreeDotsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpenMenu((prev) => !prev);
  };

  const handleDelete = () => {
    setOpenMenu(false);
    handleRemoveChat(chatId);
  };

  const handleRename = () => {
    setOpenMenu(false);
    setOpenInput(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const saveNewName = () => {
    if (newName.trim() && newName !== name) {
      handleRenameChat(chatId, newName.trim());
    }
    setOpenInput(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveNewName();
      setOpenInput(false);
    }
  };

  return (
    <div
      ref={menuRef}
      className={`min-w-0 max-w-32 flex-1 ${lexend.className} relative ${active
        ? "rounded-t-lg  py-1 lg:py-[6px] px-2  relative bg-zinc-800 border-x-[2px] border-t-[2px] border-zinc-700/30 border-b-[2px] border-b-zinc-800"
        : "rounded-lg py-[2px] lg:py-[4px] px-2 self-center   bg-zinc-700/20 hover:bg-zinc-700/30  border-zinc-700/40 mb-[2px]"
        } text-zinc-300 text-xs lg:text-sm font-extralight flex flex-row justify-between items-center gap-0  `}
      style={{ width: `${Math.floor(maxWidth)}px` }}
    >
      {isClosed && (
        <FaLock className="absolute -top-[6px] -right-[2px] -rotate-45 text-zinc-600" />
      )}
      {openInput ? (
        <input
          ref={inputRef}
          className={`rounded-sm w-full  ${active ? "bg-zinc-700" : "bg-zinc-700/20"} text-white focus:outline-none focus:ring-2 text-xs focus:ring-blue-400`}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={saveNewName}
          value={newName}
          maxLength={20}
        />
      ) : (
        <div
          onClick={() => setActiveChatId(chatId)}
          className="min-w-0 text-start cursor-pointer flex-1"
        >
          <span
            className={`flex-1 min-w-0 text-xs ${isClosed ? "text-zinc-500" : "text-zinc-300"} truncate block`}
          >
            {newName}
          </span>
        </div>
      )}

      {openMenu && (
        <div className="absolute left-24 top-8 z-50 bg-zinc-700  border border-zinc-600 rounded-md flex flex-col gap-1 items-center p-1 text-white text-sm">
          <button
            onClick={handleRename}
            className="w-full text-xs px-2 py-1 hover:bg-blue-500 rounded-md flex flex-row justify-between items-center gap-2"

          >
            <span>Rename</span>
            <FiEdit2 className="text-zinc-300" />
          </button>
          <div className="w-full h-[1px] bg-zinc-600" />
          <button
            onClick={handleDelete}
            disabled={disableRemoveChat}
            className={`w-full text-xs px-2 py-1 text-red-400 hover:text-white hover:bg-blue-500 rounded-md flex flex-row justify-between items-center ${disableRemoveChat && "cursor-not-allowed"} gap-2`}
          >
            <span>Delete</span>
            <FiTrash />
          </button>
        </div>
      )}

      <button
        className={`hidden md:block focus:outline-none border-none ${isClosed ? "text-zinc-500" : "text-zinc-300"} text-zinc-300  ${openMenu ? "bg-zinc-600" : "hover:bg-zinc-500/50"} p-[2px] rounded-full`}
        onClick={handleThreeDotsClick}
      >
        <BsThreeDots className="rotate-90" />
      </button>
      <button onClick={handleDelete} className="md:hidden">
        <HiOutlineXMark className="size-4" />
      </button>
    </div>
  );
};

export default ChatItem;

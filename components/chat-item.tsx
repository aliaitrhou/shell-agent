"use client";

import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";

interface Props {
  name: string;
  chatId: string;
  onClick: () => void;
  active: boolean;
  disableDelete: boolean;
  handleDeleteChat: (id: string) => void;
  handleRenameChat: (id: string, newName: string) => void;
}

const ChatItem: React.FC<Props> = ({
  name,
  chatId,
  onClick,
  disableDelete,
  active,
  handleDeleteChat,
  handleRenameChat,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [newName, setNewName] = useState(name);
  const [openInput, setOpenInput] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
    handleDeleteChat(chatId);
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
      // setNewName(name);
      setOpenInput(false);
    }
  };

  return (
    <div
      ref={menuRef}
      className={`relative w-full rounded-[4px] py-1 px-3 ${
        active
          ? "bg-zinc-700/70 border border-zinc-600"
          : "hover:bg-zinc-700/30 border border-zinc-700"
      } text-zinc-300 text-xs flex flex-row justify-between items-center`}
    >
      {openInput ? (
        <input
          ref={inputRef}
          className={`w-full rounded-sm  ${active ? "bg-zinc-600" : "bg-zinc-700/70"} text-white focus:outline-none focus:ring-2 focus:ring-blue-400`}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={saveNewName}
          value={newName}
        />
      ) : (
        <div
          onClick={onClick}
          className="w-full text-start cursor-pointer  overflow-y-auto"
        >
          <span className="text-xs font-kanit w-full">{newName}</span>
        </div>
      )}

      {openMenu && (
        <div className="absolute right-0 top-[27px] z-50 bg-zinc-600/50 backdrop-blur-[2px] border border-zinc-600 rounded-md flex flex-col gap-1 items-center p-1 text-white">
          <button
            onClick={handleRename}
            className="w-full px-2 py-1 hover:bg-blue-500 rounded-md flex flex-row justify-between items-center gap-2"
          >
            <span>Rename</span>
            <FiEdit className="text-zinc-300" />
          </button>
          <button
            onClick={handleDelete}
            disabled={disableDelete}
            className={`w-full px-2 py-1 hover:bg-blue-500 rounded-md flex flex-row justify-between items-center ${disableDelete && "cursor-not-allowed"} gap-2`}
          >
            <span>Delete</span>
            <RiDeleteBinLine className="text-zinc-300" />
          </button>
        </div>
      )}

      <button className="ml-2" onClick={handleThreeDotsClick}>
        <BsThreeDots />
      </button>
    </div>
  );
};

export default ChatItem;

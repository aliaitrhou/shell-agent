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
      className={`relative w-full  rounded-[4px] py-1 px-3 ${
        active
          ? "bg-zinc-700/80 border border-zinc-600"
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
        <div
          ref={menuRef}
          className="absolute -right-20 top-3 z-50 bg-zinc-800 border border-zinc-700 rounded-md flex flex-col gap-1 items-center p-1"
        >
          <button
            onClick={handleRename}
            className="w-full px-2 py-1 hover:bg-zinc-900/60 rounded-md flex flex-row justify-between items-center gap-2"
          >
            <span>Rename</span>
            <FiEdit />
          </button>
          <button
            onClick={handleDelete}
            disabled={disableDelete}
            className={`w-full px-2 py-1 hover:bg-zinc-900/60 rounded-md flex flex-row justify-between items-center gap-2 ${disableDelete && "cursor-not-allowed"}`}
          >
            <span>Delete</span>
            <RiDeleteBinLine />
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
// "use client";
//
// import React, {
//   useState,
//   useEffect,
//   useRef,
//   ChangeEvent,
//   KeyboardEvent,
// } from "react";
// import { BsThreeDots } from "react-icons/bs";
// import { RiDeleteBinLine } from "react-icons/ri";
// import { FiEdit } from "react-icons/fi";
//
// interface Props {
//   name: string;
//   chatId: string;
//   onClick: () => void;
//   active: boolean;
//   handleDeleteChat: (id: string) => void;
//   handleRenameChat: (id: string, newName: string) => void;
// }
//
// const ChatItem: React.FC<Props> = ({
//   name,
//   chatId,
//   onClick,
//   active,
//   handleDeleteChat,
//   handleRenameChat,
// }) => {
//   const [openMenu, setOpenMenu] = useState(false);
//   const [newName, setNewName] = useState(name);
//   const [openInput, setOpenInput] = useState(false);
//
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const inputRef = useRef<HTMLInputElement | null>(null);
//
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         inputRef.current &&
//         !inputRef.current.contains(event.target as Node) &&
//         menuRef.current &&
//         !menuRef.current.contains(event.target as Node)
//       ) {
//         setOpenInput(false);
//         setNewName(name); // Reset name if editing is canceled
//       }
//     };
//
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [name]);
//
//   const handleThreeDotsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation();
//     setOpenMenu((prev) => !prev);
//   };
//
//   const handleDelete = () => {
//     setOpenMenu(false);
//     handleDeleteChat(chatId);
//   };
//
//   const handleRename = () => {
//     setOpenMenu(false);
//     setOpenInput(true);
//     setTimeout(() => inputRef.current?.focus(), 0);
//   };
//
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setNewName(e.target.value);
//   };
//
//   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       const trimmedName = newName.trim();
//       if (trimmedName) {
//         handleRenameChat(chatId, trimmedName);
//       }
//       setOpenInput(false);
//     } else if (e.key === "Escape") {
//       setNewName(name);
//       setOpenInput(false);
//     }
//   };
//
//   return (
//     <div
//       onClick={onClick}
//       className={`relative w-full cursor-pointer rounded-md py-1 px-3 ${
//         active ? "bg-zinc-600" : "bg-zinc-700/70 hover:bg-zinc-700"
//       } text-zinc-300 text-sm flex flex-row justify-between items-center`}
//     >
//       {openInput && active ? (
//         <input
//           ref={inputRef}
//           className="w-full p-1 rounded-md bg-zinc-500 text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-400"
//           onChange={handleChange}
//           onKeyDown={handleKeyDown}
//           value={newName}
//         />
//       ) : (
//         <span className="text-sm font-medium truncate">{name}</span>
//       )}
//       {openMenu && (
//         <div
//           ref={menuRef}
//           className="absolute -right-20 top-3 z-50 bg-zinc-800 border border-zinc-700 rounded-md flex flex-col gap-1 items-center p-1"
//         >
//           <button
//             onClick={handleRename}
//             className="w-full px-2 py-1 hover:bg-zinc-900/60 rounded-md flex flex-row justify-between items-center gap-2"
//           >
//             <span>Rename</span>
//             <FiEdit />
//           </button>
//           <button
//             onClick={handleDelete}
//             className="w-full px-2 py-1 hover:bg-zinc-900/60 rounded-md flex flex-row justify-between items-center gap-2"
//           >
//             <span>Delete</span>
//             <RiDeleteBinLine />
//           </button>
//         </div>
//       )}
//       <button className="ml-2" onClick={handleThreeDotsClick}>
//         <BsThreeDots />
//       </button>
//     </div>
//   );
// };
//
// export default ChatItem;
// "use client";
//
// import React, {
//   useState,
//   useEffect,
//   useRef,
//   ChangeEvent,
//   KeyboardEvent,
// } from "react";
// import { BsThreeDots } from "react-icons/bs";
// import { RiDeleteBinLine } from "react-icons/ri";
// import { FiEdit } from "react-icons/fi";
//
// interface Props {
//   name: string;
//   chatId: string;
//   onClick: () => void;
//   active: boolean;
//   handleDeleteChat: (id: string) => void;
//   handleRenameChat: (id: string, newName: string) => void;
// }
//
// const ChatItem: React.FC<Props> = ({
//   name,
//   chatId,
//   onClick,
//   active,
//   handleDeleteChat,
//   handleRenameChat,
// }) => {
//   const [openMenu, setOpenMenu] = useState(false);
//   const [newName, setNewName] = useState(name);
//   const [openInput, setOpenInput] = useState(false);
//
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const inputRef = useRef<HTMLInputElement | null>(null);
//
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setOpenMenu(false);
//       }
//     };
//
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
//
//   const handleThreeDotsClick = (
//     e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
//   ) => {
//     e.stopPropagation(); // this would stop the outer button click handler from firing :)
//     setOpenMenu((prev) => !prev);
//   };
//
//   function handleDelete() {
//     setOpenMenu(false);
//     handleDeleteChat(chatId);
//   }
//
//   function handleRename() {
//     // close menu
//     setOpenMenu(false);
//     // focus on the input
//     if (inputRef.current) inputRef.current.focus();
//     // open the input
//     setOpenInput(true);
//   }
//
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target as HTMLInputElement;
//     setNewName(value);
//   };
//
//   // save the new name to my database
//   const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       handleRenameChat(chatId, newName);
//       setOpenInput(false);
//     }
//   };
//
//   return (
//     <div
//       onClick={onClick}
//       className={`relative w-full cursor-pointer rounded-[4px] py-1 px-3 ${active ? "bg-zinc-600" : "bg-zinc-700/70  hover:bg-zinc-700"}  text-zinc-300 text-xs flex flex-row justify-between items-center`}
//     >
//       {openInput && active ? (
//         <input
//           ref={inputRef}
//           className="w-full focus:outline-2 focus:outline-blue-300  border-none focus:border-none shadow-none bg-zinc-500 text-white"
//           onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
//           onKeyDown={handleKeyDown}
//           value={newName}
//         />
//       ) : (
//         <span className="text-xs  font-kanit">
//           {newName != name ? newName : name}
//         </span>
//       )}
//       {openMenu && (
//         <div
//           ref={menuRef}
//           className="absolute -right-20 top-3 z-50 bg-zinc-800 border border-zinc-700 rounded-md flex flex-col gap-1 items-center p-1"
//         >
//           <button
//             onClick={handleRename}
//             className="w-full px-2 py-1 hover:bg-zinc-900/60 rounded-md flex flex-row justify-between items-center gap-2"
//           >
//             <span>Rename</span>
//             <FiEdit />
//           </button>
//           <button
//             onClick={handleDelete}
//             className="w-full px-2 py-1 hover:bg-zinc-900/60 rounded-md flex flex-row justify-between items-center gap-2"
//           >
//             <span>Delete</span>
//             <RiDeleteBinLine />
//           </button>
//         </div>
//       )}
//       <button className="ml-2" onClick={(e) => handleThreeDotsClick(e)}>
//         <BsThreeDots />
//       </button>
//     </div>
//   );
// };
//
// export default ChatItem;

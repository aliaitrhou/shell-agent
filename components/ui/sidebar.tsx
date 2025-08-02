import React from "react";
import ChatItem from "./chat-item";
import { ChatProps } from "@/types";

interface SidebarProps {
  currentChatId: string;
  chats: ChatProps[];
  loadingChats: boolean;
  disableRemoveChat: boolean;
  setActiveChatId: (chatId: string) => void;
  handleRenameChat: (chatId: string, newName: string) => void;
  handleRemoveChat: (chatId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  loadingChats,
  currentChatId,
  setActiveChatId,
  disableRemoveChat,
  handleRenameChat,
  handleRemoveChat,
}) => {
  return (
    <section className="hidden h-[72dvh] sm:flex flex-col bg-zinc-800 rounded-sm border border-zinc-700/60">
      <div className="h-8 sm:h-10 border-b border-b-zinc-700/60 flex items-center justify-center">
        <h3 className="font-kanit text-zinc-500 text-md">Your Chats</h3>
      </div>
      {loadingChats ? (
        <div className="h-full w-full flex flex-col gap-2 px-1 py-2 md:px-2 overflow-y-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-28 py-1 px-2 rounded-[4px] bg-zinc-700/50 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="h-full flex flex-col gap-2 px-1 py-2 md:px-2 overflow-y-auto">
          {chats.map((chat, index) => (
            <ChatItem
              key={index}
              active={chat.id === currentChatId}
              chatId={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              handleRenameChat={handleRenameChat}
              handleDeleteChat={handleRemoveChat}
              disableDelete={disableRemoveChat}
              name={chat.name}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Sidebar;

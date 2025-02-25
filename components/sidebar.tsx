import React from "react";
import SidebarWrapper from "./sidebar-wrapper";
import ChatItem from "./chat-item";
import { ChatProps } from "@/types";
import ChatItemWrapper from "./chat-item-wrapper";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface SidebarProps {
  open: boolean;
  currentChatId: string;
  chats: ChatProps[];
  loadingChat: boolean;
  disableRemoveChat: boolean;
  setActiveChatId: (chatId: string) => void;
  handleRenameChat: (chatId: string, newName: string) => void;
  handleRemoveChat: (chatId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  open,
  chats,
  loadingChat,
  currentChatId,
  setActiveChatId,
  disableRemoveChat,
  handleRenameChat,
  handleRemoveChat,
}) => {
  return (
    <SidebarWrapper
      key={open.toString()}
      className="hidden w-36 md:w-40 sm:mt-[39px] self-start  sm:flex  bg-zinc-800/80 rounded-lg border border-zinc-700  h-[60dvh] text-center"
    >
      <h3 className="sticky top-0 left-0 right-0 font-semibold font-kanit text-center text-zinc-400 text-sm p-2 border-b border-b-zinc-700">
        Your Chats :)
      </h3>
      <div className="flex flex-col gap-2  h-[calc(60dvh-40px)] px-1 py-2">
        {loadingChat && (
          <div className="relative w-full  rounded-[4px] py-1 px-3 bg-zinc-700/70">
            <AiOutlineLoading3Quarters className="mx-auto h-4 w-4 rounded-full animate-spin text-zinc-500" />
          </div>
        )}
        {chats.map((chat, index) => (
          <ChatItemWrapper key={index} idx={index}>
            {/* i used the index for the chat item animation delay */}
            <ChatItem
              active={chat.id === currentChatId}
              chatId={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              handleRenameChat={handleRenameChat}
              handleDeleteChat={handleRemoveChat}
              disableDelete={disableRemoveChat}
              name={chat.name}
            />
          </ChatItemWrapper>
        ))}
      </div>
    </SidebarWrapper>
  );
};

export default Sidebar;

import React from "react";
import ChatItem from "./chat-item";
import { ChatProps } from "@/types";
import ChatItemWrapper from "./chat-item-wrapper";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
    <section className="hidden h-[85dvh] w-36 md:w-44 self-start sm:flex bg-zinc-800/90 rounded-lg border border-zinc-700  text-center">
      <div className={`relative w-full h-full whitespace-nowrap`}>
        <h3 className="py-2 font-kanit text-zinc-500 text-md border-b border-b-zinc-700">
          Your Chats
        </h3>
        {loadingChats ? (
          <div className="h-[50%] w-full flex items-center justify-center">
            <AiOutlineLoading3Quarters className="mx-auto h-5 w-5 rounded-full animate-spin text-zinc-600" />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col gap-2 px-1 py-2 md:px-2 overflow-y-auto">
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
        )}
      </div>
    </section>
  );
};

export default Sidebar;

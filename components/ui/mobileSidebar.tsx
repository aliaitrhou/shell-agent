"use client";

import React from "react";
import { ChatProps } from "@/types";
import ChatTab from "./chat-tab";
import { motion } from "framer-motion";

interface MobileSidebarProps {
  currentChatId: string;
  chats: ChatProps[];
  disableRemoveChat: boolean;
  closeSidebar: () => void;
  setActiveChatId: (chatId: string) => void;
  handleRenameChat: (chatId: string, newName: string) => void;
  handleRemoveChat: (chatId: string) => void;
}

const Wrapper = ({
  children,
  classNames,
}: {
  children: React.ReactNode;
  classNames: string;
}) => {
  return (
    <motion.section
      initial={{
        translateX: 200,
      }}
      animate={{
        translateX: 0,
      }}
      exit={{
        translateX: 200,
      }}
      transition={{ duration: 0.3 }}
      className={classNames}
    >
      {children}
    </motion.section>
  );
};

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  chats,
  currentChatId,
  closeSidebar,
  setActiveChatId,
  disableRemoveChat,
  handleRenameChat,
  handleRemoveChat,
}) => {
  return (
    <>
      <div
        onClick={closeSidebar}
        className="sm:hidden absolute top-0 z-40 h-full w-full bg-black/30"
      ></div>
      <Wrapper classNames="h-full w-48  absolute right-0 top-0 z-40  bg-zinc-800 border border-zinc-700 rounded-s-xl sm:hidden">
        <div className="w-full h-full flex flex-col">
          <h3 className="sticky top-0 left-0 right-0 font-semibold font-kanit text-center text-zinc-500 text-sm p-2 border-b border-b-zinc-700">
            Your Chats
          </h3>
          <div className="h-full space-y-2 p-4">
            {chats.map((chat, index) => (
              <ChatTab
                key={index}
                active={chat.id === currentChatId}
                chatId={chat.id}
                onClick={() => {
                  setActiveChatId(chat.id);
                  closeSidebar();
                }}
                handleRenameChat={handleRenameChat}
                handleDeleteChat={handleRemoveChat}
                disableDelete={disableRemoveChat}
                name={chat.name}
              />
            ))}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default MobileSidebar;

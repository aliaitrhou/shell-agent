import React, { useState, useRef, useEffect } from "react";
import ChatTab from "./chat-tab";
import { useTerminalTabs } from "@/stores/terminal-tabs-store";

const Sidebar = () => {
  const [maxWidth, setMaxWidth] = useState(0);
  const { chats, activeChatId } = useTerminalTabs();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      if (chats.length > 0) {
        setMaxWidth(Math.floor(container.offsetWidth / chats.length));
      } else {
        setMaxWidth(0);
      }
    };

    // Initial run
    updateWidth();

    // Observe resize
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);

    return () => observer.disconnect();
  }, [chats.length]); // depends on chats length only

  return (
    <div className="relative -bottom-[.6px] flex gap-1 h-full px-1 md:px-2 pt-[10px] lg:pt-4">
      {chats.map((chat, _index) => (
        <ChatTab
          key={chat.id}
          maxWidth={maxWidth}
          active={chat.id === activeChatId}
          chatId={chat.id}
          name={chat.name}
          isClosed={chat.closedTab}
        />
      ))}
    </div>
  );
};

export default Sidebar;

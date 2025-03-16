"use client";

import React, { useState, useEffect, useCallback } from "react";
import Terminal from "@/components/terminal";
import { ChatProps } from "@/types";
import Sidebar from "@/components/sidebar";
import { useUser } from "@clerk/clerk-react";
import MobileSidebar from "@/components/mobileSidebar";
import { AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function Shell() {
  const [openSidebar, setOpenSidebar] = useState(true);
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [responseStatus, setResponseStatus] = useState({
    message: "",
    status: "",
  });
  const [currentChatId, setCurrentChatId] = useState("");

  const [start, setStart] = useState(false);

  const { user } = useUser();

  const searchParams = useSearchParams();
  const model = searchParams.get("model");
  const semester = searchParams.get("semester");

  console.log("model", model);
  console.log("semester", semester);

  // create chat callback
  const handleCreateChat = useCallback(async () => {
    // to prevent users from creating a new chat when they already
    // created one and did not used it:
    const unusedChat = chats.find((chat) => chat.messageCount === 0);
    if (unusedChat) {
      setCurrentChatId(unusedChat.id); // open the unused chat instead of creating a new one
    } else {
      setResponseStatus({
        message: `Creating New chat..`,
        status: "loading",
      });
      try {
        const response = await fetch("/api/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "New Chat",
          }),
        });

        if (!response.ok) {
          console.error("Failed to create chat");
          setResponseStatus({
            message: "Failed to create New chat!",
            status: "error",
          });
          return;
        }

        const { message, status, chat } = await response.json();

        setResponseStatus({
          message,
          status,
        });

        setChats((prev) => [
          {
            ...chat,
            messageCount: 0,
          },
          ...prev,
        ]);

        // set new chat as active
        setCurrentChatId(chat.id);
      } catch (error) {
        console.error(error);
        setResponseStatus({
          message: "Failed to create New Chat!",
          status: "error",
        });
      } finally {
        setTimeout(() => {
          setResponseStatus({
            message: "",
            status: "",
          });
        }, 4000);
      }
    }
  }, [chats]);

  // remove chat callback
  const handleRemoveChat = useCallback(
    async (chatId: string) => {
      setResponseStatus({
        message: `Deleting chat..`,
        status: "loading",
      });
      try {
        const response = await fetch("/api/chats", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatId }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete chat!");
        }

        const { message, status } = await response.json();

        setResponseStatus({
          message,
          status,
        });

        // update state
        setChats((prevChats) => {
          const updatedChats = prevChats.filter((chat) => chat.id !== chatId);

          if (currentChatId === chatId) {
            setCurrentChatId(updatedChats.length > 0 ? updatedChats[0].id : "");
          }
          return updatedChats;
        });
      } catch (error) {
        setResponseStatus({
          message: "Error while deleting chat",
          status: "error",
        });
        console.error("Error deleting chat:", error);
      } finally {
        setTimeout(() => {
          setResponseStatus({
            message: "",
            status: "",
          });
        }, 4000);
      }
    },
    [currentChatId],
  );

  // toggle sidebar callback
  const handleToggleSidebar = useCallback(() => {
    setOpenSidebar((prev) => !prev);
  }, []);

  // rename chat callback
  const handleRenameChat = useCallback(
    async (chatId: string, newValue: string) => {
      try {
        const response = await fetch("/api/chats", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId, newName: newValue }),
        });

        if (!response.ok) {
          throw new Error("Failed to update chat name");
        }
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === chatId ? { ...chat, name: newValue } : chat,
          ),
        );
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [],
  );

  const fetchChats = useCallback(async () => {
    setLoadingChats(true);
    try {
      const response = await fetch("/api/chats");

      if (!response.ok) {
        console.log("Failed to fetch chats");
        setResponseStatus({
          message: "Failed to fetch chats!",
          status: "error",
        });
        return;
      }

      const chatsData = await response.json();
      setChats(chatsData);

      if (!currentChatId && chatsData.length > 0) {
        setCurrentChatId(chatsData[0].id);
      }
    } catch (e) {
      console.log("error: ", e);
    } finally {
      setLoadingChats(false);
      setTimeout(() => {
        setResponseStatus({
          message: "",
          status: "",
        });
      }, 4000);
    }
  }, [currentChatId]);

  useEffect(() => {
    if (user && start) {
      fetchChats();
    }
  }, [user, start]);

  const handleMessageSent = useCallback((chatId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? { ...chat, messageCount: chat.messageCount + 1 }
          : chat,
      ),
    );
  }, []);

  return (
    <div className="w-full md:w-[95%] lg:w-[80%] mx-auto flex flex-row justify-center items-center px-1 sm:px-2 md:px-4 sm:gap-2 md:gap-3 lg:gap-4 xl:px-8 border border-green-500">
      {openSidebar && (
        <Sidebar
          chats={chats}
          loadingChats={loadingChats}
          disableRemoveChat={chats.length === 1}
          setActiveChatId={setCurrentChatId}
          currentChatId={currentChatId}
          handleRenameChat={handleRenameChat}
          handleRemoveChat={handleRemoveChat}
        />
      )}
      {/* i don't want the sidebar to be open for mobile when user first opens the terminal*/}
      <AnimatePresence>
        {!openSidebar && (
          <MobileSidebar
            key={openSidebar.toString()}
            chats={chats}
            closeSidebar={handleToggleSidebar}
            disableRemoveChat={chats.length === 1}
            setActiveChatId={setCurrentChatId}
            currentChatId={currentChatId}
            handleRenameChat={handleRenameChat}
            handleRemoveChat={handleRemoveChat}
          />
        )}
      </AnimatePresence>
      <Terminal
        chatId={currentChatId}
        openSidebar={openSidebar}
        closeTerminal={() => setStart(false)}
        // TODO: remove this static data
        selectData={{
          model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
          semester: "S4",
        }}
        disableRemoveChat={
          chats.length === 1 || responseStatus.status === "loading"
        }
        // TODO: limit users to 8 chats
        disableCreateChat={responseStatus.status === "loading"}
        handleToggleSidebar={handleToggleSidebar}
        handleCreateChat={handleCreateChat}
        handleRemoveChat={handleRemoveChat}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
}

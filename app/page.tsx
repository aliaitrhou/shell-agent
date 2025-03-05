"use client";

import React, { useState, useEffect, useCallback } from "react";
import Terminal from "@/components/terminal";
import { ChatProps } from "@/types";
import Sidebar from "@/components/sidebar";
import { useClerk, useUser } from "@clerk/clerk-react";
import Link from "next/link";
import Instructions from "@/components/instructions";
import { FaChevronRight } from "react-icons/fa";

export default function Home() {
  const [openSidebar, setOpenSidebar] = useState(true);
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [loading, setLoading] = useState({
    loadingChats: false,
    createChat: false,
    delete: false,
  });
  const [currentChatId, setCurrentChatId] = useState("");
  const [start, setStart] = useState(false);
  const [dispayInstructions, setDisplayInstructions] = useState(true);

  const { user, isSignedIn } = useUser();

  const { openSignIn } = useClerk();

  // create chat callback
  const handleCreateChat = useCallback(async () => {
    // to prevent the user from creating a new chat when he already
    // created one and did not used it:
    const unusedChat = chats.find((chat) => chat.messageCount === 0);
    if (unusedChat) {
      setCurrentChatId(unusedChat.id); // open the unused chat instead of creating a new one
    } else {
      setLoading((prev) => ({
        ...prev,
        createChat: true,
      }));
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
          return;
        }

        const chat = await response.json();
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
        console.error("Error creating new chat: ", error);
      } finally {
        setLoading((prev) => ({
          ...prev,
          createChat: false,
        }));
      }
    }
  }, [chats]);

  // remove chat callback
  const handleRemoveChat = useCallback(
    async (chatId: string) => {
      setLoading((prev) => ({
        ...prev,
        delete: true,
      }));

      try {
        const response = await fetch("/api/chats", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatId }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete chat");
        }

        // update state
        setChats((prevChats) => {
          const updatedChats = prevChats.filter((chat) => chat.id !== chatId);

          if (currentChatId === chatId) {
            setCurrentChatId(updatedChats.length > 0 ? updatedChats[0].id : "");
          }

          return updatedChats;
        });
      } catch (error) {
        console.error("Error deleting chat:", error);
      } finally {
        setLoading((prev) => ({
          ...prev,
          delete: false,
        }));
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
    setLoading((prev) => ({
      ...prev,
      loadingChats: true,
    }));
    try {
      const response = await fetch("/api/chats");

      if (!response.ok) {
        console.log("Failed to fetch chats");
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
      setLoading((prev) => ({
        ...prev,
        loadingChats: false,
      }));
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

  const handleStartButtonClick = () => {
    // send the user to log in if they are not
    if (!user) {
      return openSignIn();
    }

    if (isSignedIn) {
      setStart(true);
    }
  };

  return (
    <main
      className={`text-white h-[87dvh] flex ${start ? "flex-row justify-center items-center" : "flex-col justify-center space-y-4"} sm:gap-2 md:gap-4 lg:gap-6 px-3 sm:px-4 md:px-8 xl:px-32`}
    >
      {start ? (
        <>
          {openSidebar && (
            <Sidebar
              open={openSidebar}
              chats={chats}
              loadingChat={loading.createChat}
              loadingChats={loading.loadingChats}
              disableRemoveChat={chats.length === 1}
              setActiveChatId={setCurrentChatId}
              currentChatId={currentChatId}
              handleRenameChat={handleRenameChat}
              handleRemoveChat={handleRemoveChat}
            />
          )}
          <Terminal
            chatId={currentChatId}
            openSidebar={openSidebar}
            disableRemoveChat={chats.length === 1 || loading.delete}
            // TODO: limit users to 8 chats
            disableCreateChat={loading.createChat}
            handleToggleSidebar={handleToggleSidebar}
            handleCreateChat={handleCreateChat}
            handleRemoveChat={handleRemoveChat}
            onMessageSent={handleMessageSent}
          />
        </>
      ) : (
        <>
          <section
            className={`${!dispayInstructions && "-mt-44"} flex flex-col items-center space-y-4`}
          >
            <span className="font-light text-xs md:text-sm font-kanit rounded-full border border-zinc-200 bg-zinc-400 text-zinc-800 px-[2px] py-[1px] sm:px-2 md:px-3 md:py-1 ">
              Fully open source{" "}
              <Link
                className="underline italic font-semibold"
                target="_blank"
                href={"https://github.com/aliaitrhou/quantum-shell"}
              >
                star it github
              </Link>
            </span>
            <div className="w-full flex flex-col justify-cneter items-center gap-2">
              <h3 className="max-w-lg sm:max-w-xl md:max-w-3xl text-center text-4xl sm:text-5xl md:text-6xl font-kanit font-bold">
                Time to{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-blue-500 to-blue-400">
                  Reboot Your Learning
                </span>
                —No More Linux Classes!
              </h3>
              <p className="px-3 sm:px-0 max-w-2xl text-center font-kanit text-sm sm:text-md md:text-xl">
                With a shell that{" "}
                <span className="font-bold">speaks your language</span> and
                reduces the complexity of learning about OSes, taking you in an
                intuitive and interactive learning adventure.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 sm:space-y-2 md:space-y-4">
              <div className="flex items-center gap-2">
                <select className="w-fit font-kanit text-sm md:text-md p-1 md:p-2 text-zinc-400  bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none">
                  <option>Model of choose</option>
                  <option>Qwen2.5-7B</option>
                  <option>Meta-Llama-3.1-70B</option>
                  <option>Qwen2.5-72B</option>
                  <option>Meta-Llama-3.1-8B</option>
                </select>
                <select className="font-kanit text-sm md:text-md p-1 md:p-2 text-zinc-400  bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none">
                  <option>Semester</option>
                  <option>SEMESTER - S3</option>
                  <option>SEMESTER - S4</option>
                </select>
              </div>
              <button
                onClick={handleStartButtonClick}
                className="group font-kanit text-sm md:text-md p-1 md:p-2 text-zinc-400  bg-zinc-800 border border-zinc-700 rounded-full shadow-zincShadow hover:shadow-zincShadowHover transition-shadow duration-700 ease-in-out flex gap-2 items-center focus:outline-none focus:border-none"
              >
                <span> ⚡ GET STARTED</span>

                <FaChevronRight className="size-3 transition-transform duration-700 group-hover:translate-x-[3px]" />
              </button>
            </div>
          </section>
          {dispayInstructions && (
            <Instructions handleClick={() => setDisplayInstructions(false)} />
          )}
        </>
      )}
    </main>
  );
}

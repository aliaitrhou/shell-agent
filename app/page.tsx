"use client";

import React, { useState, useEffect, useCallback, FormEvent } from "react";
import Terminal from "@/components/terminal";
import { ChatProps } from "@/types";
import Sidebar from "@/components/sidebar";
import { useClerk, useUser } from "@clerk/clerk-react";
import { PlaceholdersAndVanishInput } from "@/components/placeholders-and-vanish-input";

// type loadingState = {
//   loadingChats: boolean;
//   loadingNewChat: boolean;
// };

export default function Home() {
  const [openSidebar, setOpenSidebar] = useState(true);
  const [chats, setChats] = useState<ChatProps[]>([]);
  // const [loading, setLoading] = useState<loadingState>({
  //   loadingChats: false,
  //   loadingNewChat: false,
  // });
  const [currentChatId, setCurrentChatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [startInputValue, setStartInputValue] = useState("");
  const [start, setStart] = useState(false);

  const { user } = useUser();

  const { openSignIn } = useClerk();

  // create chat callback
  const handleCreateChat = useCallback(async () => {
    setLoading(true);
    // to prevent the user from creating a new chat when he already
    // created one and did not used it:
    //
    // const hasUnusedChat = chats.some((chat) => chat.messages?.length === 0);

    // if (hasUnusedChat) {
    //   console.warn("You already have an unused chat. Use it before creating a new one.");
    //   return;
    // }

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
      setChats((prev) => [chat, ...prev]);

      // set new chat as active
      setCurrentChatId(chat.id);

      setLoading(false);
    } catch (error) {
      console.error("Error creating new chat: ", error);
    }
  }, []);

  // remove chat callback
  const handleRemoveChat = useCallback(
    async (chatId: string) => {
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
      }
    },
    [currentChatId],
  );

  // toggle sidebar callback
  const handleToggleSidebar = useCallback(async () => {
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

  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await fetch("/api/chats");

        if (!response.ok) {
          console.log("Failed to fetch chats");
          return;
        }

        const chatsData = await response.json();
        setChats(chatsData);

        //HACK: here i can set the chat that i want to be active
        // when the user opens the app (if they have no chat you should create the "First Chat")
        if (!currentChatId) {
          setCurrentChatId(chatsData[0].id);
        }
      } catch (e) {
        console.log("error: ", e);
      }
    }
    // prevent the request if user is not signed in --> for the first render
    if (user) {
      fetchChats();
    } else {
      console.log("No user was found");
      return;
    }
  }, [currentChatId, user]);

  const handleStartPageInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target as HTMLInputElement;
    setStartInputValue(value);
  };

  const handleStartPageFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // send the user to log in if they are not
    if (!user) {
      return openSignIn();
    }

    // open the terminal and side bar after the user submit the form with a prompt
    if (startInputValue && user) {
      setStart(true);
    }
  };

  return (
    <main
      className={
        "text-white h-[85dvh]  flex flex-row justify-center items-center sm:gap-2 md:gap-4 lg:gap-6 px-3 sm:px-4 md:px-8 xl:px-32"
      }
    >
      {start ? (
        <>
          {openSidebar && (
            <Sidebar
              open={openSidebar}
              chats={chats}
              loadingChat={loading}
              loadingChats={false}
              disableRemoveChat={chats.length === 1}
              setActiveChatId={setCurrentChatId}
              currentChatId={currentChatId}
              handleRenameChat={handleRenameChat}
              handleRemoveChat={handleRemoveChat}
            />
          )}
          <Terminal
            chatId={currentChatId}
            starterMessage={startInputValue}
            openSidebar={openSidebar}
            disableRemoveChat={chats.length === 1}
            handleToggleSidebar={handleToggleSidebar}
            handleCreateChat={handleCreateChat}
            handleRemoveChat={handleRemoveChat}
          />
        </>
      ) : (
        <section
          className={`w-full sm:w-[70%] mx-auto flex flex-col items-center gap-4`}
        >
          <h3 className="font-kanit text-[1.8rem] sm:text-4xl md:text-[3rem] font-bold text-center md:mb-2">
            What is the mession today?
          </h3>
          <PlaceholdersAndVanishInput
            placeholders={[
              "How does the `awk` command works ?",
              "What are the flags of `wc` command ?",
              "How to switch between users ?",
            ]}
            onChange={handleStartPageInputChange}
            onSubmit={handleStartPageFormSubmit}
          />
        </section>
      )}
    </main>
  );
}

"use client";

import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import Terminal from "@/components/terminal";
import { ChatProps } from "@/types";
import Sidebar from "@/components/sidebar";
import { useClerk, useUser } from "@clerk/clerk-react";
import Link from "next/link";
import Instructions from "@/components/instructions";
import { AiFillGithub } from "react-icons/ai";
import Header from "@/components/hearder";
import { StatusAlert } from "@/components/alert";
import Footer from "@/components/footer";
import MobileSidebar from "@/components/mobileSidebar";

export default function Home() {
  const [openSidebar, setOpenSidebar] = useState(true);
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [responseStatus, setResponseStatus] = useState({
    message: "",
    status: "",
  });
  const [currentChatId, setCurrentChatId] = useState("");
  const [selectData, setSelectData] = useState({
    model: "",
    semester: "",
  });
  const [start, setStart] = useState(false);

  const { user, isSignedIn } = useUser();

  const { openSignIn } = useClerk();

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

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target as HTMLSelectElement;
    setSelectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartButtonClick = () => {
    // send the user to log in if they are not
    if (!user) {
      return openSignIn();
    }

    if (!selectData.model || !selectData.semester) {
      setResponseStatus({
        message: "Must select model and semester!",
        status: "warning",
      });
      return setTimeout(() => {
        setResponseStatus({
          message: "",
          status: "",
        });
      }, 2000);
    }

    if (isSignedIn && selectData.model && selectData.semester) {
      setStart(true);
    }
  };

  return (
    <>
      {responseStatus.message && (
        <div className="absolute w-full flex justify-center pt-10 sm:pt-12">
          <StatusAlert
            message={responseStatus.message}
            type={responseStatus.status}
          />
        </div>
      )}
      <Header />
      <main
        className={`text-white h-[90vh] py-4 flex ${start ? "flex-row justify-center items-center" : "flex-col justify-center space-y-4"} sm:gap-2 md:gap-4 lg:gap-6 px-3 sm:px-4 md:px-8 xl:px-32`}
      >
        {start ? (
          <>
            {openSidebar && (
              <>
                <Sidebar
                  chats={chats}
                  loadingChats={loadingChats}
                  disableRemoveChat={chats.length === 1}
                  setActiveChatId={setCurrentChatId}
                  currentChatId={currentChatId}
                  handleRenameChat={handleRenameChat}
                  handleRemoveChat={handleRemoveChat}
                />
                <MobileSidebar
                  chats={chats}
                  closeSidebar={handleToggleSidebar}
                  disableRemoveChat={chats.length === 1}
                  setActiveChatId={setCurrentChatId}
                  currentChatId={currentChatId}
                  handleRenameChat={handleRenameChat}
                  handleRemoveChat={handleRemoveChat}
                />
              </>
            )}
            <Terminal
              chatId={currentChatId}
              openSidebar={openSidebar}
              closeTerminal={() => setStart(false)}
              selectData={selectData}
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
          </>
        ) : (
          <section
            className={`flex flex-col items-center space-y-2 md:space-y-4 lg:space-y-6`}
          >
            <span className="font-light text-xs font-kanit rounded-full border border-zinc-300 bg-zinc-400/90 text-white px-[2px] py-[1px] sm:px-1 md:px-2 md:py-[2px]">
              <Link
                target="_blank"
                className="hover:underline italic flex items-center gap-1 text-zinc-800"
                href={"https://github.com/aliaitrhou/quantum-shell"}
              >
                <span>Star it on Github</span>
                <AiFillGithub />
              </Link>
            </span>
            <div className="w-full flex flex-col justify-cneter items-center gap-2 pb-6">
              <h3 className="max-w-full sm:max-w-2xl md:max-w-4xl text-center text-3xl sm:text-5xl md:text-6xl font-kanit font-bold">
                It&apos;s Time to{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-blue-500 to-blue-400">
                  Reboot Your Learning
                </span>
                -No More Linux Classes!
              </h3>
              <p className="text-zinc-300 font-light px-3 sm:px-0 max-w-lg md:max-w-2xl text-center font-kanit text-sm sm:text-lg md:text-xl">
                A shell that{" "}
                <span className="font-semibold">speaks your language</span> and
                reduces the complexity of learning about OSes, taking you in an
                intuitive and interactive learning adventure.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 sm:space-y-2 md:space-y-4">
              <div className="flex items-center gap-2">
                <select
                  name="model"
                  defaultValue={"default"}
                  onChange={handleSelectChange}
                  className="font-kanit text-xs sm:text-sm md:text-md p-1 md:p-2 text-zinc-400  bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none"
                >
                  <option value="default" disabled>
                    Choose a model
                  </option>
                  <option value="Qwen/Qwen2.5-7B-Instruct-Turbo">
                    Qwen2.5-7B
                  </option>
                  <option value="meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo">
                    Meta-Llama-3.1-405B
                  </option>
                  <option value="Qwen/Qwen2.5-72B-Instruct-Turbo">
                    Qwen2.5-72B
                  </option>
                  <option value="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo">
                    Meta-Llama-3.1-8B
                  </option>
                </select>
                <select
                  name="semester"
                  defaultValue={"default"}
                  onChange={handleSelectChange}
                  className="font-kanit text-xs sm:text-sm md:text-md p-1 md:p-2 text-zinc-400  bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none"
                >
                  <option value="default" disabled>
                    Semester
                  </option>
                  <option value="S3">SEMESTER - S3</option>
                  <option value="S4">SEMESTER - S4</option>
                </select>
              </div>
              <button
                onClick={handleStartButtonClick}
                className="font-kanit text-sm md:text-sm lg:text-lg px-2 py-2 md:p-3 text-zinc-400  bg-zinc-700/60 border border-zinc-700 rounded-full shadow-zincShadow hover:shadow-zincShadowHover transition-shadow duration-700 ease-in-out focus:outline-none"
              >
                <span>⚡ GET STARTED</span>
              </button>
            </div>
            <Instructions />
          </section>
        )}
      </main>
      {!start && <Footer />}
    </>
  );
}

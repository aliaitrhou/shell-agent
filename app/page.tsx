"use client";

import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import Terminal from "@/components/terminal";
import { ChatProps } from "@/types";
import Sidebar from "@/components/sidebar";
import { useClerk, useUser } from "@clerk/clerk-react";
import Link from "next/link";
import Instructions from "@/components/instructions";
import { AiFillGithub } from "react-icons/ai";
import MobileSidebar from "@/components/mobileSidebar";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/page-wrapper";

export default function Home() {
  const [openSidebar, setOpenSidebar] = useState(true);
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [start, setStart] = useState(false);
  const [currentChatId, setCurrentChatId] = useState("");
  const [responseStatus, setResponseStatus] = useState({
    message: "",
    status: "",
  });
  const [selectData, setSelectData] = useState({
    model: "",
    semester: "",
  });
  const [pdfPreviewStatus, setPdfPreviewStatus] = useState({
    openPdf: false,
    loading: false,
    page: 0,
  });

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
    <PageWrapper
      classNames={
        "text-white h-fit sm:h-[92%] flex justify-center items-center"
      }
      start={start}
      message={responseStatus.message}
      status={responseStatus.status}
    >
      {start ? (
        <div className="w-full md:w-[95%] lg:w-[80%] mx-auto flex flex-row justify-center items-center px-1 sm:px-2 md:px-4 sm:gap-2 md:gap-3 lg:gap-4 xl:px-8">
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
            // openPdfPreview={() => setPdfPreviewStatus(prev => {...prev, laoding})}
          />
        </div>
      ) : (
        <section
          className={`flex flex-col justify-center items-center space-y-2 md:space-y-4 lg:space-y-6`}
        >
          <span className="font-light text-xs font-kanit rounded-full border border-white bg-zinc-300 text-white px-[2px] py-[1px] sm:px-1 md:px-2 md:py-[2px]">
            <Link
              target="_blank"
              className="hover:underline italic flex items-center gap-1 text-zinc-800"
              href={"https://github.com/aliaitrhou/quantum-shell"}
            >
              <span>Star it on Github</span>
              <AiFillGithub />
            </Link>
          </span>
          <div className="w-full flex flex-col justify-cneter items-center gap-2">
            <h3 className="max-w-full sm:max-w-2xl md:max-w-3xl text-center text-3xl sm:text-5xl md:text-6xl font-kanit font-bold">
              Turn{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-violet-500 via-blue-400 to-blue-200">
                Unix Commands
              </span>{" "}
              Into Enjoyable Experiences
            </h3>
            <p className="text-zinc-300 font-light px-3 sm:px-0 max-w-lg md:max-w-2xl text-center font-kanit text-sm sm:text-lg md:text-xl">
              With A shell that{" "}
              <span className="font-semibold">speaks your language</span> and
              reduces the complexity of learning about OSes.
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 sm:gap-2 md:gap-3">
            <div className="flex items-center">
              <div className="relative">
                <select
                  name="model"
                  aria-label="Models"
                  defaultValue={"default"}
                  onChange={handleSelectChange}
                  className="text-xs appearance-none sm:text-sm focus:outline-none text-zinc-400 bg-zinc-800  border-[1px] border-zinc-700/40 border-r-0 rounded-s-full p-2 sm:p-3 pr-8 sm:pr-10"
                >
                  <option value="default" disabled>
                    Choose a model
                  </option>
                  <option value="Qwen/Qwen2.5-7B-Instruct-Turbo">
                    Qwen2.5-7B
                  </option>
                  <option value="Qwen/Qwen2.5-72B-Instruct-Turbo">
                    Qwen2.5-72B
                  </option>
                  <option value="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo">
                    Llama-3.1-8B
                  </option>
                  <option value="meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo">
                    Llama-3.1-405B
                  </option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-[10px] sm:top-[14px]  size-4 text-zinc-500" />
              </div>
              <div className="relative">
                <select
                  name="semester"
                  defaultValue={"default"}
                  onChange={handleSelectChange}
                  className="text-xs appearance-none sm:text-sm focus:outline-none text-zinc-400  bg-zinc-800  border-[1px] border-zinc-700/40 rounded-e-full p-2 sm:p-3 pr-8 sm:pr-10"
                >
                  <option value="default" disabled>
                    Semester
                  </option>
                  <option value="S3">SEMESTER - S3</option>
                  <option value="S4">SEMESTER - S4</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-[10px] sm:top-[14px]  size-4 text-zinc-500" />
              </div>
            </div>
            <button
              onClick={handleStartButtonClick}
              className="font-kanit text-sm md:text-sm lg:text-lg px-2 py-2 sm:p-3 md:px-4 md:py-3  text-zinc-400  bg-zinc-800  border-[1px] border-zinc-700/40 rounded-full hover:shadow-zincShadow transition-shadow duration-700 ease-in-out focus:outline-none"
            >
              <span>⚡ GET STARTED</span>
            </button>
          </div>
          <Instructions />
        </section>
      )}
    </PageWrapper>
  );
}

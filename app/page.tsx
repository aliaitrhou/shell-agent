"use client";

import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import Terminal from "@/components/terminal";
import { ChatProps } from "@/types";
import Sidebar from "@/components/sidebar";
import { useClerk, useUser } from "@clerk/clerk-react";
import MobileSidebar from "@/components/mobileSidebar";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/page-wrapper";
import PdfPreview from "@/components/pdf-preview";
import Landing from "@/components/landing";

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
      start={start}
      classNames={`text-white h-auto ${start ? "h-screen" : ""} full flex flex-col justify-center items-center gap-4 lg:gap-6`}
      message={responseStatus.message}
      status={responseStatus.status}
    >
      {start ? (
        <div className="h-full w-full md:w-[95%] lg:w-[80%] mx-auto flex flex-col sm:flex-row justify-center items-center px-0 sm:px-2 md:px-4 sm:gap-2 md:gap-3 lg:gap-4 xl:px-8">
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
          {/* <div className="w-fit h-fit border"> */}
          {/* </div> */}
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
            openPdfPreview={(n) =>
              setPdfPreviewStatus({
                openPdf: true,
                page: n,
              })
            }
          />
          {pdfPreviewStatus.openPdf && (
            <PdfPreview
              pageToOpen={pdfPreviewStatus.page}
              handleClosePdf={() =>
                setPdfPreviewStatus((prev) => ({
                  ...prev,
                  openPdf: false,
                }))
              }
            />
          )}
        </div>
      ) : (
        <Landing
          handleClick={handleStartButtonClick}
          handleChange={handleSelectChange}
        />
      )}
    </PageWrapper>
  );
}

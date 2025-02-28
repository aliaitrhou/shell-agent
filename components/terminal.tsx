"use client";

import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import TerminalTopBar from "./terminal-top-bar";
import { message, Mode } from "@/types";
import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream.mjs";
import AimationLayout from "./animation-layout";
import ChatMessages from "./chat-messages";

interface Props {
  chatId: string;
  starterMessage: string;
  openSidebar: boolean;
  disableRemoveChat: boolean;
  handleCreateChat: () => void;
  handleToggleSidebar: () => void;
  handleRemoveChat: (chatId: string) => void;
}

const Terminal: React.FC<Props> = ({
  openSidebar,
  starterMessage,
  disableRemoveChat,
  handleToggleSidebar,
  handleCreateChat,
  handleRemoveChat,
  chatId,
}) => {
  console.log("starter message : ", starterMessage);

  const [msg, setMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]); // State to manage chat history
  const [messages, setMessages] = useState<message[]>([]);
  // mode is default to prompt
  const [mode, setMode] = useState<Mode>("Prompt");
  const [dispayForm, setDispayForm] = useState(true);
  const [commandsHistory, setCommandsHistory] = useState<string[]>([""]);
  const [pwd, setPwd] = useState("~");

  const [loadingStatus, setLoadingStatus] = useState({
    chats: false,
    modelAnswer: false,
  });

  const refContainer = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const insertMessagesByChatId = async (
    id: string,
    msg: string,
    role: string,
    mode: Mode,
    cwd: string,
  ) => {
    // check for valid inputs before making the request
    if (!id || !msg || !role || !mode || !cwd) {
      console.error("Missing required fields.");
      return;
    }

    const response = await fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: id,
        text: msg,
        role: role,
        mode,
        cwd,
      }),
    });

    if (!response.ok) {
      console.error("Failed to insert message:", response.statusText);
      return;
    }

    await response.json();
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const el = e.target as HTMLTextAreaElement;
      setMsg(el.value);
    },
    [],
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      openSignIn();
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: msg,
        mode: mode,
        cwd: "~",
      },
    ]);
    setChatHistory((prevHistory) => [...prevHistory, `user: ${msg}`]);
    // insert the user message to database
    insertMessagesByChatId(chatId, msg, "user", mode, "~");
    if (mode == "Prompt") {
      await getModelAnswer("Prompt");
    } else {
      await getModelAnswer("Command");
    }
  };

  const getModelAnswer = async (m: Mode) => {
    setLoadingStatus({ chats: false, modelAnswer: true });
    setDispayForm(false);

    // if the input is "clear" and current mode is "command" clean the terminal (reset the state)
    if (msg.toLowerCase() === "clear" && m == "Command") {
      setMessages([]);
      setLoadingStatus({ chats: false, modelAnswer: false });
      setDispayForm(true);
      setMsg("");
    } else {
      if (m == "Command") {
        try {
          const res = await fetch("/api/cmd", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              command: msg,
              commandsHistory,
            }),
          });

          if (!res.ok) {
            throw new Error(
              `Failed to fetch model response: ${res.status} ${res.statusText}`,
            );
          }

          if (!res.body) {
            throw new Error("Response body is undefined.");
          }

          const responseData = await res.json();

          setMessages((prev) => [
            ...prev,
            {
              role: "assistent",
              text: responseData.content || "done",
              mode: "Command",
              cwd: responseData.cwd,
            },
          ]);
          setPwd(responseData.cwd);

          insertMessagesByChatId(
            chatId,
            responseData.content || "done",
            "assistant",
            "Command",
            responseData.cwd,
          );
        } catch (error) {
          console.error(
            "There was an error fetching from cmd endpoint!",
            error,
          );
        } finally {
          setLoadingStatus({ chats: false, modelAnswer: false });
          // DONE: display the form after the model have respond.
          setMsg("");
          setDispayForm(true);
        }
      } else {
        try {
          const res = await fetch("/api/model", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: msg,
              chatHistory: chatHistory,
            }),
          });

          if (!res.ok) {
            throw new Error(
              `Failed to fetch model response: ${res.status} ${res.statusText}`,
            );
          }

          if (!res.body) {
            // Handle case where body is missing
            throw new Error("Response body is undefined.");
          }

          const runner = ChatCompletionStream.fromReadableStream(res.body!);
          let currentMessage = "";

          // in order to steam the response
          runner.on("content", (delta) => {
            currentMessage += delta;
            setChatHistory((prevHistory) => {
              const updatedHistory = [...prevHistory];
              if (
                updatedHistory.length > 0 &&
                updatedHistory[updatedHistory.length - 1].startsWith(
                  "assistent:",
                )
              ) {
                updatedHistory[updatedHistory.length - 1] =
                  `assistent: ${currentMessage}`;
              } else {
                updatedHistory.push(`assistent: ${currentMessage}`);
              }

              return updatedHistory;
            });
            setMessages((prev) => {
              const updatedMessages = [...prev];
              if (
                updatedMessages.length > 0 &&
                updatedMessages[updatedMessages.length - 1].role === "assistent"
              ) {
                updatedMessages[updatedMessages.length - 1].text =
                  currentMessage; // Update the last message
              } else {
                updatedMessages.push({
                  role: "assistent",
                  text: currentMessage,
                  cwd: prev.length > 0 ? prev[prev.length - 1].cwd : "~", // Get last cwd or default to "~"
                  mode: "Prompt",
                }); // If no assistant message exists, create a new one
              }
              return updatedMessages;
            });
          });

          // TODO: change cwd later to be dynamic also
          // save the model answer
          runner.on("end", () => {
            insertMessagesByChatId(
              chatId,
              currentMessage,
              "assistant",
              "Prompt",
              "~",
            );
            setDispayForm(true);
          });

          runner.on("error", (err) => {
            console.error("Streaming error:", err);
            setMessages((prev) => [
              ...prev,
              {
                role: "assistent",
                text: "Something went wrong while processing your request.",
                cwd: "~",
                mode: "Prompt",
              },
            ]);
          });
        } catch (error) {
          console.error("Error fetching model response:", error);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistent",
              text: "An error occurred. Please try again later.",
              cwd: "~",
              mode: "Prompt",
            },
          ]);
        } finally {
          setLoadingStatus({ chats: false, modelAnswer: false });
          // DONE: display the form after the model have respond.
          setMsg("");
        }
      }
    }
  };

  useEffect(() => {
    setLoadingStatus({ chats: true, modelAnswer: false });
    const getCurrentChatById = async (chatId: string) => {
      try {
        const res = await fetch(`/api/messages/${chatId}`);
        const currentChatData = await res.json();
        setMessages(currentChatData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingStatus({ chats: false, modelAnswer: false });
      }
    };

    if (chatId) {
      getCurrentChatById(chatId);
    }
  }, [chatId]);

  // this useEffect should run every time the user toggle between chats
  // so a new chatHistory/commandsHistory created which means that the models
  // would have a new memory each time.
  useEffect(() => {
    const commands = messages
      .map((m: message) => {
        if (m.mode == "Command") {
          const command = m.text;
          return command;
        }
        return null;
      })
      .filter(Boolean);

    setCommandsHistory(commands);
  }, [messages]);

  const scroll = () => {
    if (refContainer.current) {
      const { offsetHeight, scrollHeight, scrollTop } =
        refContainer.current as HTMLDivElement;

      if (scrollHeight >= scrollTop + offsetHeight) {
        refContainer.current.scrollTo(0, scrollHeight + 160);
      }
    }
  };

  useEffect(() => {
    scroll();
  }, [messages]); // rerun scroll whenever messages change

  return (
    <div className={`w-full h-[80dvh] flex flex-col items-center`}>
      <AimationLayout>
        <section className="relative w-full h-full  bg-zinc-800/80 rounded-xl  border-[1px] border-zinc-700">
          <TerminalTopBar
            currentChatId={chatId}
            disableDelete={disableRemoveChat}
            handleDeleteSession={handleRemoveChat}
            handleToggleSidebar={handleToggleSidebar}
            openSidebar={openSidebar}
            handleAddSession={handleCreateChat}
            /* TODO: disable this button also if you have single chat
             * with no messages in the chats array */
            disableAddSession={messages.length === 0}
          />
          <div
            ref={refContainer}
            className="w-full h-full overflow-y-scroll pt-12 pb-3 rounded-xl"
          >
            {loadingStatus.chats ? (
              <div className="w-full h-full flex justify-center items-center">
                <AiOutlineLoading3Quarters className="mx-auto h-7 w-7 rounded-full animate-spin text-zinc-600" />
              </div>
            ) : (
              <>
                <ChatMessages
                  mode={mode}
                  pwd={pwd}
                  setModeCallback={setMode}
                  inputValue={msg}
                  isInput={dispayForm}
                  handleInputChange={handleChange}
                  handleFormSubmit={handleSubmit}
                  messages={messages}
                />
                {loadingStatus.modelAnswer && <div className="ml-5 loader" />}
              </>
            )}
          </div>
        </section>
      </AimationLayout>
    </div>
  );
};

export default Terminal;

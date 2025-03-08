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
import ChatMessages from "./chat-messages";
import ShellPromptUi from "./shell-prompt-ui";
import { linuxCommands } from "@/constants";
import { IoTriangleSharp } from "react-icons/io5";
import { FaChevronRight } from "react-icons/fa";
import { BsArrow90DegDown, BsArrow90DegRight } from "react-icons/bs";

interface Props {
  chatId: string;
  openSidebar: boolean;
  selectData: {
    model: string;
    semester: string;
  };
  closeTerminal: () => void;
  disableRemoveChat: boolean;
  disableCreateChat: boolean;
  handleCreateChat: () => void;
  handleToggleSidebar: () => void;
  handleRemoveChat: (chatId: string) => void;
  onMessageSent: (chatId: string) => void;
}

const Terminal: React.FC<Props> = ({
  openSidebar,
  selectData,
  closeTerminal,
  disableRemoveChat,
  disableCreateChat,
  handleToggleSidebar,
  handleCreateChat,
  handleRemoveChat,
  onMessageSent,
  chatId,
}) => {
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
    // this well tell the parent to increment this chat messages count
    // so user can create a new chat if they want
    onMessageSent(chatId);
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
      // with command mode
      switch (msg.toLowerCase()) {
        case "clear":
          setMessages([]);
          setLoadingStatus({ chats: false, modelAnswer: false });
          setDispayForm(true);
          setMsg("");
          break;
        case "exit":
          // close the terminal
          closeTerminal();
          setMsg("");
          break;
        default:
          await getModelAnswer("Command");
      }
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
              model: selectData.model,
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
              model: selectData.model,
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
        return "";
      })
      .filter(Boolean);

    setCommandsHistory(commands);

    // TODO: add the prompt chat history here
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

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // focus on the form input
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [messages]);

  const handleToggleModes = () => {
    setMode((prev: Mode) => (prev === "Prompt" ? "Command" : "Prompt"));
  };

  const keywords = msg.split(" ");
  const currentValueIsCommand =
    mode === "Command" && linuxCommands.includes(keywords[0]);

  return (
    <div className={`w-full h-[80dvh] flex flex-col items-center`}>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <section className="relative w-full h-full  bg-zinc-900/90 rounded-xl  border-[1px] border-zinc-800">
          <TerminalTopBar
            currentChatId={chatId}
            disableDelete={disableRemoveChat}
            disableCreate={disableCreateChat}
            handleDeleteSession={handleRemoveChat}
            handleToggleSidebar={handleToggleSidebar}
            openSidebar={openSidebar}
            handleAddSession={handleCreateChat}
            /* TODO: disable this button also if you have single chat
             * with no messages in the chats array */
          />
          <div
            ref={refContainer}
            className="w-full h-full overflow-y-scroll pl-3 pr-0 pt-12 pb-3 rounded-xl"
          >
            {loadingStatus.chats ? (
              <div className="w-full h-full flex justify-center items-center">
                <AiOutlineLoading3Quarters className="mx-auto h-7 w-7 rounded-full animate-spin text-zinc-700" />
              </div>
            ) : (
              <>
                <ChatMessages pwd={pwd} messages={messages} />
                {/* command/prompt inserting */}
                {dispayForm && (
                  <div className="flex flex-col justify-center gap-1">
                    <div className="flex flex-row items-center justify-between">
                      <div className="relative flex flex-row items-center gap-0">
                        <ShellPromptUi type="left-side">
                          <button
                            onClick={handleToggleModes}
                            className="text-xs font-bold font-mono text-white focus:outline-none"
                          >
                            {mode}
                          </button>
                        </ShellPromptUi>
                        <ShellPromptUi type="cwd" content={pwd} />
                        <BsArrow90DegRight className="absolute -left-2 -bottom-[6px] size-5 text-blue-400" />
                        <BsArrow90DegDown className="absolute -left-2 -bottom-[19px] size-5 text-blue-400 rotate-[271deg]" />
                      </div>

                      <div
                        className={`relative flex flex-row justify-start items-center self-start shrink-0 text-white px-2  rounded-s-full rounded-e-full bg-white mr-1`}
                      >
                        <IoTriangleSharp
                          className={`absolute -left-[11px] z-30 rotate-[269deg] text-white h-4 w-5`}
                        />
                        {/*TODO: make the button opens the pdf page used in RAG */}
                        <button
                          className={`text-xs font-thin font-mono text-black focus:outline-none`}
                        >
                          page 2
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 pl-4 pr-1">
                      <form
                        onSubmit={handleSubmit}
                        className="relative w-full p-0 flex items-center justify-start mt-[1px]"
                      >
                        {/* this is used to hightlight the first word user types if the current mode is "Command" 
                        and the that word is included in linux commands array */}
                        {mode == "Command" && (
                          <div className="absolute w-full min-h-[40px] font-spaceMono text-xs text-white bg-transparent pointer-events-none">
                            {keywords.map((word, index) => (
                              <span
                                key={index}
                                className={
                                  index === 0 && currentValueIsCommand
                                    ? "text-yellow-400"
                                    : ""
                                }
                              >
                                {word}{" "}
                              </span>
                            ))}
                          </div>
                        )}
                        <textarea
                          onChange={handleChange}
                          value={msg}
                          maxLength={200}
                          ref={textareaRef}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              const form = e.currentTarget.form;
                              if (form) {
                                form.requestSubmit(); // this will trigger the form's onSubmit handler
                              }
                            }
                          }}
                          className={`min-h-[40px] w-full font-spaceMono text-xs text-white rounded-none border-none focus:outline-none resize-none bg-zinc-900/5  overflow-hidden`}
                        />
                      </form>
                    </div>
                  </div>
                )}
                {loadingStatus.modelAnswer && <div className="loader" />}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Terminal;

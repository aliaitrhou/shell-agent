"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";

import TerminalTopBar from "./terminal-top-bar";
import { message, Mode } from "@/types";
import ChatMessages from "./chat-messages";
import TerminalPrompt from "./terminal-prompt";
import { linuxCommands } from "@/constants";
import { PiSpinnerBold } from "react-icons/pi";
import { commandRunner } from "./command-runner";

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
  openPdfPreview: (n: number) => void;
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
  openPdfPreview,
  onMessageSent,
  chatId,
}) => {
  const [msg, setMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]); // State to manage chat history
  const [messages, setMessages] = useState<message[]>([]);
  // mode is default to prompt
  const [mode, setMode] = useState<Mode>("Prompt");
  const [displayForm, setDisplayForm] = useState(true);
  const [commandsHistory, setCommandsHistory] = useState<string[]>([""]);
  const [pwd, setPwd] = useState("/");

  const [loadingStatus, setLoadingStatus] = useState({
    chats: false,
    modelAnswer: false,
  });

  const refContainer = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      console.error("Missing required fields:", { id, msg, role, mode, cwd });
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target as HTMLTextAreaElement;
    setMsg(el.value);
  };

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
        cwd: pwd,
      },
    ]);
    setChatHistory((prevHistory) => [...prevHistory, `user: ${msg}`]);

    console.log("message is : ", msg);
    // insert non empty user message to db
    if (msg && msg.trim() !== "" && chatId) {
      insertMessagesByChatId(chatId, msg, "user", mode, pwd);
    }

    if (mode == "Prompt") {
      if (msg.trim() === "") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistent",
            text: "done",
            mode: "Command",
            cwd: pwd,
          },
        ]);
        setMsg("");
      } else {
        await getModelAnswer("Prompt");
      }
    } else {
      // with command mode
      switch (msg.trim().toLowerCase()) {
        case "clear":
          setMessages([]);
          setLoadingStatus({ chats: false, modelAnswer: false });
          setDisplayForm(true);
          setMsg("");
          break;
        case "exit":
          // close the terminal
          closeTerminal();
          selectData = {
            model: "",
            semester: "",
          };
          setMsg("");
          break;
        case "":
          // done indicate that input is empty
          setMessages((prev) => [
            ...prev,
            {
              role: "assistent",
              text: "done",
              mode: "Command",
              cwd: "~",
            },
          ]);
          break;
        default:
          await getModelAnswer("Command");
      }
    }
  };

  const getModelAnswer = async (m: Mode) => {
    setLoadingStatus({ chats: false, modelAnswer: true });
    setDisplayForm(false);

    // if the input is "clear" and current mode is "command" clean the terminal (reset the state)
    if (msg.toLowerCase() === "clear" && m == "Command") {
      setMessages([]);
      setLoadingStatus({ chats: false, modelAnswer: false });
      setDisplayForm(true);
      setMsg("");
    } else {
      if (m == "Command") {
        // TODO: link around the working directory
        const message = commandRunner(msg, chatId, "/");
        setMessages((prev) => [...prev, message]);
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
              prevMode: mode,
            }),
          });

          if (!res.ok) {
            throw new Error(
              `Failed to fetch model response: ${res.status} ${res.statusText}`,
            );
          }

          const responseData = await res.json();
          console.log("responseData is : ", responseData);

          const answer = responseData.answer || "";
          const newMode = responseData.newMode;

          // Update chat history
          setChatHistory((prevHistory) => [
            ...prevHistory,
            `assistent: ${answer}`,
          ]);

          // Add the assistant's response
          setMessages((prev) => [
            ...prev,
            {
              role: "assistent",
              text: answer,
              cwd: prev.length > 0 ? prev[prev.length - 1].cwd : "~",
              mode: "Prompt",
            },
          ]);

          // Handle mode switching if newMode is provided
          if (newMode && newMode !== mode) {
            setMode(newMode as Mode);
          }

          // Save the message to database
          if (answer.trim() && chatId) {
            insertMessagesByChatId(chatId, answer, "assistant", "Prompt", pwd);
          }
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
          setDisplayForm(true);
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

  //  auto height for textarea element as user types
  const textareaAutoGrow = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "4px"; // initial size
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    console.log("Messages are : ", messages);
  }, [messages]);

  return (
    <section
      className={`relative w-full h-[92dvh] sm:h-[80dvh] pt-10 bg-zinc-800 rounded-none sm:rounded-xl border-[1px] border-zinc-700/60`}
    >
      <TerminalTopBar
        currentChatId={chatId}
        disableDelete={disableRemoveChat}
        disableCreate={disableCreateChat}
        handleDeleteSession={handleRemoveChat}
        handleToggleSidebar={handleToggleSidebar}
        openSidebar={openSidebar}
        handleAddSession={handleCreateChat}
      />
      <div
        ref={refContainer}
        className="w-full h-full overflow-y-scroll pl-3 py-2"
      >
        {loadingStatus.chats ? (
          <div className="w-full h-[90%] flex justify-center items-center">
            <PiSpinnerBold className="mx-auto size-7 rounded-full animate-spin text-zinc-600/90" />
          </div>
        ) : (
          <>
            <ChatMessages messages={messages} handleClick={openPdfPreview} />
            {/* command/prompt inserting */}
            {displayForm && (
              <TerminalPrompt
                mode={mode}
                pwd={pwd}
                handleToggleModes={handleToggleModes}
              >
                <div className="flex items-center gap-1 pl-4 pr-1">
                  <form
                    onSubmit={handleSubmit}
                    className="relative w-full p-0 flex items-center justify-start mt-[1px]"
                  >
                    {/* this is used to hightlight the first word user types if the current mode is "Command" 
                        if that word is included in linux commands array */}
                    {mode == "Command" && (
                      <div className="absolute w-full font-spaceMono text-xs text-white bg-transparent pointer-events-none">
                        {keywords.map((word, index) => (
                          <span
                            key={index}
                            className={
                              index === 0 && currentValueIsCommand
                                ? "text-orange-700"
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
                      maxLength={250}
                      ref={textareaRef}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          const form = e.currentTarget.form;
                          e.preventDefault();
                          if (form) {
                            form.requestSubmit(); // this will trigger the form's onSubmit handler
                          }
                        }
                      }}
                      onInput={textareaAutoGrow}
                      className={`${mode == "Command" ? "text-white" : ""} w-full font-spaceMono text-xs text-white border-none focus:outline-none resize-none bg-zinc-800/5`}
                    />
                  </form>
                </div>
              </TerminalPrompt>
            )}
            {loadingStatus.modelAnswer && <div className="ml-2 loader" />}
          </>
        )}
      </div>
    </section>
  );
};

export default Terminal;

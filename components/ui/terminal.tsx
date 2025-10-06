"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { message, Mode } from "@/types";
import ChatMessages from "./chat-messages";
import TerminalPrompt from "./terminal-prompt";
import commandRunner from "./../command-runner";
import learnAction from "./../learn-action";
import VimNanoEditor from "./vim-nano-editor";
import { mplus } from "@/app/fonts";
import { MdOutlineHelpOutline } from "react-icons/md";
import Link from "next/link";
import { useEditorStore } from "@/stores/code-editor-store";
import { replaceHomeWithTilde } from "@/utils/current-directory-tilde";
import { usePdfPreviewStore } from "@/stores/use-pdf-store";
import { useTerminalTabs } from "@/stores/terminal-tabs-store";
import LoadingSkeleton from "./loading-skeleton";
import { useTabMessages } from "@/stores/terminal-tab-messages-store";
import TerminalTopBar from "./terminal-top-bar";

interface Props {
  selectData: {
    model: string;
    semester: string;
  };
  closeTerminal: () => void;
  openPdfPreview: () => void;
}

const Terminal: React.FC<Props> = ({
  selectData,
  closeTerminal,
  openPdfPreview,
}) => {
  const [msg, setMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]); // State to manage chat history
  const [displayForm, setDisplayForm] = useState(true);
  const [pwd, setPwd] = useState("~");
  const [renderEditor, setRenderEditor] = useState(false);
  const [modelAnswering, setModelAnswering] = useState(false);
  const [expiryCountdown, setExpiryCountdown] = useState("30:00");
  const [mode, setMode] = useState<Mode>("Prompt");

  const refContainer = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { run, running } = useEditorStore();
  const { page, chapter, updatePdfPreview } = usePdfPreviewStore();
  const { activeChatId } = useTerminalTabs();
  const {
    messages,
    clearMessages,
    setMessages,
    loadMessagesFromDB,
    loading,
    insertMessageToDB,
  } = useTabMessages();

  const { user } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    setRenderEditor(false);
    loadMessagesFromDB(activeChatId);
    setPwd("~");
  }, [activeChatId, loadMessagesFromDB]);


  useEffect(() => {
    const lastMessages = messages.slice(-4); // get only the last 4
    const newHistory = lastMessages.map((message: message) => {
      return message.text !== "empty_message" && message.role === "User"
        ? `User: ${message.text}` : message.role === "ShellOutput" ?
          `ShellOutput: ${message.text}` : `Assistant: ${message.text}`;
    });

    setChatHistory(newHistory); // replace with only the last 4
  }, [messages, activeChatId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target as HTMLTextAreaElement;
    setMsg(el.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      openSignIn();
    }
    const messageContext =
      mode === "Prompt"
        ? {
          pageNumber: page,
          chapterName: chapter,
          containerExpiry: null,
        }
        : {
          pageNumber: null,
          chapterName: null,
          containerExpiry: expiryCountdown,
        };

    setMessages({
      role: "User",
      text: msg,
      mode: mode,
      cwd: pwd,
      ...messageContext,
    });


    // insert non empty user message to db
    if (msg && msg.trim() !== "" && activeChatId) {
      insertMessageToDB({
        chatId: activeChatId,
        text: msg,
        role: "User",
        mode,
        cwd: pwd,
        ...messageContext,
      });
    }

    if (mode == "Prompt") {
      if (msg.trim() === "") {
        const emptyMessageContext = {
          pageNumber: null,
          chapterName: null,
          containerExpiry: expiryCountdown,
        };

        setMessages({
          role: "Assistant",
          text: "empty_message",
          mode: "Command",
          cwd: pwd,
          ...emptyMessageContext,
        });
        setMsg("");
      } else {
        await getModelAnswer("Prompt");
      }
    } else {
      const trimmedMsg = msg.trim();

      const runScriptPattern = /^\.\/([\w-]+\.sh)$/;

      const match = trimmedMsg.match(runScriptPattern);
      if (match) {
        const filename = match[1]; // only "myscript.sh"

        console.log("script detected, filename:", filename);
        setMsg("");
        setDisplayForm(false);
        const output = await run(pwd, filename, activeChatId);

        setMessages({
          role: "ShellOutput",
          text: output,
          mode: "Command",
          cwd: pwd,
          pageNumber: null,
          chapterName: null,
          containerExpiry: expiryCountdown,
        });
        setDisplayForm(true);
        return;
      }

      const openEditorPattern = (command: string): boolean => {
        const editorPattern = /^(vim|nano)(\s+\S+)?$/;
        return editorPattern.test(command);
      };

      if (openEditorPattern(trimmedMsg)) {
        setRenderEditor(true);
      } else if (trimmedMsg == "clear") {
        clearMessages();
        // setModelAnswering(false);
        setDisplayForm(true);
        setMsg("");
      } else if (trimmedMsg == "exit") {
        // close the terminal
        closeTerminal();
        selectData = {
          model: "",
          semester: "",
        };
        setMsg("");
      } else if (trimmedMsg == "") {
        // empty_message indicate that input is empty user press Enter with empty input
        setMessages({
          role: "Assistant",
          text: "empty_message",
          mode: "Command",
          cwd: "~",
          pageNumber: null,
          chapterName: null,
          containerExpiry: expiryCountdown,
        });
      } else {
        await getModelAnswer("Command");
      }
    }
  };

  const getModelAnswer = async (m: Mode) => {
    setDisplayForm(false);

    // if the input is "clear" and current mode is "command" clean the terminal (reset the state)
    if (msg.toLowerCase() === "clear" && m == "Command") {
      clearMessages();
      setDisplayForm(true);
      setMsg("");
    } else {
      if (m == "Command") {
        try {
          const { shellOutput, newCwd, remainingTime } = await commandRunner({
            command: msg,
            chatId: activeChatId,
            currentWorkingDirectory: pwd,
          });
          const newCwdTilde = replaceHomeWithTilde(newCwd, "/home/user");
          setExpiryCountdown(remainingTime);

          // Update UI
          setMessages({
            role: "ShellOutput",
            text: shellOutput.output,
            cwd: newCwdTilde,
            mode: "Command",
            pageNumber: null,
            chapterName: null,
            containerExpiry: remainingTime,
          });

          // Add the new message to db
          insertMessageToDB({
            chatId: activeChatId,
            text: shellOutput.output || "empty_message",
            role: "ShellOutput",
            mode: "Command",
            cwd: newCwdTilde,
            pageNumber: null,
            chapterName: null,
            containerExpiry: remainingTime.toString(),
          });

          // add the new message chat history
          setChatHistory((prevHistory) => [
            ...prevHistory,
            `ShellOutput: ${shellOutput.output}`,
          ]);

          setPwd(newCwdTilde);
        } catch (error) {
          console.error(
            "There was an error fetching from cmd endpoint!",
            error,
          );
        } finally {
          // DONE: display the form after the model have respond.
          setMsg("");
          setDisplayForm(true);
        }
      } else {
        setModelAnswering(true);
        try {
          // TODO: Make the model aware of command messages by merging them with chatHistory
          const { answer, pdfData } = await learnAction(
            msg,
            chatHistory,
            selectData.model,
            selectData.semester,
          );

          updatePdfPreview(pdfData);

          // Add the assistant's response
          setMessages({
            role: "Assistant",
            text: answer,
            cwd: "empty_cwd", // cause when lanter displaying messages with `chat-messages` it wount need cwd
            mode: "Prompt",
            pageNumber: pdfData.page,
            chapterName: pdfData.chapter,
            containerExpiry: null,
          });

          insertMessageToDB({
            chatId: activeChatId,
            text: answer,
            role: "Assistant",
            mode: "Prompt",
            cwd: pwd,
            pageNumber: pdfData.page,
            chapterName: pdfData.chapter,
            containerExpiry: null,
          });

        } catch (error) {
          console.error("Error fetching model response:", error);
        } finally {
          setModelAnswering(false);
          setDisplayForm(true);
          setMsg("");
        }
      }
    }
  };

  const handleCloseVimNanoEditor = (output: string) => {
    setRenderEditor(false);
    setMsg("");

    // Update UI
    setMessages({
      role: "ShellOutput",
      text: output,
      cwd: pwd,
      mode: "Command",
      pageNumber: null,
      chapterName: null,
      containerExpiry: expiryCountdown,
    });

    // add the new message to db
    insertMessageToDB({
      chatId: activeChatId,
      text: output || "empty_message",
      role: "ShellOutput",
      mode: "Command",
      cwd: pwd,
      pageNumber: null,
      chapterName: null,
      containerExpiry: expiryCountdown,
    });

  };

  //TODO: this useEffect should run every time the user toggle between chats
  // so a new chatHistory/commandsHistory created which means that the models
  // would have a new memory each time.
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

  //  auto height for textarea element as user types
  const textareaAutoGrow = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "4px"; // initial size
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  return (
    <section className="relative h-[80dvh] md:h-[75dvh] w-full flex flex-col pt-8 sm:pt-10 bg-zinc-800 rounded-md sm:rounded-xl border-[2px] border-zinc-700/30">
      <TerminalTopBar
        chatId={activeChatId}
        // close editor if delete/create chats or swaps between them.
        closeEditor={() => {
          setMsg("");
          setRenderEditor(false);
        }}
      />
      {renderEditor ? (
        <VimNanoEditor
          sessionId={activeChatId}
          scriptCwd={pwd}
          commandMsg={msg}
          closeEditorCallback={(t: string) => handleCloseVimNanoEditor(t)}
        />
      ) : (
        <div
          ref={refContainer}
          className="flex-1 min-h-0 w-full overflow-y-auto pl-3 pt-4 lg:pt-4 pb-3 sm:pb-4 md:pb-6"
        >
          {loading ? (
            <div className="w-full h-full space-y-8">
              <LoadingSkeleton />
            </div>
          ) : (
            <>
              <ChatMessages
                messages={messages}
                handleClick={() => openPdfPreview()}
              />
              {/* command/prompt inserting */}
              {displayForm && (
                <TerminalPrompt
                  mode={mode}
                  pwd={pwd}
                  chapterName={null}
                  pageNumber={null}
                  containerExpiry={"Pending"}
                  handleToggleModes={handleToggleModes}
                >
                  <div className="flex items-center gap-1 pl-4 pr-1">
                    <form
                      onSubmit={handleSubmit}
                      className="relative w-full p-0 flex items-center justify-start mt-[1px]"
                    >
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
                        className={`w-full ${mplus.className} text-xs sm:text-[13px] border-[1px] text-white border-none focus:outline-none resize-none bg-transparent`}
                      />
                    </form>
                  </div>
                </TerminalPrompt>
              )}
              {(modelAnswering || running) && <div className="ml-2 loader" />}
            </>
          )}
        </div>
      )}
      <Link
        href="/user-guide"
        target="_blank"
        className={`absolute bottom-2 right-2 text-zinc-700 rounded-full`}
      >
        <MdOutlineHelpOutline className="text-2xl" />
      </Link>
    </section>
  );
};

export default Terminal;

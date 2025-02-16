"use client";

import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { PlaceholdersAndVanishInput } from "./placeholders-and-vanish-input";
import { useClerk, useUser } from "@clerk/nextjs";
import TerminalToolBar from "./terminal-topbar";
import { message } from "@/types";
import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream.mjs";
import MarkdownRenderer from "./MarkdownRenderer";
import AimationLayout from "./animation-layout";
import Image from "next/image";
import Footer from "./footer";

interface Props {
  setRenderChat: (bar: boolean) => void;
}

const Chat: React.FC<Props> = ({ setRenderChat }) => {
  const [msg, setMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]); // State to manage chat history
  const [messages, setMessages] = useState<message[]>([
    {
      role: "user",
      m: "",
    },
    {
      role: "assistent",
      m: "",
    },
  ]);
  const refContainer = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target as HTMLInputElement;
    setMsg(el.value.charAt(0).toUpperCase() + el.value.slice(1));
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      openSignIn();
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        m: msg,
      },
    ]);
    setChatHistory((prevHistory) => [...prevHistory, `user: ${msg}`]);
    await getModelAnswer();
  };

  const getModelAnswer = async () => {
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
            updatedHistory[updatedHistory.length - 1].startsWith("assistent:")
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
            updatedMessages[updatedMessages.length - 1].m = currentMessage; // Update the last message
          } else {
            updatedMessages.push({ role: "assistent", m: currentMessage }); // If no assistant message exists, create a new one
          }

          return updatedMessages;
        });
      });
      runner.on("error", (err) => {
        console.error("Streaming error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistent",
            m: "Something went wrong while processing your request.",
          },
        ]);
      });
    } catch (error) {
      console.error("Error fetching model response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistent", m: "An error occurred. Please try again later." },
      ]);
    }
  };

  const scroll = () => {
    if (refContainer.current) {
      const { offsetHeight, scrollHeight, scrollTop } =
        refContainer.current as HTMLDivElement;

      if (scrollHeight >= scrollTop + offsetHeight) {
        refContainer.current.scrollTo(0, scrollHeight + 150);
      }
    }
  };

  useEffect(() => {
    const hasMessages = messages.some((message) => message.m.trim() !== "");
    setRenderChat(hasMessages);
    scroll();
  }, [messages, setRenderChat]); // Run effect whenever messages change

  const hasMessages = messages.some((message) => message.m.trim() !== "");

  const MemoizedMarkdownRenderer = React.memo(MarkdownRenderer);

  return (
    <div
      className={`w-full ${hasMessages ? "h-full px-2 sm:px-4 space-y-3" : "space-y-6"} flex flex-col items-center shadow-2xl`}
    >
      {hasMessages && user ? (
        <AimationLayout>
          <section
            ref={refContainer}
            className="relative h-full overflow-y-auto w-full space-y-2 bg-zinc-800/90 rounded-xl shadow-md border-[1px] border-zinc-700 pb-4"
          >
            <TerminalToolBar setMessages={setMessages} />
            {messages
              .filter((message) => message.m.trim() !== "")
              .map((msg, index) => (
                <div
                  key={index}
                  className="w-full flex gap-0 sm:gap-2 items-start font-mono px-2 sm:px-3"
                >
                  {msg.role == "user" && (
                    <div className="flex flex-row justify-start items-center self-start shrink-0">
                      <Image
                        src={user.imageUrl}
                        alt={"user image"}
                        width={20}
                        height={20}
                        className="rounded-full w-5 h-5 border border-slate-400 mr-1"
                      />
                      <p className="text-sm sm:text-md text-light text-slate-400 whitespace-nowrap">
                        /Desktop/~$
                      </p>
                    </div>
                  )}
                  <div
                    className={`max-w-full text-sm sm:text-md font-light leading-0 ${
                      msg.role == "assistent" ? "text-green-500" : "text-white"
                    } font-spaceMono break-words`}
                  >
                    {msg.role == "user" ? (
                      <p className="ml-1 w-full break-words">{msg.m}</p>
                    ) : (
                      <MemoizedMarkdownRenderer>
                        {msg.m}
                      </MemoizedMarkdownRenderer>
                    )}
                  </div>
                </div>
              ))}
          </section>
        </AimationLayout>
      ) : (
        <p className="font-kanit text-[1.8rem] sm:text-4xl md:text-[3rem] font-bold text-center md:mb-2">
          What is the mession today?
        </p>
      )}
      <div className={`w-full mx-auto ${hasMessages && "px-0 sm:px-12"}`}>
        <PlaceholdersAndVanishInput
          placeholders={[
            "How does the `awk` command works ?",
            "What are the flags of `wc` command ?",
            "How to switch between users ?",
          ]}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
        <Footer />
      </div>
    </div>
  );
};

export default Chat;

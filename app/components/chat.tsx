"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { PlaceholdersAndVanishInput } from "./placeholders-and-vanish-input";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import TerminalToolBar from "./terminal-topbar";
import { message } from "@/types";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream.mjs";
import MarkdownRenderer from "./MarkdownRenderer";
import AimationLayout from "./animation-layout";

interface Props {
  setRenderChat: (bar: boolean) => void;
}

const chatHistory = new Map();

const Chat: React.FC<Props> = ({ setRenderChat }) => {
  const [msg, setMsg] = useState("");
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

  const handlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target as HTMLInputElement;
    setMsg(el.value);
  };

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

    await getModelAnswer();
  };

  const getModelAnswer = async () => {
    messages.map((msg, index) => {
      chatHistory.set(`${index % 2 == 0 ? "user" : "assistent"}`, msg.m);
    });

    console.log(chatHistory);

    const res = await fetch("/api/model", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: msg,
        chatHistory: Object.fromEntries(chatHistory),
      }),
    });

    const runner = ChatCompletionStream.fromReadableStream(res.body!);
    let currentMessage = "";

    // in order to steam the response
    runner.on("content", (delta) => {
      currentMessage += delta;

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
      className={`w-[350] sm:min-w-full ${hasMessages ? "px-40 space-y-6" : "space-y-8"} flex flex-col  items-center`}
    >
      {hasMessages && user ? (
        <AimationLayout>
          <section
            ref={refContainer}
            className="relative flex-1 max-h-[800px] overflow-y-auto w-full space-y-2 bg-gray-600/30 rounded-xl shadow-custom border-[1px] border-gray-600/30 pb-4"
          >
            <TerminalToolBar setMessages={setMessages} />
            {messages
              .filter((message) => message.m.trim() !== "")
              .map((msg, index) => (
                <div
                  key={index}
                  className={`w-full flex gap-2 items-center  font-mono px-4`}
                >
                  <div className=" flex flex-row justify-center items-center self-start ">
                    {msg.role == "user" && (
                      <>
                        <Image
                          src={user.imageUrl}
                          alt={"user image"}
                          width={20}
                          height={20}
                          className="rounded-full w-5 h-5 border border-slate-400 mr-2"
                        />

                        <p className="text-md text-light text-slate-400">
                          {user.username}/
                        </p>
                        <ChevronRightIcon className="w-4 h-4  font-bold text-xl text-slate-400" />
                      </>
                    )}
                  </div>
                  <div
                    className={`max-w-[95%] rounded-lg font-light ${msg.role == "assistent" ? "text-green-600" : "text-white"} `}
                  >
                    {msg.role == "user" ? (
                      <p>{msg.m}</p>
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
        <p className="text-xl sm:text-2xl md:text-3xl font-bold font-mono">
          What is the mession today?
        </p>
      )}
      <PlaceholdersAndVanishInput
        placeholders={[
          "How does the ls command works",
          "What is the available flags of wc command ?",
          "Blah blah blah, New boring chat app ?",
        ]}
        onChange={handlChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Chat;

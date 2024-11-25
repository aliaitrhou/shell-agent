"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { PlaceholdersAndVanishInput } from "./placeholders-and-vanish-input";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import TerminalToolBar from "./terminal-topbar";
import { message } from "@/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import assistentImage from "@/public/assistent.webp";

interface Props {
  setRenderChat: (bar: boolean) => void;
}

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

    console.log("Message : ", msg);
    //TODO: request to model api
    const answer = await getModelAnswer();

    setMessages((prev) => [
      ...prev,
      {
        role: "assistent",
        m: answer,
      },
    ]);
  };

  const getModelAnswer = async () => {
    const res = await fetch("/api/model", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: msg,
      }),
    });

    const data = await res.json();
    return data.answer;
  };

  useEffect(() => {
    const hasMessages = messages.some((message) => message.m.trim() !== "");
    setRenderChat(hasMessages);
  }, [messages, setRenderChat]); // Run effect whenever messages change

  const hasMessages = messages.some((message) => message.m.trim() !== "");
  return (
    <div
      className={`w-[350] sm:min-w-full ${hasMessages ? "px-40 space-y-6" : "space-y-8"} flex flex-col  items-center `}
    >
      {hasMessages && user ? (
        <section className="relative flex-1 max-h-[800px] overflow-y-auto w-full space-y-2 bg-gray-600/30 rounded-xl pt-12 px-4">
          <TerminalToolBar setMessages={setMessages} />
          {messages
            .filter((message) => message.m.trim() !== "")
            .map((msg, index) => (
              <div
                key={index}
                className={`w-full flex gap-2 items-center ${msg.role == "assistent" ? "justify-start " : "justify-end"} `}
              >
                {msg.role == "assistent" ? (
                  <>
                    <div className="flex flex-row items-center ">
                      <Image
                        src={assistentImage}
                        alt={"user image"}
                        width={20}
                        height={20}
                        className="rounded-md w-6 h-6 border border-white"
                      />
                      <ChevronRightIcon className="w-5 h-5 text-white font-bold text-xl" />
                    </div>
                    <div
                      className={`max-w-[75%] rounded-lg font-light text-white`}
                    >
                      <p>{msg.m}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={`max-w-[75%] rounded-lg font-light text-green-600`}
                    >
                      <p>{msg.m}</p>
                    </div>
                    <div className="flex flex-row items-center ">
                      <ChevronLeftIcon className="w-5 h-5 text-white font-bold text-xl" />
                      <Image
                        src={user.imageUrl}
                        alt={"user image"}
                        width={20}
                        height={20}
                        className="rounded-md w-6 h-6 border border-white"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
        </section>
      ) : (
        <p className="text-xl sm:text-2xl md:text-3xl font-bold">
          What is the mession today
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

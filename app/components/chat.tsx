"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { PlaceholdersAndVanishInput } from "./placeholders-and-vanish-input";
import { useClerk, useUser } from "@clerk/nextjs";

interface Props {
  setRenderChat: (bar: boolean) => void;
}

const Chat: React.FC<Props> = ({ setRenderChat }) => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([
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
  const { openSignUp } = useClerk();

  const handlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target as HTMLInputElement;
    setMsg(el.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      openSignUp();
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
  };

  useEffect(() => {
    const hasMessages = messages.some((message) => message.m.trim() !== "");
    setRenderChat(hasMessages);
  }, [messages, setRenderChat]); // Run effect whenever messages change

  const hasMessages = messages.some((message) => message.m.trim() !== "");
  return (
    <div
      className={`w-[350] sm:min-w-full ${hasMessages ? "px-40 space-y-6" : "space-y-8"} flex flex-col  items-center border-2 border-green-400 border-dashed`}
    >
      {hasMessages ? (
        <section className="flex-1 w-full border-2 border-orange-500 border-dashed">
          hello
          {/* {messages.map((msg) => { */}
          {/*   <div>{msg.m}</div>; */}
          {/* })} */}
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

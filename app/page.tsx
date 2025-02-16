"use client";

import React, { useState } from "react";
import Chat from "./components/chat";

export default function Home() {
  const [renderChat, setRenderChat] = useState(true);
  return (
    <main
      className={`h-[90dvh] flex text-white ${renderChat ? "px-0 sm:px-4 md:px-10 lg:px-32 xl:px-52" : "justify-center items-center"}`}
    >
      <Chat setRenderChat={setRenderChat} />
    </main>
  );
}

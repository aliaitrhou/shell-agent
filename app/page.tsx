"use client";

import React, { useState } from "react";
import Chat from "./components/chat";

export default function Home() {
  const [renderChat, setRenderChat] = useState(true);
  return (
    <main
      className={`h-[80dvh] flex justify-center items-center text-white ${renderChat ? "px-0 sm:px-4 md:px-10 lg:px-32 xl:px-52" : ""}`}
    >
      <Chat setRenderChat={setRenderChat} />
    </main>
  );
}

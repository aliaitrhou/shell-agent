"use client";

import React, { useState } from "react";
import Chat from "./components/chat";

export default function Home() {
  const [renderChat, setRenderChat] = useState(true);
  return (
    <main className="h-[100dvh] text-white px-0 sm:px-4 md:px-8">
      <section
        className={`h-full flex ${renderChat ? "mb-8 px-4 sm:px-8 md:px-20 py-10" : "justify-center items-center"}`}
      >
        <Chat setRenderChat={setRenderChat} />
      </section>
    </main>
  );
}

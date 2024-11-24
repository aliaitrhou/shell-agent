"use client";

import React, { FormEvent, useState } from "react";
import { PlaceholdersAndVanishInput } from "./placeholders-and-vanish-input";
import { useClerk, useUser } from "@clerk/nextjs";

const Form = () => {
  const [msg, setMsg] = useState("");
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

    console.log("Message : ", msg);
    //TODO: request to model api
  };

  return (
    <div className="w-[350] sm:min-w-full flex flex-col space-y-4 items-center">
      <p className="text-xl sm:text-2xl md:text-3xl font-bold">
        What is the mession today
      </p>
      <PlaceholdersAndVanishInput
        placeholders={[
          "How does the ls command works",
          "What is the available flags of wc command ?",
          "Test",
        ]}
        onChange={handlChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Form;

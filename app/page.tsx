"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Terminal from "@/components/ui/terminal";
import { useClerk, useUser } from "@clerk/clerk-react";
import PdfPreview from "@/components/ui/pdf-preview";
import LandingView from "@/components/ui/landing-view";
import { userAlertStore } from "@/stores/use-alert-store";
import { useTerminalTabs } from "@/stores/terminal-tabs-store";
import StatusAlert from "@/components/ui/alert";

export default function Home() {
  const [start, setStart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectData, setSelectData] = useState({
    model: "",
    semester: "",
  });
  const [displayPdf, setDisplayPdf] = useState(false);

  const { setAlert, message, type } = userAlertStore();

  const { user, isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const { activeChatId, setActiveChatId, setChats } = useTerminalTabs();

  // create chat callback
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/chats");

        if (!response.ok) {
          setAlert("Failed to fetch chats, please referesh!", "error");
          return;
        }

        const chatsData = await response.json();
        setChats(chatsData);

        if (!activeChatId && chatsData.length > 0) {
          setActiveChatId(chatsData[0].id);
        }
      } catch (e) {
        console.log("error: ", e);
      } finally {
        setLoading(false);
      }
    };

    if (user && start) fetchChats();
  }, [user, start, setActiveChatId, setChats, activeChatId, setAlert]);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target as HTMLSelectElement;
    setSelectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartButtonClick = () => {
    if (!isLoaded) {
      setAlert("User info not Loaded yet!", "warning");
      return;
    }

    // send the user to log in if they are not
    if (!user) {
      return openSignIn();
    }
    if (!selectData.model) {
      setAlert("Model select is Required!", "warning");
      return;
    }

    if (!selectData.semester) {
      setAlert("Semester select is Required!", "warning");
      return;
    }

    console.log("isSignedIn: ", isSignedIn);
    if (isSignedIn) {
      setStart(true);
    }
  };

  return (
    <main>
      {!start && <div className={"gradient_background"}></div>}
      {message && (
        <div className="absolute top-0 w-full flex justify-center">
          <StatusAlert message={message} type={type} />
        </div>
      )}
      {start && activeChatId ? (
        <div
          className={`flex flex-1 min-h-0 w-full md:w-[95%] lg:w-[90%] ${displayPdf ? "xl:w-[90%]" : "xl:w-[80%]"} mx-auto flex-col md:flex-row gap-4 px-4 p-4 md:px-6 lg:pt-14`}
        >
          <Terminal
            closeTerminal={() => setStart(false)}
            selectData={selectData}
            openPdfPreview={() => setDisplayPdf(true)}
          />
          {displayPdf && (
            <PdfPreview handleClosePdf={() => setDisplayPdf(false)} />
          )}
        </div>
      ) : (
        <LandingView
          handleClick={handleStartButtonClick}
          loading={loading}
          handleChange={handleSelectChange}
        />
      )}
    </main>
  );
}

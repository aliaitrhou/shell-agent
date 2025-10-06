import { message } from "@/types";
import { create } from "zustand";

interface TerminalTabState {
  messages: message[];
  clearMessages: () => void;
  setMessages: (msg: message) => void;
  loading: boolean;
  loadMessagesFromDB: (chatId: string) => void;
  insertMessageToDB: (msg: message) => void;
  errorCatch: Error | null;
}

export const useTabMessages = create<TerminalTabState>((set) => ({
  messages: [],
  loading: false,
  errorCatch: null,
  loadMessagesFromDB: async (chatId: string) => {
    set({ loading: true });
    console.log("chat id now is : ", chatId);
    try {
      const res = await fetch(`/api/messages/${chatId}`);
      const currentChatData = await res.json();
      console.log("LoadmsgsFromDB - fetched messages are : ", currentChatData);
      set({
        messages: currentChatData,
      });
    } catch (error) {
      console.error("There was an error loading messages: ", error);
      set({
        errorCatch: new Error(`Failed to load messages, error : ${error}`),
      });
    } finally {
      set({ loading: false });
    }
  },
  setMessages: (msg: message) => {
    set((state) => ({
      messages: [...state.messages, msg],
    }));
  },
  clearMessages: () => {
    set({
      messages: [],
    });
  },
  insertMessageToDB: async (msg: message) => {
    // check for valid inputs before making the request
    if (!msg.chatId || !msg.text || !msg.role || !msg.mode || !msg.cwd) {
      console.error("Missing required fields:", msg);
      set({
        errorCatch: new Error("Missing required fields"),
      });
      return;
    }

    // Mode-specific validation
    if (msg.mode === "Prompt") {
      // For Prompt mode, we expect pageNumber and chapterName
      if (!msg.pageNumber || !msg.chapterName) {
        console.error(
          "Missing Prompt mode fields:",
          msg.pageNumber,
          msg.chapterName,
        );
        set({
          errorCatch: new Error(
            `Missing Prompt mode fields:
          ${msg.pageNumber}
          ${msg.chapterName}`,
          ),
        });
        return;
      }
    }

    if (msg.mode === "Command") {
      // For Command mode, we expect containerExpiry
      if (!msg.containerExpiry) {
        console.error("Missing Command mode field:", msg.containerExpiry);
        set({
          errorCatch: new Error(
            `Missing Command mode field: ${msg.containerExpiry}`,
          ),
        });
        return;
      }
    }

    const response = await fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
      // chatId,
      // text,
      // role: role,
      // mode,
      // cwd,
      // pageNumber,
      // chapterName,
      // containerExpiry,
    });

    if (!response.ok) {
      console.error("Failed to insert message:", response.statusText);
      set({
        errorCatch: new Error(
          `Failed to insert message: ${response.statusText}`,
        ),
      });
      return;
    }

    await response.json();
  },
}));

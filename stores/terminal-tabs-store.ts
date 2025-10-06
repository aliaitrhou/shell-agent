import { create } from "zustand";
import { ChatProps } from "@/types";
import { userAlertStore } from "./use-alert-store";

interface TerminalTabsProps {
  chats: ChatProps[];
  activeChatId: string;
  setChats: (chats: ChatProps[]) => void;
  setActiveChatId: (chatId: string) => void;
  // // TODO: limit users to 8 chats
  // disableCreateChat={type === "loading"}
  // type from userAlertStore()
  handleAddChat: () => void;
  getChatInfo: (chatId: string) => ChatProps;
  disableRemoveChat: boolean;
  disableAddChat: boolean;
  handleRenameChat: (chatId: string, newName: string) => void;
  handleRemoveChat: (chatId: string) => void;
  catchError: Error | null;
}

export const useTerminalTabs = create<TerminalTabsProps>((set, get) => ({
  chats: [],
  activeChatId: "",
  disableRemoveChat: false,
  disableAddChat: false,
  catchError: null,
  getChatInfo: (chatId: string) => {
    const { chats } = get();
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) {
      userAlertStore.getState().setAlert("Chat not found!", "warning");
      throw new Error(`Chat with id ${chatId} not found`);
    }
    return chat;
  },
  setActiveChatId: (chatId: string) => {
    set((state) => {
      state.chats.map((chat) => {
        if (chat.id == chatId && chat.closedTab) {
          userAlertStore
            .getState()
            .setAlert("This chat has been exipred! Delete it.", "warning");
        }
      });

      return {
        activeChatId: chatId,
      };
    });
  },
  setChats: (chats: ChatProps[]) => {
    set({
      chats,
      disableRemoveChat: chats.length <= 1,
    });
  },
  handleAddChat: async () => {
    const state = useTerminalTabs.getState();

    if (state.disableAddChat) return;

    set({ disableAddChat: true });
    userAlertStore.getState().setAlert("Creating New Chat", "loading");

    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Untitled Tab",
        }),
      });

      if (!response.ok) {
        console.error("Failed to create chat");
        userAlertStore
          .getState()
          .setAlert("Failed to create New chat!", "error");
      }

      const { message, status, chat } = await response.json();

      const children = `<div>test</div>`

      userAlertStore.getState().setAlert(message, status, children);

      if (chat) {
        set({
          chats: [...state.chats, { ...chat, messageCount: 0 }],
          activeChatId: chat.id,
        });
      }
    } catch (error) {
      console.error(error);
      userAlertStore.getState().setAlert("Failed to create New Chat!", "error");
    } finally {
      set({ disableAddChat: false });
    }
  },
  handleRenameChat: async (chatId: string, newName: string) => {
    userAlertStore.getState().setAlert("Reniming chat...", "loading");
    try {
      const response = await fetch("/api/chats", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, newName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update chat name");
      }
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId ? { ...chat, name: newName } : chat,
        ),
      }));
      //TODO: set the alert message/status from response
      userAlertStore
        .getState()
        .setAlert(`Chat Renamed successfully to: ${newName}`, "success");
    } catch (error) {
      set({
        catchError: new Error(`Failed to rename chat: ${error}`),
      });
      userAlertStore.getState().setAlert("Failed to Rename chat", "error");
    }
  },
  handleRemoveChat: async (chatId: string) => {
    const state = useTerminalTabs.getState();

    // block if already removing
    if (state.disableRemoveChat) return;

    set({ disableRemoveChat: true });

    userAlertStore.getState().setAlert("Deleting chat...", "loading");
    try {
      const response = await fetch("/api/chats", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete chat!");
      }

      const { message, status } = await response.json();

      userAlertStore.getState().setAlert(message, status);

      // update state -> UI
      // set((state) => {
      //   const updatedChats = state.chats.filter((chat) => chat.id !== chatId);
      //   return {
      //     chats: updatedChats,
      //     activeChatId:
      //       state.activeChatId === chatId
      //         ? state.chats[0].id
      //         : state.activeChatId,
      //     disableRemoveChat: updatedChats.length <= 1,
      //   };
      // });
      set((state) => {
        const removedIdx = state.chats.findIndex((c) => c.id === chatId);
        const updatedChats = state.chats.filter((c) => c.id !== chatId);

        let nextActive = state.activeChatId;

        if (state.activeChatId === chatId) {
          if (updatedChats.length === 0) {
            nextActive = "";
          } else if (removedIdx < updatedChats.length) {
            // choose the neighbor that slid into the same position
            nextActive = updatedChats[removedIdx].id;
          } else {
            // deleted the last one; choose the new last
            nextActive = updatedChats[updatedChats.length - 1].id;
          }
        }

        return {
          chats: updatedChats,
          activeChatId: nextActive,
          disableRemoveChat: updatedChats.length <= 1,
        };
      });
    } catch (error) {
      set({
        catchError: new Error(`Error deleting chat ${error}`),
      });
      userAlertStore
        .getState()
        .setAlert("Error while deleting chat...", "error");
    } finally {
      set({ disableRemoveChat: false });
    }
  },
}));

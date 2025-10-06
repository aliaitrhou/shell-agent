export type message = {
  chatId?: string;
  id?: string;
  role: "User" | "Assistant" | "ShellOutput";
  cwd: string;
  mode: Mode;
  text: string;
  pageNumber?: number | null;
  chapterName?: string | null;
  containerExpiry?: string | null;
};

export interface ChatProps {
  id: string;
  createdAt: string;
  name: string;
  closedTab: boolean;
}

export type Mode = "Prompt" | "Command";

export type ModeStatus = "Page" | "Countdown";

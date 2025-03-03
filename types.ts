export type message = {
  chatId?: string;
  createdAt?: string;
  id?: string;
  role: "user" | "assistent";
  cwd?: string;
  mode?: Mode;
  text: string;
};

export interface ChatProps {
  id: string;
  createdAt: string;
  name: string;
  messageCount: number;
}

export type Mode = "Prompt" | "Command";

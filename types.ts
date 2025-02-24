export type message = {
  chatId?: string;
  createdAt?: string;
  id?: string;
  role: "user" | "assistent";
  text: string;
};

export interface ChatProps {
  id: string;
  createdAt: string;
  name: string;
}

export type Mode = "Prompt" | "Command";

import { create } from "zustand";

export interface AlertProps {
  message: string | null;
  type?: string | null;
  children?: React.ReactNode;
}

interface AlertStoreProps extends AlertProps {
  setAlert: (text: string, status: string, children?: React.ReactNode) => void;
  clearAlert: () => void;
}

export const userAlertStore = create<AlertStoreProps>((set) => ({
  message: null,
  type: null,
  setAlert: (text: string, status: string, children?: React.ReactNode) => {
    set({
      message: text,
      type: status,
      children
    });
    setTimeout(() => {
      set({ message: null, type: null, children: undefined });
    }, 6000);
  },
  clearAlert: () => set({ message: null, type: null, children: undefined }),
}));

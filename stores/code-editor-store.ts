import { create } from "zustand";

interface codeEditorManagerProps {
  saveResult: string | null;
  runResult: string | null;
  fileContent: string | null;
  run: (
    dir: string,
    fileName: string,
    sessionId: string,
    content?: string,
  ) => Promise<string>;
  save: (
    dir: string,
    fileName: string,
    content: string,
    sessionId: string,
  ) => Promise<string>;
  read: (dir: string, fileName: string, sessionId: string) => Promise<boolean>;
  running: boolean;
  saving: boolean;
  reading: boolean;
  ErrorHandler: Error | null | undefined
}

export const useEditorStore = create<codeEditorManagerProps>((set) => ({
  saveResult: null,
  runResult: null,
  fileContent: null,
  running: false,
  saving: false,
  reading: false,
  ErrorHandler: null,
  run: async (
    dir: string,
    fileName: string,
    sessionId: string,
    content?: string,
  ) => {
    console.log("Running script:", fileName, "in dir:", dir);

    try {
      set({ running: true });

      const res = await fetch(`/api/scripts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "run",
          filename: fileName,
          content,
          cwd: dir,
          sessionId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to run script!");
      }

      const data = await res.json();
      set({
        runResult: data.output,
        ErrorHandler: null,
        running: false,
      });

      return data.output;
    } catch (err) {
      console.error(`Failed to run script: ${err}`)
      set({
        ErrorHandler: new Error("Error running script"),
        running: false,
      });
      return "Failed to run script";
    }
  },
  save: async (
    dir: string,
    fileName: string = "file.txt",
    content: string,
    sessionId: string,
  ) => {
    set({ saving: true });
    console.log("Saving file:", fileName, "in dir:", dir);

    try {
      const res = await fetch(`/api/scripts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "save",
          filename: fileName,
          content,
          cwd: dir,
          sessionId,
        }),
      });

      if (!res.ok) {
        throw new Error("There was an error");
      }

      const data = await res.json();

      set({
        saveResult: data.message,
        saving: false,
        ErrorHandler: null,
      });

      return data.message;
    } catch (err) {
      console.error(`Failed to save script: ${err}`)
      set({
        saving: false,
        ErrorHandler: new Error("Error saving script!")
      });
      return "Failed to save";
    }
  },
  read: async (dir: string, fileName: string, sessionId: string) => {
    console.log("Reading file:", fileName, "in dir:", dir);

    const exists = await fileExistsInContainer(fileName, dir, sessionId);


    console.log("file of ", fileName, "existense is : ", exists);

    if (exists) {
      set({ reading: true });
      try {
        const res = await fetch(`/api/scripts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "read",
            filename: fileName,
            cwd: dir,
            sessionId,
          }),
        });

        if (!res.ok) {
          throw new Error("There was an error");
        }

        const data = await res.json();

        set({
          fileContent: data.content,
          reading: false,
          ErrorHandler: null,
        });
        return true;
      } catch (err) {
        console.error(`Failed to read script: ${err}`)
        set({
          ErrorHandler: new Error("Failed to read script!"),
          reading: false,
        });
        return false;
      }
    } else {
      set({ fileContent: "# Scripts editor..." }); // optionally start with empty content
      return false;
    }
  },
}));

async function fileExistsInContainer(
  filename: string,
  dir: string,
  sessionId: string,
) {
  const res = await fetch("/api/scripts-check", {
    method: "POST",
    body: JSON.stringify({ filename, dir, sessionId }),
  });

  console.log("Checking file existence response status:", res.status);

  if (!res.ok) {
    throw new Error("Failed to check file existence");
  }

  const json = await res.json();
  return json.exists;
}

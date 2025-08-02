"use client";

import { lexend, mplus } from "@/app/fonts";
import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { scriptsManager } from "../scripts-runner";
import ButtonHoverEffect from "./button-hover-effect";

type EditorProps = {
  sessionId: string;
  scriptCwd: string;
  commandMsg: string;
  closeEditorCallback: (t: string) => void; // close iditor and give it the result back
};

const VimNanoEditor: React.FC<EditorProps> = ({
  sessionId,
  scriptCwd,
  commandMsg,
  closeEditorCallback,
}) => {
  const [editorContent, setEditorContent] = useState(
    "# This is the editor where you can write/run your scripts...",
  );
  const [running, setRunning] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  const handleAction = async (action: string) => {
    const parts = commandMsg.split(/\s+/);
    const filename = parts[1] || "newfile.txt";

    console.log("file name is : ", filename);
    console.log("This is handle submit function");
    if (action == "run") setRunning(true);
    const output = await scriptsManager({
      action,
      filename,
      content: editorContent,
      cwd: scriptCwd,
      sessionId,
    });

    console.log("output is : ", output);
    if (action == "run") setRunning(false);
    if (action == "save") closeEditorCallback("Changes saved!");
  };

  return (
    <div
      className={`h-[100%] w-full flex flex-col items-center ${mplus.className}`}
    >
      <Editor
        height="100%"
        defaultLanguage="shell"
        defaultValue={editorContent}
        theme="vs-dark"
        onChange={(value) => setEditorContent(value || "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
        }}
      />
      <div className="w-full p-1 border-t border-t-zinc-700 text-zinc-400 flex flex-row items-center justify-end gap-3 text-sm">
        <button
          className="border border-red-400 px-2 bg-red-500 text-red-200 rounded-xs"
          id="exit"
          onClick={() => closeEditorCallback("exited!")}
        >
          <ButtonHoverEffect desc="Exit without saving...">
            Exit
          </ButtonHoverEffect>
        </button>
        <button
          className="bg-zinc-700 border border-zinc-600 px-2 rounded-xs"
          onClick={() => handleAction("save")}
        >
          <ButtonHoverEffect desc="Save and exit">Save</ButtonHoverEffect>
        </button>
      </div>
    </div>
  );
};

export default VimNanoEditor;

"use client";

import { lexend, mplus } from "@/app/fonts";
import React, { useEffect, useRef, useState } from "react";
import Editor, { loader, useMonaco } from "@monaco-editor/react";
import ButtonHoverEffect from "./button-hover-effect";
import { useEditorStore } from "@/stores/code-editor-store";
import { CgSpinnerTwo } from "react-icons/cg";
import { PiPauseFill, PiTriangleFill } from "react-icons/pi";
import { IoMdSave } from "react-icons/io";
import { VscSignOut } from "react-icons/vsc";
import { SiGnubash } from "react-icons/si";

type EditorProps = {
  sessionId: string;
  scriptCwd: string;
  commandMsg: string;
  closeEditorCallback: (t: string) => void; // close editor and give it the result back
};

const VimNanoEditor: React.FC<EditorProps> = ({
  sessionId,
  scriptCwd,
  commandMsg,
  closeEditorCallback,
}) => {
  const [editorContent, setEditorContent] = useState("");
  const [isReady, setIsReady] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [height, setHeight] = useState(400);
  const [showOutput, setShowOutput] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const parts = commandMsg.split(/\s+/);
  const filename = parts[1];

  const { run, read, save, running, saving } = useEditorStore();
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;
    loader.init().then((monacoInstance) => {
      monacoInstance.editor.defineTheme("my-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: { "editor.background": "#27272a" },
      });
    });
  }, [monaco]);

  const handleMouseDown = () => {
    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newHeight = e.clientY - rect.top;

      setHeight(newHeight);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  useEffect(() => {
    const initializeEditor = async () => {
      try {
        const exists = await read(scriptCwd, filename, sessionId);
        console.log("Editor useEffect - exists: ", exists)

        if (!exists) {
          // Auto-create empty file
          const content = useEditorStore.getState().fileContent || ""

          console.log("Content is : ", content)
          setEditorContent(content);
          await save(scriptCwd, filename, content, sessionId);
        }

        setIsReady(true);
      } catch (err) {
        console.error("Failed to initialize editor:", err);
        setEditorContent("");
        setIsReady(true); // Still show the editor even if initialization fails
      }
    };

    initializeEditor();
  }, []);

  useEffect(() => {
    if (isReady && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isReady]);

  const handleSave = async () => {
    const message = await save(scriptCwd, filename, editorContent, sessionId);
    closeEditorCallback(message);
  };

  const handleRun = async () => {
    const output = await run(scriptCwd, filename, sessionId, editorContent);
    setShowOutput(output);
  };

  return (
    <div
      ref={containerRef}
      className={`h-[100%] w-full flex flex-col items-center ${mplus.className}`}
    >
      <div className="w-full pt-3 py-2 pr-2 flex items-center justify-between bg-zinc-800">
        <div
          className={`${lexend.className} font-light text-sm flex flex-row items-center gap-2 border-y border-r border-zinc-700 px-2 py-1`}
        >
          <SiGnubash className="size-4" />
          <span>{filename}</span>
        </div>
        <div className="border border-zinc-700  flex flex-row">
          <button
            className="text-red-500 p-1"
            id="exit"
            onClick={() => closeEditorCallback("exited!")}
          >
            <ButtonHoverEffect desc="Exit without saving...">
              <VscSignOut className="size-[19px]" />
            </ButtonHoverEffect>
          </button>
          <button
            className="text-green-500 p-1 border-x border-zinc-700"
            id="exit"
            onClick={handleRun}
          >
            <ButtonHoverEffect desc="Run this script...">
              {running ? (
                <PiPauseFill className="size-4" />
              ) : (
                <PiTriangleFill className="rotate-90 size-4" />
              )}
            </ButtonHoverEffect>
          </button>
          <button
            className="text-blue-500 p-1"
            onClick={handleSave}
          >
            <ButtonHoverEffect desc="Save and exit">
              {saving ? (
                <CgSpinnerTwo className="animate-spin size-5" />
              ) : (
                <IoMdSave className="size-5" />
              )}
            </ButtonHoverEffect>
          </button>
        </div>
      </div>
      <div
        className="w-full"
        style={{ height: showOutput ? `${height}px` : "95%" }}
      >
        {isReady ? (
          <Editor
            height="100%"
            defaultLanguage="shell"
            value={editorContent}
            theme="my-dark"
            onChange={(value) => setEditorContent(value || "")}
            options={{
              fontSize: 14,
              fontFamily: "var(--font-firaCode)",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              padding: { top: 6 },
            }}
            loading={
              <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
                <CgSpinnerTwo className="animate-spin text-2xl text-zinc-600" />
              </div>
            }
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
            <CgSpinnerTwo className="animate-spin text-xl mr-2 text-zinc-600" />
          </div>
        )}
      </div>
      {showOutput && (
        <>
          <div
            onMouseDown={handleMouseDown}
            className="group relative w-full h-[2px] bg-neutral-700 cursor-row-resize hover:bg-neutral-600"
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 m-auto bg-neutral-700 group-hover:bg-neutral-600 rounded-md border border-zinc-600 w-6 h-2 " />
          </div>
          <div className="select-auto flex-grow w-full p-2 sm:p-2 md:px-3 md:py-2 bg-neutral-800  overflow-y-auto">
            <pre
              className={`text-sm h-full font-extralight text-green-500 ${mplus.className}`}
            >
              {showOutput}
            </pre>
          </div>
        </>
      )}
    </div>
  );
};

export default VimNanoEditor;

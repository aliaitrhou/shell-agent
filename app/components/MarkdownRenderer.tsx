"use client";

import React from "react";
import { FC, memo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface Props {
  language: string;
  value: string;
}

type MarkdownRendererProps = {
  children: string;
};

const programmingLanguages = {
  javascript: ".js",
  python: ".py",
  java: ".java",
  c: ".c",
  cpp: ".cpp",
  "c++": ".cpp",
  "c#": ".cs",
  ruby: ".rb",
  php: ".php",
  swift: ".swift",
  typescript: ".ts",
  go: ".go",
  rust: ".rs",
  html: ".html",
  css: ".css",
  // Add more extensions if needed.
} as const;

const generateRandomString = (length: number, lowercase = false) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXY3456789"; // Avoiding similar-looking characters.
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return lowercase ? result.toLowerCase() : result;
};

const CodeBlock: FC<Props> = memo(({ language, value }) => {
  const downloadAsFile = () => {
    if (typeof window === "undefined") return;

    const fileExtension =
      language in programmingLanguages
        ? programmingLanguages[language as keyof typeof programmingLanguages]
        : ".file";
    const suggestedFileName = `file-${generateRandomString(3, true)}${fileExtension}`;
    const fileName = window.prompt("Enter file name", suggestedFileName);

    if (!fileName) return;

    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full font-sans codeblock bg-zinc-950">
      <div className="flex items-center justify-between w-full px-6 py-2 pr-4 rounded-t bg-zinc-800 text-zinc-100">
        <span className="text-xs lowercase">{language}</span>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        PreTag="div"
        showLineNumbers
        customStyle={{
          marginTop: "5px",
          width: "100%",
          background: "transparent",
          padding: "0.6rem 0.6rem",
        }}
        codeTagProps={{
          style: {
            fontSize: "0.8rem",
            fontFamily: "var(--font-mono)",
          },
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
});
CodeBlock.displayName = "CodeBlock";

const MarkdownRenderer: FC<MarkdownRendererProps> = ({ children }) => {
  return (
    <ReactMarkdown
      className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        p({ children }) {
          // Normalize children to an array
          const childrenArray = React.Children.toArray(children);

          // Prevent rendering `div` inside `p`
          if (
            childrenArray.some(
              (child) => React.isValidElement(child) && child.type === "div",
            )
          ) {
            return <>{childrenArray}</>;
          }

          return <p className="my-2 last:mb-0">{childrenArray}</p>;
        },
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");

          if (inline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }

          return (
            <CodeBlock
              language={(match && match[1]) || ""}
              value={String(children).replace(/\n$/, "")}
              {...props}
            />
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;

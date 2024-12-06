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

const CodeBlock: FC<Props> = memo(({ language, value }) => {
  return (
    <div className="relative w-full font-sans codeblock bg-zinc-950">
      <div className="flex items-center justify-between w-full px-6 py-2 pr-4 rounded-t bg-zinc-800 text-zinc-100">
        <span className="text-xs lowercase">{language}</span>
      </div>
      <>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          PreTag="div"
          showLineNumbers
          customStyle={{
            marginTop: "5px",
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
      </>
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
          // Check if any block-level element exists in children
          const childrenArray = React.Children.toArray(children);

          if (
            childrenArray.some(
              (child) =>
                React.isValidElement(child) &&
                (child.type === "div" || child.type === "pre"),
            )
          ) {
            return <>{childrenArray}</>; // Don't wrap div or pre inside p
          }

          return <p className="sm:my-1 md:my-2 last:mb-0">{childrenArray}</p>;
        },
        code({
          inline,
          className,
          children,
          ...props
        }: React.ComponentPropsWithoutRef<"code"> & { inline?: boolean }) {
          const match = /language-(\w+)/.exec(className || "");

          if (inline) {
            // Render inline code
            return (
              <code
                className={`${className || ""} px-1 bg-zinc-800 rounded`}
                {...props}
              >
                {children}
              </code>
            );
          }

          if (!inline && match) {
            // Render block code
            return (
              <CodeBlock
                language={match[1] || ""}
                value={String(children).replace(/\n$/, "")}
                {...props}
              />
            );
          }

          // If not detected as block code with a language, fallback to inline rendering
          return (
            <code
              className={className || "bg-gray-700 sm:p-1 rounded"}
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;

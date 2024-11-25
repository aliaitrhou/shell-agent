import React from "react";
import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism";
import remarkParse from "remark-parse";

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="">
      <ReactMarkdown
        remarkPlugins={[remarkParse]}
        rehypePlugins={[rehypePrism]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

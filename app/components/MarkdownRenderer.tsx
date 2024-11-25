import React from "react";
import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism";
import remarkParse from "remark-parse";

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="">
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkParse]}
        rehypePlugins={[rehypePrism]}
      />
    </div>
  );
};

export default MarkdownRenderer;

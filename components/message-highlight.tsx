import React, { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import "highlight.js/styles/stackoverflow-dark.css";

hljs.registerLanguage("bash", bash);

type Props = {
  text: string;
};

const MessageHighlight: React.FC<Props> = ({ text }) => {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      hljs.highlightElement(messageRef.current);
    }
  }, [text]);

  return (
    <code ref={messageRef} className="!bg-transparent !text-white">
      {text}
    </code>
  );
};

export default MessageHighlight;

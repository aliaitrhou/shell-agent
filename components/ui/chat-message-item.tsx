"use client"

import { message } from '@/types';
import React from 'react'
import TerminalPrompt from './terminal-prompt';
import MessageHighlight from './message-highlight';
import { firaCode, mplus } from '@/app/fonts';


const ChatMessageItem = ({
  mode,
  role,
  cwd,
  text,
  pageNumber,
  chapterName,
  containerExpiry
}: message) => {
  return (
    <div className='border p-2'>
      <div
        className="w-full flex flex-col justify-center gap-1 mb-2 border"
      >
        <TerminalPrompt
          mode={mode}
          pwd={cwd}
          pageNumber={pageNumber}
          chapterName={chapterName}
          containerExpiry={containerExpiry}
        />
        <div>{text}</div>
        <div
          className={`max-w-full font-light text-xs text-zinc-300 mt-[1px] break-words ${msg.text === "empty_message" ? "mb-2" : ""}`}
        >
          <div className="pl-4 w-full break-words">
            {text === "empty_message" ? (
              ""
            ) : (
              <>
                {mode === "Prompt" ? (
                  <p
                    className={`text-xs sm:text-[13px] font-medium ${mplus.className}`}
                  >
                    {text}
                  </p>
                ) : (
                  <MessageHighlight
                    text={text}
                    classNames={`font-light !bg-transparent text-[13px] ${firaCode.className} text-white tracking-tighter`}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatMessageItem;

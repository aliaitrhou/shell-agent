import { MinusIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import { GiNotebook } from "react-icons/gi";
import { PiLightbulbFilamentBold } from "react-icons/pi";

const Keyword = ({ children }: { children: React.ReactNode }) => {
  return <span className="text-zinc-200 italic font-normal">{children}</span>;
};

const List: React.FC<{
  children: React.ReactNode;
  title: string;
}> = ({ children, title }) => {
  return (
    <div className="w-full sm:w-1/2 h-full self-start space-y-2 border-[1px] bg-zinc-700/20  border-zinc-700/40  px-4 py-2 rounded-lg">
      <div className="text-xl sm:text-3xl lgtext-4xl flex items-center gap-2 sm:gap-2 border-b border-b-zinc-700/50 pb-2 text-zinc-100">
        {title == "Tips" ? <PiLightbulbFilamentBold /> : <GiNotebook />}
        <span className="font-kanit">{title}</span>
      </div>
      <ul
        role="list"
        className="list-disc font-light text-md font-kanit text-zinc-400 pl-2 sm:pl-3 md:pl-4 leading-6"
      >
        {children}
      </ul>
    </div>
  );
};

const Instructions = () => {
  return (
    <div className="mx-auto max-w-lg sm:max-w-3xl lg:max-w-4xl flex flex-col sm:flex-row items-center gap-2 px-4 sm:px-8 md:px-2  lg:px-0 space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-4">
      <List title="Instructions">
        <li>
          You are represanted with two Modes <Keyword>Prompt</Keyword> and{" "}
          <Keyword>Command</Keyword>.
        </li>
        <li>
          Use Prompt to learn the command then use Command to try it yourself.
        </li>
        <li>
          The model would <Keyword>dynamically</Keyword> switch you to Command
          mode if it wants you to try a command.
        </li>
        <li>
          Your starting point is{" "}
          <Keyword>
            user directory &apos;<span className="font-mono">~</span>&apos;
          </Keyword>
          , if you don&apos;t know what that mean just ask with Prompt mode
        </li>
        <li>
          Clicking on <Keyword>Page &lt;number&gt;</Keyword> (loacated on the
          left side of every terminal prompt) opens a{" "}
          <Keyword>PDF preview</Keyword> of the page related to your question.
        </li>
        <li>
          You&apos;re limited to <Keyword>15 chats</Keyword> and{" "}
          <Keyword>25 messages</Keyword> per each, dua paid services used and Me
          being a student
        </li>
      </List>
      <List title="Tips">
        <li>
          Typing <Keyword>clear</Keyword> with Command mode would reset the chat
          view, don&apos;t worry your message history is saved
        </li>
        <li>
          Your starting point is user directory &apos;
          <Keyword>~</Keyword>
          &apos;, if you don&apos;t know what that mean just ask with Prompt
          mode
        </li>
        <li>
          Use MacOS like window control buttons:
          <div className="space-x-2">
            <span className="inline-block">
              <XMarkIcon className="w-3 h-3 text-black bg-red-500 rounded-full" />
            </span>
            <p className="inline-block">Delete the current chat.</p>
          </div>
          <div className="space-x-2">
            <span className="inline-block">
              <MinusIcon className="w-3 h-3 text-black bg-yellow-500 rounded-full" />
            </span>
            <p className="inline-block">Toggle the Sidebar.</p>
          </div>
          <div className="space-x-2">
            <span className="inline-block">
              <PlusIcon className="w-3 h-3 text-black bg-green-500 rounded-full" />
            </span>
            <p className="inline-block">Create a new chat.</p>
          </div>
        </li>
        <li>
          Typing <Keyword>exit</Keyword> with Command mode would close the
          terminal
        </li>
        <li>
          Confused about a specific part of the course? just{" "}
          <Keyword>ask with page number</Keyword> you want to understand.
        </li>
      </List>
    </div>
  );
};

export default Instructions;

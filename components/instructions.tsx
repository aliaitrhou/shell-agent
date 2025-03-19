import React from "react";
import { GiNotebook } from "react-icons/gi";
import { PiLightbulbFilamentBold } from "react-icons/pi";

const Keyword = ({ children }: { children: string }) => {
  return <span className="text-zinc-100 font-light">{children}</span>;
};

const List: React.FC<{
  children: React.ReactNode;
  title: string;
}> = ({ children, title }) => {
  return (
    <div className="w-full sm:w-1/2 h-full self-start space-y-2 border-[1px] bg-zinc-600/20  border-zinc-700/40  px-4 py-2 rounded-lg">
      <div className="text-xl sm:text-3xl md:text-4xl flex items-center gap-2 sm:gap-2 border-b border-b-zinc-600/30  text-zinc-300 pb-2">
        {title == "Tips" ? <PiLightbulbFilamentBold /> : <GiNotebook />}
        <span className="font-kanit font-ligh">{title}</span>
      </div>
      <ul
        role="list"
        className="list-disc font-thin text-sm sm:text-lg  font-kanit text-zinc-300 pl-2 sm:pl-3 md:pl-4"
      >
        {children}
      </ul>
    </div>
  );
};

const Instructions = () => {
  return (
    <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center px-4 sm:px-6 lg:px-0 space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-4">
      <List title="Instructions">
        <li>
          You are represanted with two modes <Keyword>Prompt</Keyword> and{" "}
          <Keyword>Command</Keyword>.
        </li>
        <li>
          Use Prompt to learn the command then use Command to try it yourself.
        </li>
        <li>
          Your starting point is user directory &apos;
          <Keyword>~</Keyword>
          &apos;, if you don&apos;t know what that mean just ask with Prompt
          mode
        </li>
        <li>
          Clicking on terminal prompt left side &quot;Page &lt;number&gt;&quot;
          opens a <Keyword>pdf preview</Keyword> with page relative to your
          question.
        </li>
        <li>
          The model would <Keyword>dynamically</Keyword> switch you to Command
          mode if it wants you to try a command.
        </li>
      </List>
      <List title="Tips">
        <li>
          Typing <Keyword>clear</Keyword> with Command mode would reset the chat
          view, don&apos;t worry my friend your message history is saved
        </li>
        <li>
          Your starting point is user directory &apos;
          <Keyword>~</Keyword>
          &apos;, if you don&apos;t know what that mean just ask with Prompt
          mode
        </li>
        <li>
          Your starting point is user directory &apos;
          <Keyword>~</Keyword>
          &apos;, if you don&apos;t know what that mean just ask with Prompt
          mode
        </li>
        <li>
          Typing <Keyword>exit</Keyword> with Command mode would close the
          terminal
        </li>
        <li>
          Confused about a specific part of the course? just ask for with page
          number.
        </li>
      </List>
    </div>
  );
};

export default Instructions;

import React from "react";

const Keyword = ({ children }: { children: string }) => {
  return (
    <span className="text-violet-200 font-semibold italic">{children}</span>
  );
};

interface Props {
  children: React.ReactNode;
}

const Instruction: React.FC<Props> = ({ children }) => {
  return (
    <ul
      role="list"
      className="list-disc font-light text-sm sm:text-lg font-kanit text-violet-300 text-light border-2 border-violet-400/50 bg-gradient-to-b from-violet-400/50 to-transparent py-3 pl-7 pr-4 rounded-xl"
    >
      {children}
    </ul>
  );
};

const Instructions = () => {
  return (
    <div className="text-ceneter max-w-lg sm:max-w-3xl md:max-w-4xl mx-auto px-4 pt-2 pb-3 space-y-6">
      <h3 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-center font-kanit text-violet-300">
        Follow Instructions
      </h3>
      <div className="flex gap-4">
        <Instruction>
          <>
            <li>
              You are represanted with two modes <Keyword>Prompt</Keyword> and{" "}
              <Keyword>Command</Keyword>, you can toggle between them by click
              on the button.
            </li>
            <li>
              Use Prompt to learn the command then use Command to try it
              yourself
            </li>
          </>
        </Instruction>
        <Instruction>
          <>
            <li>
              The model would <Keyword>dynamically</Keyword> switch you to
              Command mode if it wants you to try a command.
            </li>
            <li>
              Your starting point is user directory &apos;
              <Keyword>~</Keyword>
              &apos;, if you don&apos;t know what that mean just ask with Prompt
              mode
            </li>
          </>
        </Instruction>
        <Instruction>
          <li>
            Typing <Keyword>clear</Keyword> with Command mode would reset the
            chat view, don&apos;t worry my friend your message history is saved
          </li>
          <li>
            Typing <Keyword>exit</Keyword> with Command mode would close the
            terminal
          </li>
          <li>
            {/* If you want to see the answer relative to the course click on the */}
            {/* page number of any answer, that would open a pdf */}
            If you want to know where the answer came from click on the page
            number at the left side.
          </li>
        </Instruction>
      </div>
    </div>
  );
};

export default Instructions;

import React, { ChangeEvent } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { AiFillGithub } from "react-icons/ai";
import { TbTools } from "react-icons/tb";
import Instructions from "./instructions";

interface Props {
  handleClick: () => void;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const Landing: React.FC<Props> = ({ handleClick, handleChange }) => {
  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="absolute w-1/2 h-1/2 inner_gradient top-0 opacity-15" />
      <div className="flex items-center justify-center gap-3">
        <Link
          className="w-fit hover:underline italic flex items-center gap-1 font-light text-xs font-kanit rounded-full border border-zinc-300 bg-zinc-400 text-black px-[2px] py-[1px] sm:px-1 md:px-2 md:py-[2px]"
          href={"https://github.com/aliaitrhou/shell-agent"}
          target="_blank"
        >
          <span className="inline-block">Star it on Github</span>
          <AiFillGithub />
        </Link>
        <Link
          className="w-fit hover:underline italic flex items-center gap-1 font-light text-xs font-kanit rounded-full border border-orange-400/40 bg-orange-600 text-orange-100 px-[2px] py-[1px] sm:px-1 md:px-2 md:py-[2px]"
          href={"https://www.aliaitrahou.me/contact"}
          target="_blank"
        >
          <span className="inline-block">Request a feature</span>
          <TbTools />
        </Link>
      </div>
      <div className="w-full flex flex-col justify-cneter items-center gap-2">
        <h3
          style={{
            wordSpacing: "-16px",
          }}
          className="max-w-full sm:max-w-2xl md:max-w-4xl text-center text-3xl sm:text-4xl md:text-5xl font-spaceMono font-bold uppercase"
        >
          Our Course can now{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-violet-300 via-violet-500 to-violet-700">
            speak
          </span>{" "}
          with{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-red-300 via-red-500 to-pink-600 ">
            louder
          </span>{" "}
          voice!
        </h3>
        <p className="text-zinc-400 font-light px-3 sm:px-0 max-w-lg md:max-w-2xl text-center font-kanit text-lg sm:text-xl md:text-2xl">
          Shellagent is a shell that{" "}
          <span className="font-normal text-zinc-300">
            speaks your language
          </span>{" "}
          with robust environment that{" "}
          <span className="font-normal text-zinc-300">simplify</span> the{" "}
          learning process.
        </p>
      </div>
      <div className="flex flex-col items-center gap-1 sm:gap-2 md:gap-3">
        <div className="flex items-center">
          <div className="relative">
            <select
              name="model"
              aria-label="Models"
              defaultValue={"default"}
              onChange={handleChange}
              className="text-xs appearance-none sm:text-sm focus:outline-none text-zinc-400 bg-zinc-700/20  border-[1px] border-zinc-700/50 border-r-0 rounded-s-full p-2 sm:p-3 pr-8 sm:pr-10"
            >
              <option value="default" disabled>
                Choose a Model
              </option>
              <option value="google/gemma-2-27b-it">Gemma-2 Instruct</option>
              <option value="Qwen/Qwen2-72B-Instruct">Qwen2 Instruct</option>
              <option value="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo">
                Meta Llama 3.1
              </option>
              <option value="deepseek-ai/DeepSeek-V3">DeepSeek V3</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-[10px] sm:top-[14px]  size-4 text-zinc-500" />
          </div>
          <div className="relative">
            <select
              name="semester"
              defaultValue={"default"}
              onChange={handleChange}
              className="text-xs appearance-none sm:text-sm focus:outline-none text-zinc-400  bg-zinc-700/20  border-[1px] border-zinc-700/50 rounded-e-full p-2 sm:p-3 pr-8 sm:pr-10"
            >
              <option value="default" disabled>
                Semester
              </option>
              <option value="S3">SEMESTER - S3</option>
              <option value="S4">SEMESTER - S4</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-[10px] sm:top-[14px]  size-4 text-zinc-500" />
          </div>
        </div>
        <button
          onClick={handleClick}
          className="font-kanit text-sm md:text-sm lg:text-lg px-2 py-2 sm:p-3 md:px-4 md:py-3  text-zinc-400  bg-zinc-700/20  border-[1px] border-zinc-700/50 rounded-full hover:shadow-zincShadow transition-shadow duration-700 ease-in-out focus:outline-none"
        >
          <span>⚡ GET STARTED</span>
        </button>
      </div>
      <Instructions />
    </section>
  );
};

export default Landing;

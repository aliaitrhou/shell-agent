import React, { ChangeEvent } from "react";
import { FaLocationArrow } from "react-icons/fa";
import terminalOverview from "../public/terminal-overview.png";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { AiFillGithub } from "react-icons/ai";
import { TbTools } from "react-icons/tb";
import Image from "next/image";
import Footer from "./footer";

interface Props {
  handleClick: () => void;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const Landing: React.FC<Props> = ({ handleClick, handleChange }) => {
  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-10 lg:gap-14 pt-8">
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Link
            className="shadow-2xl shadow-white w-fit hover:underline italic flex items-center gap-1 font-light text-xs font-kanit rounded-full border border-zinc-300 bg-zinc-400 text-black px-[2px] py-[1px] sm:px-1 md:px-2 md:py-[2px]"
            href={"https://github.com/aliaitrhou/shell-agent"}
            target="_blank"
          >
            <span className="inline-block">Star it on Github</span>
            <AiFillGithub />
          </Link>
          <Link
            className="shadow-2xl w-fit hover:underline italic flex items-center gap-1 font-light text-xs font-kanit rounded-full border border-orange-400/40 bg-orange-600 text-orange-100 px-[2px] py-[1px] sm:px-1 md:px-2 md:py-[2px]"
            href={"https://www.aliaitrahou.me/contact"}
            target="_blank"
          >
            <span className="inline-block">Request a feature</span>
            <TbTools />
          </Link>
        </div>
        <div className="w-full flex flex-col justify-cneter items-center gap-2">
          <p className="max-w-full sm:max-w-xl md:max-w-3xl text-center text-xl sm:text-2xl md:text-4xl font-mplus font-medium">
            Our Course now{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-violet-300 via-violet-500 to-violet-700">
              speaks louder
            </span>
            —through a shell that understands your language.
          </p>
        </div>
        <div className="flex flex-row justify-center gap-1 sm:gap-2 md:gap-3 font-spaceMono">
          <div className="flex items-center">
            <div className="relative">
              <select
                name="model"
                aria-label="Models"
                defaultValue={"default"}
                onChange={handleChange}
                className="text-xs appearance-none sm:text-sm focus:outline-none text-zinc-400 bg-zinc-700/20  border-[1px] border-zinc-700/50 border-r-0 rounded-sm p-3 sm:p-4 pr-8 sm:pr-10"
              >
                <option value="default" disabled>
                  Choose a Model
                </option>
                <option value="arcee-ai/AFM-4.5B-Preview">ARCEE-AI</option>
                <option value="serverless-qwen-qwen3-32b-fp8">
                  Qwen3 32B FP8
                </option>
                <option value="deepseek-ai/DeepSeek-R1-Distill-Qwen-7B">
                  DEEPSEEK-AI
                </option>
                <option value="deepseek-ai/DeepSeek-V3">DEEPSEEK V3</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-[10px] sm:top-[14px]  size-4 text-zinc-500" />
            </div>
            <div className="relative">
              <select
                name="semester"
                defaultValue={"default"}
                onChange={handleChange}
                className="text-xs appearance-none sm:text-sm focus:outline-none text-zinc-400  bg-zinc-700/20  border-[1px] border-zinc-700/50 rounded-e-sm p-3 sm:p-4 pr-8 sm:pr-10"
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
            className="font-kanit text-sm md:text-sm lg:text-lg px-2 py-2 sm:p-3 md:px-4 md:py-3 text-zinc-400  bg-zinc-700/20  border-[1px] border-zinc-700/50 rounded-sm hover:shadow-zincShadow transition-shadow duration-700 ease-in-out focus:outline-none flex flex-row items-center gap-2"
          >
            <FaLocationArrow color="white" className="shadow-2xl" />
          </button>
        </div>
        <Footer />
      </div>
      <div className="min-w-full h-full">
        <div className="relative mx-auto h-[650px]">
          <Image
            src={terminalOverview}
            className="w-ful h-full"
            style={{ objectFit: "contain" }}
            fill
            alt="300"
          />
        </div>
      </div>
    </section>
  );
};

export default Landing;

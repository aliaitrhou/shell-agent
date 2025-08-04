import React, { ChangeEvent } from "react";
import { FaLocationArrow } from "react-icons/fa";
import terminalOverview from "@/public/terminal-overview.png";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { AiFillGithub } from "react-icons/ai";
import Image from "next/image";
import Footer from "./footer";
import { lexend, mplus } from "@/app/fonts";

interface Props {
  handleClick: () => void;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const Landing: React.FC<Props> = ({ handleClick, handleChange }) => {
  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 py-0">
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Link
            className="shadow-2xl shadow-white w-fit hover:underline italic flex items-center gap-1 font-light text-xs font-kanit rounded-full border border-zinc-300 bg-zinc-400 text-black px-[2px] py-[1px] sm:px-1 md:px-2 md:py-[2px]"
            href={"https://github.com/aliaitrhou/shell-agent"}
            target="_blank"
          >
            <span className="inline-block">Star it on Github</span>
            <AiFillGithub />
          </Link>
        </div>
        <div className="flex flex-col justify-cneter items-center gap-2">
          <h3 className={`${lexend.className} text-4xl`}>
            Learn faster & Smarter
          </h3>
          <p
            className={`mx-auto text-center max-w-xl text-xl sm:text-2xl md:text-2xl font-medium ${mplus.className} text-zinc-300`}
          >
            Our course now speaks louder through a shell that understands your
            language.
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
                className="text-xs appearance-none sm:text-sm focus:outline-none text-zinc-400 bg-zinc-700/50  border-[1px] border-zinc-700/90 border-r-0 rounded-sm p-3 sm:p-4 pr-8 sm:pr-10"
              >
                <option value="default" disabled>
                  Choose a Model
                </option>
                <option value="arcee-ai/AFM-4.5B-Preview">ARCEE-AI</option>
                <option value="serverless-qwen-qwen3-32b-fp8">
                  Qwen3 32B FP8
                </option>
                <option
                  value="
deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free
  "
                >
                  DEEPSEEK-AI
                </option>
                <option
                  value="
meta-llama/Llama-3.3-70B-Instruct-Turbo-Free
                  "
                >
                  META-LLAMA
                </option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-[10px] sm:top-[14px]  size-4 text-zinc-500" />
            </div>
            <div className="relative">
              <select
                name="semester"
                defaultValue={"default"}
                onChange={handleChange}
                className="text-xs appearance-none sm:text-sm focus:outline-none text-zinc-400  bg-zinc-700/50  border-[1px] border-zinc-700/90 rounded-e-sm p-3 sm:p-4 pr-8 sm:pr-10"
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
            className="font-kanit text-sm md:text-sm lg:text-lg px-2 py-2 sm:p-3 md:px-4 md:py-3 text-zinc-400  bg-zinc-700/50 border-[1px] border-zinc-700/90 rounded-sm hover:shadow-zincShadow transition-shadow duration-700 ease-in-out focus:outline-none flex flex-row items-center gap-2"
          >
            <FaLocationArrow color="white" className="shadow-2xl" />
          </button>
        </div>
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
      <Footer />
    </section>
  );
};

export default Landing;

import React, { ChangeEvent, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { AiFillGithub } from "react-icons/ai";
import { lexend, mplus } from "@/app/fonts";
import Image from "next/image";
import DesktopOverview from "@/public/terminal-overview.png";
import MobileOverview from "@/public/mobile-overview.png";
import { FaBook, FaCode } from "react-icons/fa6";
import { RiRobot2Fill } from "react-icons/ri";
import { IoMdArrowRoundForward } from "react-icons/io";
import { PiFlowerTulipDuotone } from "react-icons/pi";
import { MdOutlineHelpOutline } from "react-icons/md";

interface Props {
  handleClick: () => void;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const LandingView: React.FC<Props> = ({ handleClick, handleChange }) => {
  const modelSelectRef = useRef<HTMLSelectElement>(null);
  const semesterSelectRef = useRef<HTMLSelectElement>(null);

  const handleModelDivClick = () => {
    if (modelSelectRef.current) {
      try {
        modelSelectRef.current.showPicker(); // modern way
      } catch {
        modelSelectRef.current.click(); // fallback
      }
    }
  };

  const handleSemesterDivClick = () => {
    if (semesterSelectRef.current) {
      try {
        semesterSelectRef.current.showPicker();
      } catch {
        semesterSelectRef.current.click();
      }
    }
  };

  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="py-4 md:py-6 space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Link
            className="w-fit hover:underline flex items-center gap-1 font-extralight text-xs rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 px-2 py-1"
            href={"https://github.com/aliaitrhou/shell-agent"}
            target="_blank"
          >
            <span className="inline-block">Star it on Github</span>
            <AiFillGithub />
          </Link>
        </div>
        <div className="flex flex-col justify-cneter items-center px-4 sm:px-2 md:px-0">
          <h3
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] ${lexend.className}`}
          >
            Learn faster & Smarter
          </h3>
          <p
            className={`py-2 mx-auto text-center max-w-md md:max-w-lg text-sm sm:text-lg md:text-xl font-extralight text-zinc-300 ${mplus.className} italic`}
          >
            Our course now speaks Louder through a shell that understands your
            language.
          </p>
        </div>
        <div
          className={`flex flex-row justify-center gap-1 sm:gap-2 md:gap-3 ${mplus.className}`}
        >
          <div
            onClick={handleModelDivClick}
            className="flex items-center justify-between bg-zinc-100 rounded-sm text-black px-2 py-2 gap-2"
          >
            <RiRobot2Fill className="size-5 -rotate-6" />
            <select
              ref={modelSelectRef}
              name="model"
              aria-label="Models"
              defaultValue={"default"}
              onChange={handleChange}
              className="text-xs sm:text-sm appearance-none focus:outline-none bg-inherit"
            >
              <option value="default" disabled>
                Choose a Model
              </option>
              <option value="arcee-ai/AFM-4.5B-Preview">ARCEE-AI</option>
              <option value="serverless-qwen-qwen3-32b-fp8">
                Qwen3 32B FP8
              </option>
              <option value="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free">
                DEEPSEEK-AI
              </option>
              <option value="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free">
                META-LLAMA
              </option>
            </select>
            <ChevronDownIcon className="pointer-events-none right-3 top-5 size-4" />
          </div>

          <div
            onClick={handleSemesterDivClick}
            className="flex items-center justify-between bg-zinc-100 rounded-sm text-black px-2 py-2 gap-2"
          >
            <FaBook className="size-4 -rotate-6" />
            <select
              ref={semesterSelectRef}
              name="semester"
              defaultValue={"default"}
              onChange={handleChange}
              className="text-xs sm:text-sm appearance-none focus:outline-none bg-inherit"
            >
              <option value="default" disabled>
                Semester
              </option>
              <option value="S3">SEMESTER - S3</option>
              <option value="S4">SEMESTER - S4</option>
            </select>
            <ChevronDownIcon className="pointer-events-none right-3 top-5 size-4" />
          </div>
        </div>
        <button
          onClick={handleClick}
          className="mx-auto text-sm sm:text-sm lg:text-lg px-2 py-2 md:py-1 md:px-4 text-yellow-100 bg-yellow-500 border-2 border-yellow-400 rounded-full focus:outline-none flex flex-row items-center gap-1 relative overflow-hidden group shadow-yellow-500/50 hover:shadow-yellow-500 shadow-zincShadow hover:shadow-zincShadow transition-shadow duration-700 ease-in-out"
        >
          <IoMdArrowRoundForward className="size-6 -rotate-45" />
          <span>GET STARTED</span>
        </button>
      </div>
      <div className="relative w-full h-[65dvh] flex flex-col justify-center items-center gap-4">
        <div className="gradient_background_down"></div>
        <div className="text-xs font-extralight flex items-center justify-center gap-3 px-8">
          <Link
            href="/user-guide"
            className="border w-fit rounded-md px-2 py-1 border-neutral-400/40 bg-black text-violet-300 flex flex-row items-center"
          >
            <MdOutlineHelpOutline className="inline mr-2 rotate-12 text-sm" />
            <span className="whitespace-nowrap">User Guide</span>
          </Link>
          <Link
            href="https://aliaitrahou.me"
            target="_blank"
            className="border w-fit rounded-md px-2 py-1  border-neutral-400/40 bg-black text-emerald-300 flex flex-row items-center"
          >
            <FaCode className="inline mr-2 -rotate-12 text-sm" />
            <span className="whitespace-nowrap">Built BY</span>
          </Link>
          <Link
            href="https://aliaitrahou.me/contact"
            target="_blank"
            className="border w-fit rounded-md px-2 py-1  border-neutral-400/40 bg-black text-yellow-300 flex flex-row items-center"
          >
            <PiFlowerTulipDuotone className="inline mr-2 rotate-12 text-sm" />
            <span className="drop-shadow-lg whitespace-nowrap">
              Request Feature
            </span>
          </Link>
        </div>
        <div className="hidden md:block relative w-full max-w-full px-4 md:h-[450px] lg:h-[550px] xl:h-[600px]">
          <Image
            src={DesktopOverview}
            alt="Terminal overview preview"
            fill
            className="object-contain px-3 lg:px-0"
            priority
          />
        </div>

        <div className="mb-3 block md:hidden relative w-full max-w-full mx-auto px-8  h-[550px] sm:h-[650px]">
          <Image
            src={MobileOverview}
            alt="Terminal overview preview"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default LandingView;

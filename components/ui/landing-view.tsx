import React, { ChangeEvent, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { lexend, montserrat, mplus } from "@/app/fonts";
import Image from "next/image";
import DesktopOverview from "@/public/terminal-overview.png";
import MobileOverview from "@/public/mobile-overview.png";
import { FaBook } from "react-icons/fa6";
import { TbBrandGithubFilled } from "react-icons/tb";
import { CgSpinnerTwo } from "react-icons/cg";
import { RiRobot2Fill } from "react-icons/ri";
import { IoMdArrowRoundForward } from "react-icons/io";
import { FcCloseUpMode, FcQuestions } from "react-icons/fc";

interface Props {
  handleClick: () => void;
  loading: boolean;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const LandingView: React.FC<Props> = ({
  handleClick,
  loading,
  handleChange,
}) => {
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
    <section className="relative w-full h-full flex flex-col items-center justify-center gap-4 pt-4 sm:pt-6 md:pt-8 lg:pt-10">
      <div className="md:py-4 space-y-5 text-center">
        <Link
          href={"https://github.com/aliaitrhou/shell-agent"}
          target="_blank"
          className={`${lexend.className} mx-auto text-sm bg-violet-500/80 text-violet-200 px-2 py-[2px] rounded-full border border-violet-400/60 w-fit flex items-center`}
        >
          <TbBrandGithubFilled className="mr-1 size-4" />
          <span className="whitespace-nowrap hover:underline ">
            Star it on Github
          </span>
        </Link>

        <h3
          className={`${lexend.className} text-2xl sm:text-3xl md:text-4xl lg:text-[3rem]`}
        >
          Learn faster & Smarter
        </h3>
        <p
          className={`text-center max-w-lg  text-xs md:text-sm  font-light text-zinc-300`}
        >
          Experience a smarter way to learn through an interactive shell that
          responds to your language. Gain real problem-solving skills with
          instant feedback.
        </p>
        <div
          className={`flex flex-row justify-center gap-0 ${mplus.className}`}
        >
          <div
            onClick={handleModelDivClick}
            className="flex items-center justify-between bg-zinc-200 border-s border-y border-white rounded-s-md text-black px-2 py-3 gap-2"
          >
            <RiRobot2Fill className="size-5" />
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
              <option value="arcee-ai/AFM-4.5B">ARCEE-AI</option>
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
            className="flex items-center justify-between bg-zinc-200 border-y border-white rounded-none text-black px-2 py-3 gap-2 border-l border-l-black"
          >
            <FaBook className="size-4" />
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
          <button
            onClick={handleClick}
            className={`text-sm sm:text-sm lg:text-lg px-2 py-2 md:py-1 md:px-3 text-yellow-100 bg-yellow-500 border border-yellow-400 border-l-black rounded-e-md focus:outline-none flex flex-row items-center gap-1 relative overflow-hidden group shadow-yellow-500/50 hover:shadow-yellow-500 shadow-zincShadow hover:shadow-zincShadow transition-shadow duration-700 ease-in-out ${lexend.className}`}
          >
            {loading ? (
              <CgSpinnerTwo className="animate-spin" />
            ) : (
              <>
                <IoMdArrowRoundForward className="size-6 -rotate-45" />
                <span>START</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="relative w-full min-h-0 flex-1 flex flex-col justify-center items-center gap-10">
        <div className="gradient_background_down"></div>
        <div
          className={`${mplus.className} text-white text-xs md:text-sm font-thin flex items-center justify-center gap-3 px-8`}
        >
          <Link
            href="/user-guide"
            className="border w-fit rounded-md px-2 py-1 border-zinc-300 hover:bg-white/10 flex flex-row items-center"
          >
            <FcQuestions className="inline mr-1 size-4" />
            <span className="whitespace-nowrap">User Guide</span>
          </Link>
          <Link
            href="https://aliaitrahou.me/contact"
            target="_blank"
            className="border w-fit rounded-md px-2 py-1 border-white hover:bg-white/10 flex flex-row items-center"
          >
            <FcCloseUpMode className="inline mr-1 text-pink-400 size-4" />
            <span className="drop-shadow-lg whitespace-nowrap">
              Request Feature
            </span>
          </Link>
        </div>
        <div className="hidden md:block relative w-full max-w-full px-4 md:h-[450px] lg:h-[550px] xl:h-[600px] scale-x-105">
          <Image
            src={DesktopOverview}
            alt="Terminal overview preview"
            fill
            className="object-contain px-3 lg:px-0 rounded-lg"
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

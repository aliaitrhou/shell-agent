"use client";

import { lexend } from "@/app/fonts";
import { usePdfPreviewStore } from "@/stores/use-pdf-store";
import React, { useState, useEffect } from "react";
import { HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";


interface Props {
  handleClosePdf: () => void;
}

const PdfPreview: React.FC<Props> = ({ handleClosePdf }) => {

  const { page, chapter, semester, totalPages } = usePdfPreviewStore();
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    setCurrentPage(page)
  }, [page])


  const source = `/${semester}/${chapter}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&view=FitH&zoom=page-fit&pagemode=none&background=#27272a`;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (totalPages && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = totalPages ? currentPage >= totalPages : false;


  return (
    <section
      className={`relative h-[80dvh] md:h-[75dvh] flex flex-col w-full bg-zinc-800 rounded-none sm:rounded-md border-[2px] border-zinc-700/40 overflow-hidden ${lexend.className} font-light py-[6px]`}
    >
      <div className="absolute top-0 w-full h-10 pl-2 pr-1 bg-zinc-800 border-b-[2px] border-b-zinc-700/40 flex items-center justify-between text-sm text-zinc-300 ">
        <span className="">
          {semester}: {chapter.charAt(0).toUpperCase() + chapter.slice(1)}
        </span>
        <button
          onClick={handleClosePdf}
          className="p-1 text-zinc-500 hover:bg-zinc-700  focus:outline-none rounded-full"
        >
          <RxCross2 className="size-4" />
        </button>
      </div>
      <iframe
        key={`pdf-frame-${currentPage}`}
        className="h-full w-full pt-[2px]"
        src={source}
        width="800"
        height="00"
      ></iframe>
      <div className="absolute bg-zinc-800 bottom-0 py-2 px-2 sm:px-3 lg:px-4 right-0 w-full text-sm border-t-[2px] border-zinc-700/40">
        <div className="mx-auto w-32 flex items-center justify-between gap-5">
          <button
            className="border border-zinc-600 active:border-zinc-500 bg-zinc-700 rounded-lg p-1"
            disabled={isPrevDisabled}
            onClick={handlePrevPage}
          >
            <HiOutlineArrowNarrowLeft />
          </button>
          <span>{currentPage}</span>
          <button
            className="border border-zinc-600 active:border-zinc-500  bg-zinc-700 rounded-lg p-1"
            disabled={isNextDisabled}
            onClick={handleNextPage}
          >
            <HiOutlineArrowNarrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PdfPreview;

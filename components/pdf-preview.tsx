"use client";

import React, { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Props {
  pageToOpen: number;
  handleClosePdf: () => void;
}

const PdfPreview: React.FC<Props> = ({ pageToOpen, handleClosePdf }) => {
  const [loading, setLoading] = useState(true);

  // Reset loading state whenever page changes
  useEffect(() => {
    setLoading(true);
  }, [pageToOpen]);

  console.log("Pdf preview mounts!!!");

  return (
    <section
      className={`relative h-[80dvh] lg:h-[80dvh] w-full bg-zinc-800 rounded-xl border border-zinc-700/60 overflow-hidden`}
    >
      <div className="h-8 sm:h-10 px-4 bg-zinc-800 border-b-[1px] border-b-zinc-700/60 flex items-center justify-between font-kanit text-sm text-zinc-500 ">
        <span className="">Chapter 1</span>
        <span className="">
          P{pageToOpen < 10 ? `0${pageToOpen}` : `${pageToOpen}`}
        </span>
      </div>
      {loading && (
        <div className="w-full h-full flex items-center justify-center">
          <AiOutlineLoading3Quarters className="mx-auto h-5 w-5 rounded-full animate-spin text-zinc-600" />
        </div>
      )}
      {/* Key attribute forces iframe to re-render when page changes */}
      <iframe
        key={`pdf-frame-${pageToOpen}`}
        className="h-full w-full pt-[2px]"
        src={`/course-s3/chap1.pdf#page=${pageToOpen}&toolbar=0&view=FitH&scrollbar=0&statusbar=0&navpanes=0&background=#27272a&zoom=90`}
        width="800"
        height="500"
        onLoad={() => setLoading(false)}
      ></iframe>
      <div className="absolute bg-zinc-800 bottom-0 py-2 px-2 right-0 w-full flex flex-row justify-between items-center text-sm border-t-[1px] border-zinc-700/60">
        <span className="text-zinc-500 font-kanit">By auther name</span>
        <button
          onClick={handleClosePdf}
          className="px-2 sm:px-3 py-0 bg-zinc-700/80 backdrop-blur-sm border-2 border-zinc-700/60 text-zinc-400 focus:outline-none rounded-full  font-spaceMono"
        >
          Close
        </button>
      </div>
    </section>
  );
};

export default PdfPreview;
// "use client";
//
// import React, { useState } from "react";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";
//
// interface Props {
//   pageToOpen: number;
//   handleClosePdf: () => void;
// }
//
// const PdfPreview: React.FC<Props> = ({ pageToOpen, handleClosePdf }) => {
//   const [loading, setLoading] = useState(false);
//
//   console.log("Pdf preview mounts!!!");
//
//   return (
//     <section
//       className={`relative h-[80dvh] lg:h-[80dvh] w-full bg-zinc-800 rounded-xl border border-zinc-700/60 overflow-hidden`}
//     >
//       <div className="h-8 sm:h-10 px-4 bg-zinc-800 border-b-[1px] border-b-zinc-700/60 flex items-center justify-between font-kanit text-sm text-zinc-500 ">
//         <span className="">Chapter 1</span>
//         <span className="">
//           P{pageToOpen < 10 ? `0${pageToOpen}` : `${pageToOpen}`}
//         </span>
//       </div>
//       {loading && (
//         <div className="w-full h-full flex items-center justify-center">
//           <AiOutlineLoading3Quarters className="mx-auto h-5 w-5 rounded-full animate-spin text-zinc-600" />
//         </div>
//       )}
//       {/* Key attribute forces iframe to re-render when page changes */}
//       <iframe
//         key={`pdf-frame-${pageToOpen}`}
//         className="h-full w-full pt-[2px]"
//         src={`/course-s3/chap1.pdf#page=${pageToOpen}&toolbar=0&view=FitH&scrollbar=0&statusbar=0&navpanes=0&background=#27272a&zoom=90`}
//         width="800"
//         height="500"
//         onLoad={() => setLoading(false)}
//       ></iframe>
//       <div className="absolute bg-zinc-800 bottom-0 py-2 px-2 right-0 w-full flex flex-row justify-between items-center text-sm border-t-[1px] border-zinc-700/60">
//         <span className="text-zinc-500 font-kanit">By auther name</span>
//         <button
//           onClick={handleClosePdf}
//           className="px-2 sm:px-3 py-0 bg-zinc-700/80 backdrop-blur-sm border-2 border-zinc-700/60 text-zinc-400 focus:outline-none rounded-full  font-spaceMono"
//         >
//           Close
//         </button>
//       </div>
//     </section>
//   );
// };
//
// export default PdfPreview;

"use client";

import React from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { IoIosWarning } from "react-icons/io";
import { MdError } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import { motion } from "framer-motion";

interface AlertProps {
  message: string;
  type?: string;
}

export const StatusAlert: React.FC<AlertProps> = ({ type, message }) => {
  let textColor;
  switch (type) {
    case "success":
      textColor = "text-green-400";
      break;
    case "error":
      textColor = "text-red-400";
      break;
    case "warning":
      textColor = "text-orange-400";
      break;
    default:
      textColor = "text-zinc-300";
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        translateY: -100,
      }}
      animate={{
        opacity: 1,
        translateY: 0,
      }}
      transition={{ duration: 0.5 }}
      className={`border rounded-md z-50 border-zinc-700 bg-zinc-800 ${textColor} flex items-center gap-2 px-4 py-2 text-xs`}
    >
      {type === "success" && <AiFillCheckCircle />}
      {type === "error" && <MdError />}
      {type === "warning" && <IoIosWarning />}
      {type === "loading" && <CgSpinner className="animate-spin" />}
      <span className="font-kanit">{message}</span>
    </motion.div>
  );
};

"use client";

import React from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { IoIosWarning } from "react-icons/io";
import { MdError } from "react-icons/md";
import { PiSpinnerBold } from "react-icons/pi";
import { motion } from "framer-motion";
import { lexend } from "@/app/fonts";
import { AlertProps } from "@/stores/use-alert-store";

const StatusAlert: React.FC<AlertProps> = ({ type, message }) => {
  let textColor;
  switch (type) {
    case "success":
      textColor = "text-green-500";
      break;
    case "error":
      textColor = "text-red-500";
      break;
    case "warning":
      textColor = "text-orange-500";
      break;
    default:
      textColor = "text-zinc-300";
  }

  return (
    <motion.div
      initial={{ opacity: 0, marginTop: 0, y: -50, scale: 0.95 }}
      animate={{
        opacity: 1,
        marginTop: 50,
        y: 0,
        scale: 1,
        transition: {
          duration: 4,
          ease: "easeOut",
          type: "spring",
          stiffness: 120,
        },
      }}
      className={`border-[1px] rounded-md z-50 border-neutral-600/60 bg-neutral-700/60 backdrop-blur-lg ${lexend.className} ${textColor} flex items-center gap-2 px-4 py-2 text-sm shadow-2xl`}
    >
      {type === "success" && <AiFillCheckCircle />}
      {type === "error" && <MdError />}
      {type === "warning" && <IoIosWarning />}
      {type === "loading" && <PiSpinnerBold className="animate-spin" />}
      <span className="font-kanit text-xs">{message}</span>
    </motion.div>
  );
};

export default StatusAlert;

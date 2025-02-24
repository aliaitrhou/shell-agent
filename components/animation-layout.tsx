"use client";

import { motion } from "framer-motion";

const AimationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ translateX: 100, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      //@ts-expect-error tst
      className="w-full h-full flex flex-col items-center justify-center"
    >
      {children}
    </motion.div>
  );
};

export default AimationLayout;

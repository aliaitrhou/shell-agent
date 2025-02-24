"use client";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  idx: number;
}

const ChatItemWrapper: React.FC<Props> = ({ children, idx }) => {
  const gap = 0.15 * idx;
  const delay = parseFloat(gap.toFixed(1));

  return (
    <motion.div
      initial={{ translateY: -10, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
};

export default ChatItemWrapper;

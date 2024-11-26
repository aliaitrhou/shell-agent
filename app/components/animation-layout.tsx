import { AnimatePresence, motion } from "framer-motion";

const AimationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: -40 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AimationLayout;

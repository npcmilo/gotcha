import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

interface ModalProps {
  onClose: () => void;
}

const closeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="35px"
    viewBox="0 -960 960 960"
    width="35px"
    fill="#FFFFFF"
    className="absolute right-[-20px] top-[-30px] cursor-pointer"
  >
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

export default function Modal({ onClose }: ModalProps) {
  return (
    <motion.div
      initial={{ bottom: -1000 }}
      animate={{ bottom: 0 }}
      exit={{ bottom: -1000 }}
      style={styles.glass}
      className="w-screen absolute left-0 bottom-0 h-[80%] flex flex-col items-center text-[#FFFFFF] p-[10vw] gap-[25px]"
    >
      {/* HEADER */}
      <div className="w-full relative">
        <h1 className="text-[26px] font-bold">How To Play</h1>
        <h3>
          Identify the <span className="italic">real</span> images.
        </h3>
        <div onClick={onClose}>{closeIcon}</div>
      </div>

      {/* BODY */}
      <div className="w-full">
        <ul className="list-disc ml-4">
          <li> Each guess must be a valid 5-letter word.</li>
          <li>
            {" "}
            The color of the tiles will change to show how close your guess was
            to the word.
          </li>
        </ul>
      </div>
    </motion.div>
  );
}

const styles = {
  glass: {
    background: "rgba(21, 101, 192, 0.85)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
  },
};

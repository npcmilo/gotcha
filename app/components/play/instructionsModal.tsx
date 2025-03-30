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
    className="absolute right-[-5vw] top-[-2vh] cursor-pointer"
  >
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

export default function InstructionsModal({ onClose }: ModalProps) {
  return (
    <motion.div
      initial={{ bottom: -1000 }}
      animate={{ bottom: 0 }}
      exit={{ bottom: -1000 }}
      style={styles.glass}
      className="w-screen absolute left-0 bottom-0 h-[90%] flex flex-col items-center text-[#FFFFFF] pr-[10vw] pl-[10vw] pt-[5vh] pb-[10vh] z-20"
    >
      {/* HEADER */}
      <div className="w-full relative">
        <h1 className="text-[26px] font-bold">How To Play</h1>
        <h3>
          Identify the <span className="italic">real</span> images.
        </h3>
        <button onClick={onClose}>{closeIcon}</button>
      </div>

      {/* BODY */}
      <div className="w-full flex flex-col gap-[30px] text-sm">
        <ul className="list-disc ml-4 text-sm">
          <li>
            Each round will present a Captcha of images of a specific
            object/thing.
          </li>
          <li>
            {" "}
            The captcha will contain a random assortment of "real" and
            AI-generated images.
          </li>
        </ul>

        <div className="gap-[50px] flex flex-col">
          <div className="flex flex-row justify-start gap-[20px]">
            <img
              src="/app/assets/step-1.png"
              alt="Step 1: Select all the real images"
              style={styles.stepImage}
            />
            <div className="flex flex-col gap-[5px] justify-center items-start">
              <h3 className="text-l font-[500] md:text-xl">
                1. Select the real images.
              </h3>
              <p className="text-s font-[300]">
                Click to add a "real" image to your selection. Don't be deceived
                by AI.
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-start gap-[20px]">
            <img
              src="/app/assets/step-2.png"
              alt="Step 2: Verify your answers"
              style={styles.stepImage}
            />
            <div className="flex flex-col gap-[5px] justify-center items-start">
              <h3 className="text-l font-[500] md:text-xl">
                2. Verify your answer.
              </h3>
              <p className="text-s font-[300]">
                Click to add a "real" image to your selection. Don't be deceived
                by AI.
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-start gap-[20px]">
            <img
              src="/app/assets/step-3.png"
              alt="Step 3: See if you can catch AI."
              style={styles.stepImage}
            />
            <div className="flex flex-col gap-[5px] justify-center items-start">
              <h3 className="text-l font-[500] md:text-xl">
                3. Accept Defeat.
              </h3>
              <p className="text-s font-[300]">
                Humans don't stand a chance. Move on to the next round no matter
                what.
              </p>
            </div>
          </div>
        </div>
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
  stepImage: {
    height: "8vh",
  },
};

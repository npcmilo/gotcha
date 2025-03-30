import { useState, useEffect } from "react";
import { motion, animate, transform } from "framer-motion";
import ResultsGridImage from "./resultsGridImage";

interface ModalProps {
  onClose: () => void;
  correct: number[];
  totalSeconds: string;
  images: { src: string; key: number }[];
}

const closeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="35px"
    viewBox="0 -960 960 960"
    width="35px"
    fill="#FFFFFF"
    className="cursor-pointer"
  >
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

export default function ResultsModal({
  onClose,
  correct,
  totalSeconds,
  images,
}: ModalProps) {
  const [score, setScore] = useState(0);

  const handleNewGameClick = () => {
    onClose();
  };

  useEffect(() => {
    setScore(0);
  }, []);

  return (
    <motion.div
      style={{
        ...styles.glass,
        left: "50%",
        transform: "translateX(-50%)",
      }}
      className="absolute text-black z-10 w-[400px] h-[576px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      exit={{ opacity: 0 }}
    >
      <div className="relative flex flex-col justify-start items-center w-full h-full">
        {/* BODY */}
        <div className="w-full flex flex-col text-[#121212]">
          {/* HEADER */}
          <div className="w-full flex flex-col gap-[5px] bg-blue-600 p-[15px] text-white">
            <h1 className="font-[500] text-xl ">Results</h1>
            {/* STATS */}
            <div className="flex flex-row justify-between w-ful">
              {/* LEFT */}
              <div className="flex flex-col justify-center items-center">
                {/* SCORE */}
                <h1 className="font-bold text-3xl">
                  <motion.span id="score-count">{score}</motion.span>
                  /9
                </h1>
                <h3 className="mt-[-3px] text-sm">Score</h3>
              </div>
              {/* RIGHT */}
              <div className="flex flex-row gap-[10px]">
                <div className="flex flex-col justify-center items-center">
                  <h1 className="font-bold text-3xl">{totalSeconds}</h1>
                  <h3 className="mt-[-3px] text-sm">Time</h3>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <h1 className="font-bold text-3xl">
                    {Math.round((correct.length / 9) * 100)}%
                  </h1>
                  <h3 className="mt-[-3px] text-sm">Accuracy</h3>
                </div>
              </div>
            </div>
          </div>
          {/* IMAGE GRID */}
          <motion.div className="w-full h-[390px] grid grid-cols-3 grid-rows-3 gap-1 p-[15px]">
            {images.map((image) => (
              <ResultsGridImage
                key={image.key}
                index={image.key}
                src={image.src}
                correct={correct.includes(image.key)}
                updateScore={() => setScore(score + 1)}
                onClick={() => console.log("Results image clicked.")}
              />
            ))}
          </motion.div>
          {/* FOOTER */}
          <div className="flex flex-row justify-end p-[15px] pt-[0px]">
            <button
              className="h-[50px] w-[120px] flex p-[10px] text-white bg-blue-500 flex items-center justify-center font-[500]"
              onClick={handleNewGameClick}
            >
              NEW GAME
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const styles = {
  glass: {
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(25px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
  },
};

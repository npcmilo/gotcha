import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import GridImage from "~/components/play/gridImage";
import Game from "~/components/play/game";
import InstructionsModal from "~/components/play/instructionsModal";
import { Link } from "@remix-run/react";
import ResultsModal from "~/components/play/resultsModal";
import ManifestoModal from "~/components/play/manifestoModal";

interface PlayProps {
  onBack: () => void;
}

const settingsIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="35px"
    viewBox="0 -960 960 960"
    width="35px"
    fill="#000000"
  >
    <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
  </svg>
);

const leaderboardIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="35px"
    viewBox="0 -960 960 960"
    width="35px"
    fill="#000000"
  >
    <path d="M160-200h160v-320H160v320Zm240 0h160v-560H400v560Zm240 0h160v-240H640v240ZM80-120v-480h240v-240h320v320h240v400H80Z" />
  </svg>
);

const infoIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="35px"
    viewBox="0 -960 960 960"
    width="35px"
    fill="#121212"
  >
    <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
  </svg>
);

const manifestoIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="35px"
    viewBox="0 -960 960 960"
    width="35px"
    fill="#121212"
  >
    <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
  </svg>
);

const aiImageURLs = [
  "/app/assets/ai-1.png",
  "/app/assets/ai-2.png",
  "/app/assets/ai-3.png",
];

const realImageURLs = [
  "/app/assets/real-1.png",
  "/app/assets/real-2.png",
  "/app/assets/real-3.png",
  "/app/assets/real-4.png",
  "/app/assets/real-5.png",
  "/app/assets/real-6.png",
];

export default function Play({ onBack }: PlayProps) {
  const [isShowingInstructionsModal, setIsShowingInstructionsModal] =
    useState(false);
  const [isShowingResultsModal, setIsShowingResultsModal] = useState(false);
  const [isShowingManifestoModal, setIsShowingManifestoModal] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [correct, setCorrect] = useState<number[]>([]);
  const [gameIsRunning, setGameIsRunning] = useState(true);
  const [images, setImages] = useState<{ src: string; key: number }[]>([]);

  const handleVerifyClick = (correctSelections: number[], seconds: number) => {
    setIsShowingResultsModal(true);
    setCorrect(correctSelections);
    setTotalSeconds(seconds);
    setGameIsRunning(false);
  };

  function generateGameImages() {
    const shuffled = [...realImageURLs, ...aiImageURLs]
      .sort(() => Math.random() - 0.5)
      .map((src, index) => ({
        key: index + 1,
        src,
      }));

    const realIndexes = shuffled
      .filter((img) => realImageURLs.includes(img.src))
      .map((img) => img.key);

    setImages(shuffled);
    setCorrect(realIndexes);
  }

  useEffect(() => {
    generateGameImages();
  }, []);

  return (
    <motion.div className="h-screen w-screen bg-white flex justify-center items-center">
      <Header
        onBackClick={onBack}
        onManifestoClick={() => setIsShowingManifestoModal(true)}
      />
      <Game
        onInfoClick={() => setIsShowingInstructionsModal(true)}
        onRefreshClick={() => {
          generateGameImages();
          setTotalSeconds(0);
        }}
        disabled={!gameIsRunning}
        onGameEnd={handleVerifyClick}
        timeElapsed={totalSeconds}
        setTimeElapsed={setTotalSeconds}
        images={images}
        realImageIndexes={correct}
      />

      <AnimatePresence>
        {/* INSTRUCTIONS MODAL */}
        {isShowingInstructionsModal && (
          <InstructionsModal
            onClose={() => setIsShowingInstructionsModal(false)}
          />
        )}
        {/* RESULTS MODAL */}
        {isShowingResultsModal && (
          <ResultsModal
            onClose={() => {
              setIsShowingResultsModal(false);
              setTotalSeconds(0);
              setGameIsRunning(true); // force <Game /> to re-render
              generateGameImages();
            }}
            correct={correct}
            totalSeconds={`${Math.floor(totalSeconds / 60)}:${(totalSeconds % 60).toString().padStart(2, "0")}`}
            images={images}
          />
        )}
        {/* RESULTS MODAL */}
        {isShowingManifestoModal && (
          <ManifestoModal
            onClose={() => {
              setIsShowingManifestoModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const Header = ({
  onBackClick,
  onManifestoClick,
}: {
  onBackClick: () => void;
  onManifestoClick: () => void;
}) => {
  return (
    <div className="absolute top-10 left-0 flex w-full items-center justify-between pr-[20px] pl-[20px] mw-[500px]">
      <img
        src="/app/assets/logo.png"
        className="h-[25px] w-[95px] cursor-pointer"
        onClick={onBackClick}
      ></img>
      <div className="flex flex-row justify-center items-center gap-[10px]">
        <button onClick={onManifestoClick}>{manifestoIcon}</button>
      </div>
    </div>
  );
};

const styles = {
  glass: {
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
  },
};

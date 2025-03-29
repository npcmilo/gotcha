import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

import GridImage from "./gridImage";
interface GameProps {
  onInfoClick: () => void;
  onRefreshClick: () => void;
  disabled?: boolean;
  onGameEnd: (correctSelections: number[], totalSeconds: number) => void;
  timeElapsed: number;
  setTimeElapsed: Dispatch<SetStateAction<number>>;
  images: { src: string; key: number }[];
  realImageIndexes: number[];
}

declare global {
  interface Window {
    gameAudio: HTMLAudioElement;
  }
}

const headphonesIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="35px"
    viewBox="0 -960 960 960"
    width="35px"
    fill="#000000"
    className="mb-[4px]"
  >
    <path d="M360-120H200q-33 0-56.5-23.5T120-200v-280q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480v280q0 33-23.5 56.5T760-120H600v-320h160v-40q0-117-81.5-198.5T480-760q-117 0-198.5 81.5T200-480v40h160v320Zm-80-240h-80v160h80v-160Zm400 0v160h80v-160h-80Zm-400 0h-80 80Zm400 0h80-80Z" />
  </svg>
);

const infoIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="35px"
    viewBox="0 -960 960 960"
    width="35px"
    fill="#000000"
  >
    <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
  </svg>
);

const refreshIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="35px"
    viewBox="0 -960 960 960"
    width="35px"
    fill="#000000"
  >
    <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
  </svg>
);

const gridOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // all image indexes
const answerKey = [2, 4, 8];
// const answerKey = [1, 3, 5, 6, 7, 9]; // "real" image indexes

export default function Game({
  onInfoClick,
  onRefreshClick,
  disabled,
  onGameEnd,
  timeElapsed,
  setTimeElapsed,
  images,
  realImageIndexes,
}: GameProps) {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  /* Update Timer: Stop if game is disabled */
  useEffect(() => {
    if (!disabled) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [disabled]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleSelect = (key: number) => {
    if (disabled) return;
    setSelectedImages((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const containerStyle = {
    ...styles.glass,
    transition: "opacity 1s",
    ...(disabled && {
      opacity: 0.5,
      pointerEvents: "none" as const,
    }),
  };

  /* End Game: Calculate correct array and execute onGameEnd */
  const endGame = () => {
    // Calculate correct array
    const incorrect: number[] = [];
    realImageIndexes.forEach((key) => {
      if (!selectedImages.includes(key)) {
        incorrect.push(key);
      }
    });

    selectedImages.forEach((key) => {
      if (!realImageIndexes.includes(key)) {
        incorrect.push(key);
      }
    });

    const correct: number[] = gridOptions.filter((x) => !incorrect.includes(x));
    setSelectedImages([]); // Reset selected images
    onGameEnd(correct, timeElapsed); // Pass in total game time elapsed and correct array
  };

  return (
    <motion.div
      style={containerStyle}
      className="w-[400px] flex flex-col items-center justify-center p-[10px] gap-[7px]"
      transition={{ duration: 0.5 }}
    >
      {/* HEADER */}
      <div className="w-full h-[100px] flex-row flex justify-between items-start p-[20px] bg-blue-500 text-white">
        {/* LEFT TEXT */}
        <div className="items-start justify-center">
          <h3>Select all real images of</h3>
          <h1 className="text-[1.5em] font-bold mt-[-5px]">lebron james</h1>
        </div>
        {/* GAME TIMER */}
        <div className="flex flex-col justify-center items-center">
          <h1 id="game-timer" className="font-bold text-3xl">
            {formatTime(timeElapsed)}
          </h1>
        </div>
      </div>

      {/* IMAGE GRID */}
      <div className="w-full h-[390px] grid grid-cols-3 grid-rows-3 gap-1">
        {images.map((image) => (
          <GridImage
            key={image.key}
            src={image.src}
            selected={selectedImages.includes(image.key)}
            onClick={() => {
              toggleSelect(image.key);
            }}
            style={disabled ? { filter: "blur(2px)" } : null}
          />
        ))}
      </div>

      {/* FOOTER */}
      <div className="w-full h-[50px] justify-between items-center flex flex-row">
        <div className="flex flex-row h-full gap-[10px] flex items-center justify-center">
          <button onClick={onRefreshClick}>{refreshIcon}</button>
          <button
            onClick={() => {
              if (window.gameAudio) {
                window.gameAudio.currentTime = 0;
                window.gameAudio.play();
              } else {
                window.gameAudio = new Audio("/app/assets/instructions.mp3");
                window.gameAudio.play();
              }
            }}
          >
            {headphonesIcon}
          </button>
          <button onClick={onInfoClick}>{infoIcon}</button>
        </div>
        <button
          className="h-full w-[120px] flex p-[10px] text-white bg-blue-500 flex items-center justify-center font-[500]"
          onClick={endGame}
        >
          VERIFY
        </button>
      </div>
    </motion.div>
  );
}

const styles = {
  glass: {
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    transformStyle: "preserve-3d",
  },
};

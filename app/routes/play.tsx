import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Game from "~/components/play/game";
import InstructionsModal from "~/components/play/instructionsModal";
import ResultsModal from "~/components/play/resultsModal";
import ManifestoModal from "~/components/play/manifestoModal";
import { useNavigate } from "@remix-run/react";
import { useLoaderData, json } from "@remix-run/react";
import type { Level as AirtableLevel } from "../../utils/fetchLevels.server";
import { fetchLevels } from "../../utils/fetchLevels.server";
import type { LoaderFunction } from "@remix-run/node";

// --- Types ---
type Level = {
  title: string;
  images: Array<{
    url: string;
    isAiGenerated: boolean;
  }>;
  audioUrl?: string;
};

// --- Loader Function ---
export const loader: LoaderFunction = async () => {
  const levels = await fetchLevels();
  return levels;
};

// --- Layout Component ---
const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isShowingManifestoModal, setIsShowingManifestoModal] = useState(false);

  return (
    <div className="flex flex-col absolute inset-0">
      <div className="flex w-full items-center justify-between px-[20px] pt-[20px]">
        <Header
          onBackClick={() => navigate("/")}
          onManifestoClick={() => setIsShowingManifestoModal(true)}
        />
      </div>
      <div className="flex-1">{children}</div>
      <AnimatePresence>
        {isShowingManifestoModal && (
          <ManifestoModal onClose={() => setIsShowingManifestoModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Header ---
const Header = ({
  onBackClick,
  onManifestoClick,
}: {
  onBackClick: () => void;
  onManifestoClick: () => void;
}) => {
  return (
    <>
      <button onClick={onBackClick}>
        <img
          src="/app/assets/logo.png"
          className="h-[25px] w-[95px] cursor-pointer"
          alt="Gotcha Logo"
        />
      </button>
      <button onClick={onManifestoClick}>{manifestoIcon}</button>
    </>
  );
};

// --- Main Component ---
export default function Play() {
  const [gameTitle, setGameTitle] = useState<string>("");
  const [gameAudio, setGameAudio] = useState<string>("");
  const [images, setImages] = useState<{ src: string; key: number }[]>([]);
  const [correct, setCorrect] = useState<number[]>([]);
  const [gameIsRunning, setGameIsRunning] = useState(true);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isShowingInstructionsModal, setIsShowingInstructionsModal] =
    useState(false);
  const [isShowingResultsModal, setIsShowingResultsModal] = useState(false);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [shuffledLevels, setShuffledLevels] = useState<Level[]>([]);
  const [preloadedLevels, setPreloadedLevels] = useState<Level[]>([]);
  const [realImages, setRealImages] = useState<string[]>([]);

  // Get levels from loader data
  const airtableLevels = useLoaderData<AirtableLevel[]>();

  // Convert Airtable levels to our Level format
  useEffect(() => {
    if (airtableLevels && airtableLevels.length > 0 && shuffledLevels.length === 0) {
      const convertedLevels: Level[] = airtableLevels.map(level => ({
        title: level.title,
        audioUrl: level.audio,
        images: [
          ...level.realImages.map((url: string) => ({ url, isAiGenerated: false })),
          ...level.aiImages.map((url: string) => ({ url, isAiGenerated: true }))
        ]
      }));

      setShuffledLevels(convertedLevels);
    }
  }, [airtableLevels]);

  // Preload next 2 levels
  useEffect(() => {
    if (shuffledLevels.length > 0) {
      const nextIndex = (currentLevelIndex + 1) % shuffledLevels.length;
      const nextNextIndex = (currentLevelIndex + 2) % shuffledLevels.length;

      const nextLevels = [
        shuffledLevels[nextIndex],
        shuffledLevels[nextNextIndex],
      ];

      // Preload images for next levels
      const preloadPromises = nextLevels.map((level) => {
        const allImages = [...level.images];
        return Promise.all(
          allImages.map(
            (img) =>
              new Promise<void>((resolve) => {
                const image = new Image();
                image.src = img.url;
                image.onload = () => resolve();
              })
          )
        );
      });

      Promise.all(preloadPromises).then(() => {
        setPreloadedLevels(nextLevels);
      });
    }
  }, [shuffledLevels, currentLevelIndex]);

  useEffect(() => {
    // Disable scroll
    document.body.style.overflow = "hidden";

    if (shuffledLevels.length > 0) {
      loadLevel(shuffledLevels[currentLevelIndex]);
    }

    // Re-enable scroll on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [shuffledLevels, currentLevelIndex]);

  const loadLevel = (level: Level) => {
    const realImages = level.images
      .filter((img) => !img.isAiGenerated)
      .map((img) => img.url);
    const aiImages = level.images
      .filter((img) => img.isAiGenerated)
      .map((img) => img.url);
    const combined = [...realImages, ...aiImages];
    // Simplified version - no preloading
    const shuffled = combined
      .sort(() => Math.random() - 0.5)
      .map((src, i) => ({ src, key: i + 1 }));

    // correct keys is array of real images
    const correctKeys = shuffled
      .filter((img) => realImages.includes(img.src))
      .map((img) => img.key);

    setRealImages(realImages);
    setImages(shuffled);
    setCorrect(correctKeys);
    setGameTitle(level.title);
    setGameAudio(level.audioUrl || "");
  };

  const handleVerifyClick = (correctSelections: number[], seconds: number) => {
    setIsShowingResultsModal(true);
    setCorrect(correctSelections);
    setTotalSeconds(seconds);
    setGameIsRunning(false);
  };

  const nextLevel = () => {
    if (shuffledLevels.length === 0) return;

    // If we have preloaded levels, use the first one
    if (preloadedLevels.length > 0) {
      const nextLevel = preloadedLevels[0];
      const nextIndex = shuffledLevels.findIndex(
        (level) => level.title === nextLevel.title
      );
      setCurrentLevelIndex(nextIndex);
      // Remove the used level from preloaded levels
      setPreloadedLevels((prev) => prev.slice(1));
    } else {
      // Fallback to the old behavior if no preloaded levels
      setCurrentLevelIndex((prev) => (prev + 1) % shuffledLevels.length);
    }

    setGameIsRunning(true);
    setTotalSeconds(0);
  };

  if (shuffledLevels.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        className="h-full bg-white flex justify-center items-center"
        transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
        key={currentLevelIndex}
      >
        <Game
          onInfoClick={() => setIsShowingInstructionsModal(true)}
          onRefreshClick={nextLevel}
          disabled={!gameIsRunning}
          onGameEnd={handleVerifyClick}
          timeElapsed={totalSeconds}
          setTimeElapsed={setTotalSeconds}
          images={images}
          realImageIndexes={correct}
          title={gameTitle}
          audio={gameAudio}
        />

        <AnimatePresence>
          {isShowingInstructionsModal && (
            <InstructionsModal
              onClose={() => setIsShowingInstructionsModal(false)}
            />
          )}
          {isShowingResultsModal && (
            <ResultsModal
              onClose={() => {
                setIsShowingResultsModal(false);
                nextLevel();
              }}
              correct={correct}
              totalSeconds={`${Math.floor(totalSeconds / 60)}:${(
                totalSeconds % 60
              )
                .toString()
                .padStart(2, "0")}`}
              images={images}
              realImages={realImages}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
}

// --- Icon ---
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

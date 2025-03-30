import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Game from "~/components/play/game";
import InstructionsModal from "~/components/play/instructionsModal";
import ResultsModal from "~/components/play/resultsModal";
import ManifestoModal from "~/components/play/manifestoModal";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { fetchLevels } from "~/utils/fetchLevels.server";

// --- Types ---
type Level = {
  title: string;
  realImages: string[];
  aiImages: string[];
  audio: string;
};

// --- Loader (runs on server) ---
export async function loader({ request }: LoaderFunctionArgs) {
  const levels = await fetchLevels();
  return json({ levels });
}

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
  const [isShowingManifestoModal, setIsShowingManifestoModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [levels, setLevels] = useState<Level[]>([]);

  const serverData = useLoaderData<typeof loader>();

  useEffect(() => {
    if (serverData?.levels && serverData.levels.length > 0) {
      setLevels(serverData.levels);
    }
  }, [serverData]);

  useEffect(() => {
    if (!levels || levels.length === 0) return;
    loadRandomLevel();
  }, [levels]);

  const loadRandomLevel = () => {
    setLoading(true);
    const validLevels = levels.filter(
      (lvl) =>
        lvl.title && (lvl.realImages.length > 0 || lvl.aiImages.length > 0),
    );
    if (validLevels.length === 0) return;

    const randomLevel =
      validLevels[Math.floor(Math.random() * validLevels.length)];

    const combined = [...randomLevel.realImages, ...randomLevel.aiImages];
    const preloadImages = combined.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve();
        }),
    );

    Promise.all(preloadImages).then(() => {
      const shuffled = combined
        .sort(() => Math.random() - 0.5)
        .map((src, i) => ({ src, key: i + 1 }));

      const correctKeys = shuffled
        .filter((img) => randomLevel.realImages.includes(img.src))
        .map((img) => img.key);

      setImages(shuffled);
      setCorrect(correctKeys);
      setGameTitle(randomLevel.title);
      setGameAudio(randomLevel.audio);
      setLoading(false);
    });
  };

  const handleVerifyClick = (correctSelections: number[], seconds: number) => {
    setIsShowingResultsModal(true);
    setCorrect(correctSelections);
    setTotalSeconds(seconds);
    setGameIsRunning(false);
  };

  const refreshLevel = () => {
    setGameIsRunning(true);
    setTotalSeconds(0);
    loadRandomLevel();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <motion.div
      key="play"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
      className="absolute inset-0"
    >
      <motion.div className="h-screen w-screen bg-white flex justify-center items-center">
        <Header
          onBackClick={() => navigate("/")}
          onManifestoClick={() => setIsShowingManifestoModal(true)}
        />
        <Game
          onInfoClick={() => setIsShowingInstructionsModal(true)}
          onRefreshClick={refreshLevel}
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
                refreshLevel();
              }}
              correct={correct}
              totalSeconds={`${Math.floor(totalSeconds / 60)}:${(
                totalSeconds % 60
              )
                .toString()
                .padStart(2, "0")}`}
              images={images}
            />
          )}
          {isShowingManifestoModal && (
            <ManifestoModal onClose={() => setIsShowingManifestoModal(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// --- Header ---
const Header = ({
  onBackClick,
  onManifestoClick,
}: {
  onBackClick: () => void;
  onManifestoClick: () => void;
}) => {
  return (
    <div className="absolute top-10 left-0 flex w-full items-center justify-between pr-[20px] pl-[20px] mw-[500px]">
      <button onClick={onBackClick}>
        <img
          src="/app/assets/logo.png"
          className="h-[25px] w-[95px] cursor-pointer"
          alt="Gotcha Logo"
        />
      </button>
      <div className="flex flex-row justify-center items-center gap-[10px]">
        <button onClick={onManifestoClick}>{manifestoIcon}</button>
      </div>
    </div>
  );
};

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

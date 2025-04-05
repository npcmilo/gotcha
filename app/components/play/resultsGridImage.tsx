import { AnimatePresence, motion } from "framer-motion";

const checkIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="#FFFFFF"
  >
    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </svg>
);

const xIcon = (
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

interface Props {
  src: string;
  correct: boolean;
  onClick: () => void;
  style?: any;
  index: number;
  updateScore: () => void;
  isReal: boolean;
}

export default function ResultsGridImage({
  src,
  correct,
  onClick,
  style,
  index,
  updateScore,
  isReal,
}: Props) {
  const animationDelay = 0.8 + index * 0.2;
  return (
    <motion.div
      onClick={onClick}
      className="flex justify-center items-center relative cursor-pointer"
      whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
      key={src}
    >
      {!correct && isReal && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: animationDelay }}
          className="absolute top-[-6px] left-[-6px] w-7 h-7 rounded-full bg-red-500 flex items-center justify-center z-10"
          key={src + "-x"}
        >
          {xIcon}
        </motion.div>
      )}
      {correct && isReal && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: animationDelay }}
          className="absolute top-[-6px] left-[-6px] w-7 h-7 rounded-full bg-green-500 flex items-center justify-center z-10"
          onAnimationComplete={() => {
            updateScore();
          }}
          key={src + "-check"}
        >
          {checkIcon}
        </motion.div>
      )}
      <img
        src={src}
        alt="Gotcha"
        className="w-full h-full object-cover"
        style={style}
      />
    </motion.div>
  );
}

// app/components/play/gridImage.tsx
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

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

interface Props {
  src: string;
  selected: boolean;
  onClick: () => void;
  style?: React.CSSProperties | null;
  isLoaded?: boolean;
}

export default function GridImage({
  src,
  selected,
  onClick,
  style,
  isLoaded = false,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onClick={onClick}
      className="flex justify-center items-center relative cursor-pointer"
      whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        cursor: "pointer",
        border: selected ? "3px solid #3b82f6" : "3px solid transparent",
      }}
    >
      {/* Blur placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-[-6px] left-[-6px] w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center z-10"
          >
            {checkIcon}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.img
        src={src}
        alt="Grid Image"
        className="w-full h-full object-cover"
        loading="lazy"
        style={{
          filter: isHovered ? "brightness(1.1)" : "brightness(1)",
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          ...style
        }}
      />
    </motion.div>
  );
}

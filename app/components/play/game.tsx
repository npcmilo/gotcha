import { useState } from "react";
import { motion } from "framer-motion";

import GridImage from "./gridImage";
import Modal from "./modal";

interface GameProps {
  onInfoClick: () => void;
}

const images = [
  {
    src: "https://images.unsplash.com/photo-1520255870062-bd79d3865de7",
    key: 1,
  },
  {
    src: "https://images.unsplash.com/photo-1519302959554-a75be0afc82a",
    key: 2,
  },
  {
    src: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166",
    key: 3,
  },
  {
    src: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166",
    key: 4,
  },
  {
    src: "https://images.unsplash.com/photo-1575999502951-4ab25b5ca889",
    key: 5,
  },
  {
    src: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a",
    key: 6,
  },
  {
    src: "https://images.unsplash.com/photo-1520255870062-bd79d3865de7",
    key: 7,
  },
  {
    src: "https://images.unsplash.com/photo-1563296291-14f26f10c20f",
    key: 8,
  },
  {
    src: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a",
    key: 9,
  },
];

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

export default function Game({ onInfoClick }: GameProps) {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  const toggleSelect = (key: number) => {
    setSelectedImages((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <motion.div
      style={styles.glass}
      className="w-[400px] flex flex-col items-center justify-center p-[10px] gap-[7px]"
    >
      {/* HEADER */}
      <div className="w-full h-[100px] flex-col flex items-start justify-center p-[20px] bg-blue-500 text-white">
        <h3>Select all real images with</h3>
        <h1 className="text-[1.5em] font-bold mt-[-5px]">boats</h1>
      </div>

      {/* IMAGE GRID */}
      <div className="w-full h-[390px] grid grid-cols-3 grid-rows-3 gap-1">
        {images.map((image) => (
          <GridImage
            key={image.key}
            src={image.src}
            selected={selectedImages.includes(image.key)}
            onClick={() => toggleSelect(image.key)}
          />
        ))}
      </div>

      {/* FOOTER */}
      <div className="w-full h-[50px] justify-between items-center flex flex-row">
        <div className="flex flex-row h-full gap-[10px] flex items-center justify-center">
          <button>{refreshIcon}</button>
          <button>{headphonesIcon}</button>
          <button onClick={onInfoClick}>{infoIcon}</button>
        </div>
        <button className="h-full w-[120px] flex p-[10px] text-white bg-blue-500 flex items-center justify-center font-[500]">
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
  },
};

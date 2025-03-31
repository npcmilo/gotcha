import { useState } from "react";
import { Link } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "~/components/common/button";
import ManifestoModal from "~/components/play/manifestoModal";

interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  const [isShowingManifestoModal, setIsShowingManifestoModal] =
    useState<boolean>(false);

  return (
    <motion.div className="h-screen w-screen bg-white text-[#121212] flex flex-col gap-[30px] justify-center items-center">
      {/* LOGO */}
      <img src="/app/assets/logo.png" alt="Gotcha logo" className="h-[50px]" />

      <h1 className="text-center md:text-2xl">
        <span className="sm:hidden">
          Identify real photos from AI-generated ones.
        </span>
        <span className="hidden sm:block">
          <span className="whitespace-nowrap">Identify <span className="italic">real</span> photos</span>
          <br />
          from AI-generated ones.
        </span>
      </h1>

      {/* BUTTONS */}
      <div className="flex flex-col gap-[10px] text-[14px]">
        <Button
          style={styles.button}
          hoverColor="bg-blue-600"
          onClick={onStart}
        >
          Play
        </Button>
        <Button
          style={styles.button}
          hoverColor="bg-[#121212]"
          onClick={() => setIsShowingManifestoModal(true)}
        >
          Manifesto
        </Button>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col justify-center items-center leading-[1.25]">
        <h4 className="text-[1em] leading-[1.25] font-[600]">
          {new Date().toLocaleString("default", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h4>
        <p className="text-[1em] font-[300] leading-[1.25]">
          A{" "}
          <a
            href="https://fortytwoco.net"
            className="underline hover:text-blue-600 transition-colors"
          >
            FORTYTWO
          </a>{" "}
          Experience
        </p>
      </div>

      <AnimatePresence>
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

const styles = {
  button: {
    height: "42px",
    width: "180px",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50px",

    borderWidth: "1px",
    borderColor: "#121212",
  },
};

import { useState } from "react";
import { Link } from "@remix-run/react";
import { motion } from "framer-motion";

interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  return (
    <motion.div className="h-screen w-screen bg-white text-[#121212] flex flex-col gap-[30px] justify-center items-center">
      {/* LOGO */}
      <img src="/app/assets/logo.png" alt="Gotcha logo" className="h-[50px]" />

      <h1>
        Identify <span className="italic">real</span> photos from AI-generated
        ones.
      </h1>

      {/* BUTTONS */}
      <div onClick={onStart} className="flex flex-col gap-[10px] text-[14px]">
        <button style={styles.button} className="bg-[#121212] text-white">
          Play
        </button>
        <button style={styles.button}>Log In</button>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col justify-center items-center">
        <h4 className="text-[14px]">
          {new Date().toLocaleString("default", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h4>
        <h5 className="text-[12px] font-[300]">A FORTYTWO Experience</h5>
      </div>
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

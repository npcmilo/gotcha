import { useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "@remix-run/react";
import Play from "./play";
import Home from "./home";

export const meta: MetaFunction = () => {
  return [{ title: "Gotcha!" }, { name: "description", content: "Home" }];
};

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center h-screen w-screen bg-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key="home"
          initial={{ x: "-100%", opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
        >
          <Home onStart={() => navigate("/play")} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

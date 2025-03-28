import { useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import { AnimatePresence, motion } from "framer-motion";
import Play from "./play";
import Home from "./home";

export const meta: MetaFunction = () => {
  return [{ title: "Gotcha" }, { name: "description", content: "Home" }];
};

export default function Index() {
  const [screen, setScreen] = useState<"home" | "play">("home");

  return (
    <div className="relative flex items-center justify-center h-screen w-screen bg-white overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === "home" && (
          <motion.div
            key="home"
            initial={{ x: "-100%", opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
          >
            <Home onStart={() => setScreen("play")} />
          </motion.div>
        )}
        {screen === "play" && (
          <motion.div
            key="play"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="absolute inset-0"
          >
            <Play onBack={() => setScreen("home")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

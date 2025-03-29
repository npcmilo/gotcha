import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  style?: any;
  hoverColor?: string;
}

export default function Button({
  children,
  onClick,
  style,
  hoverColor,
}: ButtonProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      whileHover="hover"
      style={style}
      className={`relative flex items-center justify-center overflow-hidden text-black bg-white`}
      onMouseEnter={(e) => setIsHovering(true)}
      onMouseLeave={(e) => setIsHovering(false)}
    >
      <motion.div
        style={styles.bgButtonFill}
        className={`absolute top-1/2 left-1/2 w-[180px] h-[50px] ${hoverColor ? hoverColor : "bg-blue-600"}`}
        animate={{
          scale: isHovering ? 200 : 1,
          opacity: isHovering ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
      ></motion.div>

      {/* Text */}
      <motion.span
        variants={{
          hover: { color: "#ffffff" },
          initial: { color: "#000000" },
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="z-[10]"
      >
        {children}
      </motion.span>
    </motion.button>
  );
}

const styles = {
  bgButtonFill: {
    width: "1px",
    height: "1px",
    borderRadius: "50%",
  },
};

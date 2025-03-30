import { motion } from "framer-motion";
import { useState } from "react";

interface ModalProps {
  onClose: () => void;
}

const closeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="35px"
    viewBox="0 -960 960 960"
    width="35px"
    fill="#121212"
    className="absolute right-[5vw] top-[0vh] cursor-pointer"
  >
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

const volumeOffIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="#000000"
  >
    <path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z" />
  </svg>
);

const volumeOnIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="#000000"
  >
    <path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z" />
  </svg>
);

const LikeIcon = ({ fill = "#000000" }: { fill?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill={fill}
  >
    <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
  </svg>
);

export default function ManifestoModal({ onClose }: ModalProps) {
  const [liked, setLiked] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  return (
    <motion.div
      initial={{ bottom: -1000 }}
      animate={{ bottom: 0 }}
      exit={{ bottom: -1000 }}
      style={styles.glass}
      className="w-screen absolute left-0 bottom-0 h-[90vh] flex flex-col justify-start items-start text-[#121212] pt-[5vh] pb-[10vh] gap-[25px] z-20"
    >
      {/* HEADER */}
      <div className="w-full relative pr-[30px] pl-[30px]">
        <span className="flex flex-row gap-[7px] items-center">
          <h1 className="text-[26px] font-bold">Why</h1>
          <span className="flex flex-row gap-[2px] items-center">
            <img
              src="/app/assets/logo-alt.png"
              alt="Gotcha Logo"
              className="h-[24px] mb-[3px]"
            />
          </span>
        </span>
        <h3>
          AI is <span className="italic">deceptive</span>.
        </h3>
        <div onClick={onClose}>{closeIcon}</div>
      </div>

      {/* BODY */}
      <div className="relative w-full flex flex-col gap-[30px] text-sm max-w-[500px]">
        <div className="relative">
          <img
            src="/app/assets/manifesto-img-5.png"
            alt="AI being deceptive"
            className="max-h-[340px] max-w-[350px] w-[70vw] h-[67vw]"
          />
        </div>
        <div className="flex flex-col gap-[10px] justify-center items-center">
          <p className="pr-[30px] pl-[30px]">
            Soon enough, you'll be just like your technologically-illiterate
            relatives. AI-generated content faces little to no regulations as
            <span className="font-[600] italic">
              {" "}
              policy makers are unable to keep up{" "}
            </span>
            with the technology's rapid development.
          </p>
          <p className="pr-[30px] pl-[30px]">
            Stay vigilant and help your friends and family recognize
            AI-generated content{" "}
            <span className="font-[600] italic">before it's too late</span>.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

const styles = {
  glass: {
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
  },
};

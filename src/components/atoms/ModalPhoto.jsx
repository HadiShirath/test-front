/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

export default function ModalPhoto({ photo, isModalOpen, setIsModalOpen, previewImageLocal}) {

  const apiUrlBase = import.meta.env.VITE_API_URL_BASE;

  return (
    <div className="fixed w-full h-full flex top-0 bottom-0 items-center justify-center z-[70]"
    onClick={() => setIsModalOpen(!isModalOpen)}
    >
      <div
        className="w-full h-full bg-black opacity-70"
      />
      <motion.div
        initial={{ opacity: 0.5, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 40,
        }}
        className="border-opacity-40 w-[85%] rounded-3xl absolute"

      >
        <div className="w-full flex items-center justify-center object-contain">
          <img
            src={previewImageLocal ? photo : `${apiUrlBase}/images/${photo}`}
            alt=""
            className="w-full xl:w-auto xl:h-[700px]"
          />
        </div>
      </motion.div>
    </div>
  );
}

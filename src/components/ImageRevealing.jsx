import { motion } from "framer-motion";

const RevealImage = ({ src, alt, delay = 0 }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Actual Image */}
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Unreveal Mask */}
      <motion.div
        className="absolute inset-0 bg-white z-10"
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{
          delay,
          duration: 1.2,
          ease: [0.76, 0, 0.24, 1],
        }}
      />
    </div>
  );
};

export default RevealImage;

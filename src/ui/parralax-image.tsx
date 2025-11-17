import { useRef, useState } from "react";

import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxImageProps {
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function ParallaxImage({
  alt,
  width,
  height,
  className,
}: ParallaxImageProps) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        style={{ y }}
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full h-full"
      >
        <img
          src="/placeholder.svg"
          alt={alt}
          width={width}
          height={height}
          className="object-cover w-full h-full"
        />
      </motion.div>
    </motion.div>
  );
}

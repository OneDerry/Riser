import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "../shared/common";
import backgroundImage from "../assets/background.jpg";

import Navbar from "./navbar";

export const Hero = () => {
  const navigate = useNavigate();
  const scrollToContent = () => {
    const contentSection = document.getElementById("content-section");
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat h-full w-full"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/40" />
      </motion.div>

      <div className="relative z-10 h-full">
        <Navbar />
        <div className="container mx-auto px-4 h-screen flex flex-col justify-center">
          <div className="max-w-2xl ml-0 md:ml-10 lg:ml-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20">
                Where Excellence Meets Character
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-300 via-blue-100 to-white bg-clip-text text-transparent drop-shadow-sm">
                Welcome to Riser
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl leading-relaxed"
            >
              Faith, Industry, and Service. Our emphasis is not just education
              but formation, creating well-rounded individuals prepared for
              life's challenges.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className=""
            >
              <div className="grid grid-cols-2 gap-4 items-center">
                  <Button
                    onClick={() => navigate("/enroll")}
                    variant="default"
                    className="bg-blue-800 hover:bg-blue-700 border-blue-700 border w-full text-white text-sm group flex items-center justify-center p-3 rounded-md"
                  >
                    Enroll
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>

                <Button className="border-white/30 border border-blue-700 w-full text-white text-sm hover:bg-white/10 backdrop-blur-sm flex items-center justify-center p-3 rounded-md">
                  Explore Programs
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
            onClick={scrollToContent}
          >
            <span className="text-white/80 text-sm mb-2">Discover More</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="h-6 w-6 text-white/80" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-1/3 h-screen overflow-hidden z-[5] pointer-events-none">
        <div className="absolute -right-20 top-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -right-20 bottom-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent z-[5] pointer-events-none"></div>
    </div>
  );
};

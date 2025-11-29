/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  X,
  Maximize2,
  ExternalLink,
  Binoculars,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";

import classes from "../assets/interior/classes.jpg";
import buildings from "../assets/school_building.jpg";
import complete from "../assets/interior/complete.jpg";
import library from "../assets/interior/library.jpg";
import lab from "../assets/interior/lab.jpg";
import independence from "../assets/interior/Independence.jpg";
import backgroundImage from "../assets/school_building.jpg";

import { cn } from "../lib/utils";

interface GalleryItem {
  id: number;
  name: string;
  desc: string;
  imageSrc: string;
  category: string;
}

const ImmsersiveGallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  // Removed cursorPosition state since it's not being used
  const [cursorHovered, setCursorHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 40, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Parallax effect for header
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Gallery items with proper image paths
  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      name: "Modern Classrooms",
      desc: "Inspiring learning spaces designed for collaboration",
      imageSrc: classes,
      category: "Academic",
    },
    {
      id: 2,
      name: "School Architecture",
      desc: "Award-winning campus design",
      imageSrc: buildings,
      category: "Facilities",
    },
    {
      id: 3,
      name: "Interior Design",
      desc: "Thoughtfully crafted spaces for optimal learning",
      imageSrc: complete,
      category: "Facilities",
    },
    {
      id: 4,
      name: "Extensive Library",
      desc: "A treasure trove of knowledge and resources",
      imageSrc: library,
      category: "Academic",
    },
    {
      id: 5,
      name: "State-of-the-Art Laboratory",
      desc: "Where scientific discovery comes to life",
      imageSrc: lab,
      category: "Academic",
    },
    {
      id: 6,
      name: "Cultural Celebrations",
      desc: "Honoring diversity and heritage",
      imageSrc: independence,
      category: "Events",
    },
  ];

  // Categories for filtering
  const categories = [
    "All",
    ...new Set(galleryItems.map((item) => item.category)),
  ];
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState(galleryItems);

  // Filter items when category changes
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredItems(galleryItems);
    } else {
      setFilteredItems(
        galleryItems.filter((item) => item.category === activeCategory)
      );
    }
  }, [activeCategory, galleryItems]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Staggered animation for gallery items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 18,
      },
    },
  };

  // Ref for header animation
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Ref for gallery animation
  const [galleryRef, galleryInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="gallery"
      className="relative min-h-screen overflow-hidden py-20"
    >
      {/* Background image layer */}
      <div
        className="pointer-events-none absolute inset-0 -z-30 bg-cover bg-center bg-fixed opacity-80"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Custom cursor */}
      <motion.div
        className={cn(
          "fixed w-12 h-12 rounded-full pointer-events-none z-30 mix-blend-difference",
          cursorHovered ? "bg-white" : "bg-primary"
        )}
        style={{
          x: springX,
          y: springY,
          scale: cursorHovered ? 2 : 1,
        }}
        animate={{
          scale: cursorHovered ? 2 : 1,
        }}
        transition={{
          scale: { type: "spring", damping: 30 },
        }}
      />

      {/* Background elements */}
      <div className="absolute inset-0  bg-black/70" />

      <div className="container mx-auto px-4 relative z-20">
        {/* Header section with parallax effect */}
        <motion.div
          ref={headerRef}
          style={{ y, opacity }}
          className="text-center mb-16 relative"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="inline-block"
          >
            <div className="inline-block bg-blue-100 px-4 py-1 rounded-full mb-4">
              <span className="text-blue-800 font-medium flex items-center gap-2">
                <Binoculars />
                Virtual Tour
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mt-6 text-5xl md:text-6xl lg:text-7xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900"
          >
            A Glimpse
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mt-4 text-xl md:text-2xl font-serif text-white max-w-xl mx-auto"
          >
            Immerse yourself in our world-class facilities and vibrant community
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            // transition={{ duration: 1 }}
            className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-8"
          />
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={galleryInView ? { opacity: 1, y: 0 } : {}}
          // transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeCategory === category
                  ? "bg-primary text-black shadow-lg shadow-primary/20"
                  : "bg-white/80 text-blue-700 hover:bg-white hover:shadow-md"
              )}
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Gallery grid - Fixed the duplicate ref issue by combining them */}
        <motion.div
          ref={(el) => {
            // @ts-expect-error - This is a workaround for the dual ref issue
            containerRef.current = el;
            if (galleryRef && typeof galleryRef === "function") galleryRef(el);
          }}
          variants={containerVariants}
          initial="hidden"
          animate={galleryInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative overflow-hidden rounded-xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500"
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                onClick={() => setSelectedImage(item)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={
                        item.imageSrc || `/placeholder.svg?height=400&width=600`
                      }
                      alt={item.name}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                <div className="p-6 relative">
                  <div className="absolute -top-10 right-6 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-2">
                    <Maximize2 className="w-5 h-5 text-primary" />
                  </div>

                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {item.category}
                  </span>

                  <h3 className="mt-3 text-xl font-serif font-bold text-slate-800 group-hover:text-primary transition-colors duration-300">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-slate-600 text-sm">{item.desc}</p>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-slate-500">View details</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fullscreen image modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              // transition={{ type: "spring" }}
              className="relative max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <img
                  src={
                    selectedImage.imageSrc ||
                    `/placeholder.svg?height=800&width=1200` ||
                    "/placeholder.svg"
                  }
                  alt={selectedImage.name}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="absolute top-4 right-4 z-10">
                <button
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 text-white">
                <h2 className="text-2xl font-serif font-bold">
                  {selectedImage.name}
                </h2>
                <p className="mt-2 text-white/80">{selectedImage.desc}</p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-sm">
                    {selectedImage.category}
                  </span>
                  <button className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4" /> View more
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ImmsersiveGallery;

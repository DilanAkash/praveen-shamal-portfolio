import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// adjust paths based on where Hero.tsx is located
import heroText from "../assets/hero-text.png";
import heroPhoto from "../assets/hero-photo.png";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Desktop animations
  const leftX = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const rightX = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mobile animations
  const mobileTextY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const mobilePhotoY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const mobileScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen bg-neutral-100 overflow-hidden"
    >
      {/* Desktop Layout */}
      <div className="hidden lg:flex items-end justify-center min-h-screen">
        <div className="container mx-auto px-8 w-full pb-0">
          <div className="grid grid-cols-2 gap-4 items-center">
            {/* Left Side - Text Section */}
            <motion.div
              style={{ x: leftX, opacity }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative z-10 select-none pointer-events-none"
            >
              <img
                src={heroText}
                alt="Praveen Shamal - A Professional Photographer"
                className="w-full h-auto select-none"
                draggable="false"
              />
            </motion.div>

            {/* Right Side - Photos */}
            <motion.div
              style={{ x: rightX, opacity }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="relative z-10 select-none pointer-events-none self-end"
            >
              <img
                src={heroPhoto}
                alt="Praveen Shamal"
                className="w-full h-auto select-none"
                draggable="false"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col justify-end items-center min-h-screen pb-0 pt-20 relative">
        {/* Text Section - Mobile (Behind) */}
        <motion.div
          style={{ y: mobileTextY }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-0 select-none pointer-events-none w-full px-6 mb-auto"
        >
          <img
            src={heroText}
            alt="Praveen Shamal - A Professional Photographer"
            className="w-full h-auto select-none"
            draggable="false"
          />
        </motion.div>

        {/* Photos - Mobile (In Front) */}
        <motion.div
          style={{ y: mobilePhotoY, scale: mobileScale }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="relative z-10 select-none pointer-events-none w-full -mt-4"
        >
          <img
            src={heroPhoto}
            alt="Praveen Shamal"
            className="w-full h-auto select-none"
            draggable="false"
          />
        </motion.div>
      </div>

      {/* Scroll Indicator - Desktop Only */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="hidden lg:flex absolute bottom-10 left-1/2 transform -translate-x-1/2 flex-col items-center text-gray-600"
      >
        <span className="text-sm tracking-wider">SCROLL</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-0.5 h-8 bg-gray-400 mt-2"
        />
      </motion.div>
    </section>
  );
}

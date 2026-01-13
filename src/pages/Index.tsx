import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DoorEntry from "@/components/home/DoorEntry";
import HomeInterior from "@/components/home/HomeInterior";

const Index = () => {
  const [isInside, setIsInside] = useState(false);

  useEffect(() => {
    const isHome = localStorage.getItem("isHome");
    if (isHome === "true") {
      setIsInside(true);
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem("isHome", "true");
    setIsInside(true);
  };

  const handleLeave = () => {
    localStorage.removeItem("isHome");
    setIsInside(false);
  };

  return (
    <AnimatePresence mode="wait">
      {!isInside ? (
        <motion.div
          key="door"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <DoorEntry onEnter={handleEnter} />
        </motion.div>
      ) : (
        <motion.div
          key="interior"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HomeInterior onLeave={handleLeave} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;

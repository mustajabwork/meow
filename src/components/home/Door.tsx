import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DoorProps {
  onEnter: () => void;
  isOpening: boolean;
  knockCount: number;
}

const Door = ({ onEnter, isOpening, knockCount }: DoorProps) => {
  return (
    <div className="relative w-72 h-[420px] mx-auto" style={{ perspective: "1200px" }}>
      {/* Heavy door frame - brutalist concrete */}
      <div className="absolute inset-0 concrete border-8 border-black" />
      
      {/* Warning stripes at top */}
      <div className="absolute -top-4 left-0 right-0 h-4 warning-tape" />
      
      {/* The brutal door */}
      <motion.div
        className={`absolute inset-3 brutal-door cursor-pointer origin-left ${knockCount > 0 ? 'knocking' : ''}`}
        animate={isOpening ? { rotateY: -85 } : { rotateY: 0 }}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        onClick={onEnter}
        whileHover={!isOpening ? { rotateY: -3, scale: 1.01 } : {}}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Steel reinforcement bars */}
        <div className="absolute top-6 left-4 right-4 h-1 bg-black/60" />
        <div className="absolute top-12 left-4 right-4 h-1 bg-black/60" />
        <div className="absolute bottom-20 left-4 right-4 h-1 bg-black/60" />
        <div className="absolute bottom-12 left-4 right-4 h-1 bg-black/60" />

        {/* Door panels - heavy industrial */}
        <div className="absolute top-16 left-5 right-5 h-32 border-4 border-black/50 bg-black/20" />
        <div className="absolute bottom-24 left-5 right-5 h-36 border-4 border-black/50 bg-black/20" />

        {/* Heavy door knocker */}
        <div className="absolute right-6 top-1/3">
          <motion.div 
            className="door-knocker w-10 h-16 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <div className="w-6 h-8 border-4 border-black/70 rounded-full" />
          </motion.div>
        </div>

        {/* Industrial handle */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2">
          <div className="w-5 h-16 bg-gradient-to-b from-zinc-500 to-zinc-700 border-3 border-black shadow-brutal-sm" />
        </div>

        {/* Room number */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2">
          <span className="font-heading text-2xl text-foreground/60 tracking-widest">001</span>
        </div>

        {/* Light peeping through when opening */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={isOpening ? { opacity: 1 } : { opacity: 0 }}
          style={{
            background: "linear-gradient(90deg, hsl(25 90% 50% / 0.5), transparent 50%)",
          }}
        />
      </motion.div>

      {/* Harsh light from inside when door opens */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="absolute inset-3 bg-gradient-to-r from-primary/40 to-transparent origin-left"
          />
        )}
      </AnimatePresence>

      {/* Floor shadow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full h-8 bg-black/50 blur-md" />
    </div>
  );
};

export default Door;
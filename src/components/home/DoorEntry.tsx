import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Door from "./Door";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface DoorEntryProps {
  onEnter: () => void;
}

const KNOCK_MESSAGES = [
  "KNOCK KNOCK...",
  "WHO'S THERE?",
  "IDENTIFY YOURSELF.",
  "STATE YOUR BUSINESS.",
  "LAST WARNING.",
];

const DoorEntry = ({ onEnter }: DoorEntryProps) => {
  const [name, setName] = useState("");
  const [permission, setPermission] = useState("");
  const [knockCount, setKnockCount] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [knockMessage, setKnockMessage] = useState("");
  const { toast } = useToast();

  const handleKnock = () => {
    const newCount = knockCount + 1;
    setKnockCount(newCount);
    
    // Show knock messages
    if (newCount <= KNOCK_MESSAGES.length) {
      setKnockMessage(KNOCK_MESSAGES[newCount - 1]);
    }

    // After 2 knocks, show the form
    if (newCount >= 2 && !showForm) {
      setTimeout(() => {
        setShowForm(true);
      }, 600);
    }

    // If they knock too many times without entering
    if (newCount > 5) {
      toast({
        title: "⚠️ SECURITY ALERT",
        description: "Stop banging on the door! Enter your credentials.",
        variant: "destructive",
      });
    }
  };

  const handleEnter = () => {
    if (name.toLowerCase() === "admin" && permission === "admin") {
      setIsOpening(true);
      toast({
        title: "▸ ACCESS GRANTED",
        description: "The heavy door groans open...",
      });
      setTimeout(onEnter, 1800);
    } else {
      toast({
        title: "✕ ACCESS DENIED",
        description: "Unknown entity. Try again.",
        variant: "destructive",
      });
      setKnockCount(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden grain">
      {/* Dark industrial background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-black" />
      
      {/* Scan lines overlay */}
      <div className="absolute inset-0 scan-lines opacity-50" />
      
      {/* Harsh industrial light from above */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64"
        style={{
          background: "radial-gradient(circle, hsl(25 90% 50% / 0.3), transparent 60%)",
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="relative z-10 text-center px-4">
        {/* Brutalist header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-block bg-primary px-8 py-2 mb-4 shadow-brutal">
            <h1 className="font-heading text-4xl md:text-5xl text-primary-foreground tracking-wider">
              THE MANSION
            </h1>
          </div>
          <p className="font-body text-muted-foreground text-sm uppercase tracking-[0.3em]">
            {knockMessage || "APPROACH THE DOOR"}
          </p>
        </motion.div>

        {/* Door */}
        <motion.div
          animate={knockCount > 0 && knockCount <= 5 ? { x: [-2, 2, -2, 0] } : {}}
          transition={{ duration: 0.1 }}
        >
          <Door onEnter={handleKnock} isOpening={isOpening} knockCount={knockCount} />
        </motion.div>

        {/* Entry form - appears after knocking */}
        <AnimatePresence>
          {showForm && !isOpening && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="mt-10 max-w-sm mx-auto space-y-5"
            >
              <div className="bg-card border-4 border-black p-6 shadow-brutal">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground font-body">
                      ▸ IDENTITY
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="WHO ARE YOU?"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="brutal-input text-center text-lg h-14 uppercase font-body"
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permission" className="text-xs uppercase tracking-widest text-muted-foreground font-body">
                      ▸ ACCESS CODE
                    </Label>
                    <Input
                      id="permission"
                      type="password"
                      placeholder="••••••"
                      value={permission}
                      onChange={(e) => setPermission(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEnter()}
                      className="brutal-input text-center text-lg h-14 font-body"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <motion.button
                  onClick={handleEnter}
                  className="brutal-button w-full mt-6 font-heading text-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ENTER THE MANSION
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Knock hint */}
        {!showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-10"
          >
            <div className="inline-block border-2 border-dashed border-muted-foreground/30 px-6 py-3">
              <p className="text-muted-foreground/60 text-xs uppercase tracking-[0.4em] font-body">
                {knockCount === 0 ? "CLICK TO KNOCK" : `KNOCK ${knockCount}/2`}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Heavy floor */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
      
      {/* Warning tape at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-3 warning-tape" />
    </div>
  );
};

export default DoorEntry;

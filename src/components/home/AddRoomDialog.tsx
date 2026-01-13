import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RoomType } from "@/hooks/useRooms";

interface AddRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (room: { name: string; icon: string; description: string; room_type: RoomType }) => void;
  editRoom?: { id: string; name: string; icon: string; description: string; room_type?: RoomType } | null;
}

const ROOM_ICONS = ["🚪", "🏛️", "📚", "🍳", "🌿", "🔦", "🌙", "🖼️", "📖", "🔐", "⚔️", "🗝️"];

const ROOM_TYPES: { value: RoomType; label: string; icon: string }[] = [
  { value: "room", label: "ROOM", icon: "🚪" },
  { value: "hallway", label: "HALLWAY", icon: "🏛️" },
  { value: "library", label: "LIBRARY", icon: "📚" },
  { value: "kitchen", label: "KITCHEN", icon: "🍳" },
  { value: "garden", label: "GARDEN", icon: "🌿" },
  { value: "basement", label: "BASEMENT", icon: "🔦" },
  { value: "attic", label: "ATTIC", icon: "🌙" },
  { value: "gallery", label: "GALLERY", icon: "🖼️" },
  { value: "study", label: "STUDY", icon: "📖" },
  { value: "vault", label: "VAULT", icon: "🔐" },
];

const AddRoomDialog = ({ isOpen, onClose, onAdd, editRoom }: AddRoomDialogProps) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🚪");
  const [description, setDescription] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("room");

  useEffect(() => {
    if (editRoom) {
      setName(editRoom.name);
      setIcon(editRoom.icon);
      setDescription(editRoom.description);
      setRoomType(editRoom.room_type || "room");
    } else {
      setName("");
      setIcon("🚪");
      setDescription("");
      setRoomType("room");
    }
  }, [editRoom, isOpen]);

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd({ name: name.trim(), icon, description: description.trim(), room_type: roomType });
      setName("");
      setIcon("🚪");
      setDescription("");
      setRoomType("room");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border-4 border-black shadow-brutal-lg w-full max-w-lg"
          >
            {/* Header */}
            <div className="bg-primary border-b-4 border-black px-6 py-4 flex items-center justify-between">
              <h2 className="font-heading text-2xl text-primary-foreground uppercase tracking-wider">
                {editRoom ? "▸ MODIFY AREA" : "▸ NEW AREA"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 bg-black/20 hover:bg-black/40 transition-colors"
              >
                <X className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Room type picker */}
              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-3 block">
                  AREA TYPE
                </Label>
                <div className="grid grid-cols-5 gap-2">
                  {ROOM_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setRoomType(type.value)}
                      className={`p-3 border-2 border-black font-body text-xs text-center transition-all ${
                        roomType === type.value
                          ? "bg-primary shadow-brutal-sm text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      <span className="text-lg block mb-1">{type.icon}</span>
                      <span className="tracking-wider">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon picker */}
              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-3 block">
                  ICON
                </Label>
                <div className="flex flex-wrap gap-2">
                  {ROOM_ICONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setIcon(emoji)}
                      className={`w-12 h-12 border-2 border-black text-2xl flex items-center justify-center transition-all ${
                        icon === emoji
                          ? "bg-primary shadow-brutal-sm scale-110"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name input */}
              <div>
                <Label htmlFor="roomName" className="text-xs uppercase tracking-widest text-muted-foreground font-body">
                  AREA NAME
                </Label>
                <Input
                  id="roomName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="THE GRAND HALL"
                  className="brutal-input mt-2 uppercase font-body"
                />
              </div>

              {/* Description input */}
              <div>
                <Label htmlFor="roomDesc" className="text-xs uppercase tracking-widest text-muted-foreground font-body">
                  DESCRIPTION
                </Label>
                <Textarea
                  id="roomDesc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What lurks within these walls..."
                  className="brutal-input mt-2 min-h-[80px] font-body"
                />
              </div>

              {/* Submit button */}
              <motion.button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className="brutal-button w-full font-heading text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {editRoom ? "SAVE MODIFICATIONS" : "CREATE AREA"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddRoomDialog;
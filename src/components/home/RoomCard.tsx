import { motion } from "framer-motion";
import { Trash2, Edit2, ChevronRight, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RoomType } from "@/hooks/useRooms";

interface RoomCardProps {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  isDefault?: boolean;
  roomType?: RoomType;
  hasChildren?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ROOM_TYPE_CONFIG: Record<RoomType, { label: string; class: string; bgClass: string }> = {
  room: { label: "ROOM", class: "area-room", bgClass: "bg-primary/10" },
  hallway: { label: "HALLWAY", class: "area-hallway", bgClass: "bg-blue-500/10" },
  library: { label: "LIBRARY", class: "area-library", bgClass: "bg-amber-700/10" },
  kitchen: { label: "KITCHEN", class: "area-kitchen", bgClass: "bg-orange-500/10" },
  garden: { label: "GARDEN", class: "area-garden", bgClass: "bg-green-600/10" },
  basement: { label: "BASEMENT", class: "area-basement", bgClass: "bg-purple-600/10" },
  attic: { label: "ATTIC", class: "area-attic", bgClass: "bg-yellow-600/10" },
  gallery: { label: "GALLERY", class: "area-gallery", bgClass: "bg-red-500/10" },
  study: { label: "STUDY", class: "area-study", bgClass: "bg-cyan-600/10" },
  vault: { label: "VAULT", class: "area-vault", bgClass: "bg-yellow-500/10" },
};

const RoomCard = ({
  id,
  name,
  slug,
  icon,
  description,
  isDefault,
  roomType = "room",
  hasChildren,
  onEdit,
  onDelete,
}: RoomCardProps) => {
  const navigate = useNavigate();
  const config = ROOM_TYPE_CONFIG[roomType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`room-card p-0 group cursor-pointer ${config.class}`}
      onClick={() => navigate(`/room/${slug}`)}
      whileHover={{ x: -4, y: -4 }}
    >
      {/* Room type header */}
      <div className={`${config.bgClass} border-b-4 border-black px-4 py-2 flex items-center justify-between`}>
        <span className="text-xs font-body uppercase tracking-[0.3em] text-muted-foreground">
          {config.label}
        </span>
        {hasChildren && (
          <div className="flex items-center gap-1 text-primary">
            <Layers className="w-3 h-3" />
            <span className="text-xs font-body">NESTED</span>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Icon and actions row */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 flex items-center justify-center bg-black/30 border-2 border-black">
            <span className="text-4xl">{icon}</span>
          </div>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
              className="p-2 bg-secondary border-2 border-black shadow-brutal-sm hover:bg-secondary/80 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            {!isDefault && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="p-2 bg-destructive border-2 border-black shadow-brutal-sm hover:bg-destructive/80 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className="font-heading text-xl text-foreground mb-2 uppercase tracking-wide group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        {/* Description */}
        {description && (
          <p className="text-muted-foreground text-xs font-body leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {/* Enter indicator */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-black/30">
          <span className="text-xs font-body uppercase tracking-widest text-primary">
            ENTER
          </span>
          <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
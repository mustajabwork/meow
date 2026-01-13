import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, LogOut, Home } from "lucide-react";
import RoomCard from "./RoomCard";
import AddRoomDialog from "./AddRoomDialog";
import { useRooms, RoomType } from "@/hooks/useRooms";
import { useToast } from "@/hooks/use-toast";

interface HomeInteriorProps {
  onLeave: () => void;
}

const HomeInterior = ({ onLeave }: HomeInteriorProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const { rooms, isLoading, addRoom, updateRoom, deleteRoom } = useRooms(null);
  const { toast } = useToast();

  const handleAddRoom = async (roomData: { name: string; icon: string; description: string; room_type: RoomType }) => {
    if (editingRoom) {
      await updateRoom(editingRoom.id, roomData);
      toast({ title: "▸ AREA MODIFIED", description: `${roomData.name} has been updated.` });
      setEditingRoom(null);
    } else {
      await addRoom({ ...roomData, parent_id: null });
      toast({ title: "▸ NEW AREA CREATED", description: `Welcome to ${roomData.name}!` });
    }
  };

  const handleEditRoom = (id: string) => {
    const room = rooms.find((r) => r.id === id);
    if (room) {
      setEditingRoom(room);
      setIsAddDialogOpen(true);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    const room = rooms.find((r) => r.id === id);
    await deleteRoom(id);
    toast({
      title: "▸ AREA DEMOLISHED",
      description: `${room?.name || "The area"} has been removed.`,
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden grain">
      {/* Industrial grid background */}
      <div 
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Harsh lighting */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(25 90% 50% / 0.5), transparent 60%)",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-64 opacity-10"
          style={{
            background: "radial-gradient(ellipse at bottom right, hsl(25 90% 50%), transparent 60%)",
          }}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container max-w-7xl mx-auto px-4 py-8">
        {/* Brutalist Header */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary border-4 border-black shadow-brutal flex items-center justify-center">
                  <Home className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="h-1 w-24 bg-primary" />
              </div>
              <h1 className="font-heading text-5xl md:text-7xl text-foreground uppercase tracking-wider">
                THE MANSION
              </h1>
              <div className="mt-2 flex items-center gap-4">
                <div className="h-1 w-16 bg-muted-foreground/30" />
                <p className="text-muted-foreground font-body text-sm uppercase tracking-[0.3em]">
                  {rooms.length} AREAS TO EXPLORE
                </p>
              </div>
            </div>

            <button
              onClick={onLeave}
              className="flex items-center gap-3 px-6 py-4 bg-secondary border-4 border-black shadow-brutal hover:bg-secondary/80 transition-colors font-body text-sm uppercase tracking-widest"
            >
              <LogOut className="w-5 h-5" />
              <span>EXIT MANSION</span>
            </button>
          </div>

          {/* Warning tape decoration */}
          <div className="mt-8 h-3 warning-tape" />
        </motion.header>

        {/* Room grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-56 bg-card border-4 border-black animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                id={room.id}
                name={room.name}
                slug={room.slug}
                icon={room.icon || "🚪"}
                description={room.description || ""}
                isDefault={room.is_default || false}
                roomType={room.room_type as RoomType}
                onEdit={handleEditRoom}
                onDelete={handleDeleteRoom}
              />
            ))}

            {/* Add room card */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => {
                setEditingRoom(null);
                setIsAddDialogOpen(true);
              }}
              className="h-56 border-4 border-dashed border-muted-foreground/30 hover:border-primary flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary transition-all group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-16 h-16 border-4 border-current flex items-center justify-center group-hover:bg-primary group-hover:border-black group-hover:text-primary-foreground transition-colors">
                <Plus className="w-8 h-8" />
              </div>
              <span className="font-heading text-xl uppercase tracking-wider">
                ADD NEW AREA
              </span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Add/Edit dialog */}
      <AddRoomDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setEditingRoom(null);
        }}
        onAdd={handleAddRoom}
        editRoom={editingRoom}
      />

      {/* Bottom warning tape */}
      <div className="fixed bottom-0 left-0 right-0 h-2 warning-tape" />
    </div>
  );
};

export default HomeInterior;
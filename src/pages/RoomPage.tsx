import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Edit2, Plus, ChevronRight, Home, Layers } from "lucide-react";
import { useRoom, useRooms, useRoomBreadcrumbs, RoomType } from "@/hooks/useRooms";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import RoomCard from "@/components/home/RoomCard";
import AddRoomDialog from "@/components/home/AddRoomDialog";

const ROOM_TYPE_ITEMS: Record<RoomType, { items: string[]; message: string }> = {
  room: { items: ["🪑", "🖼️", "🕯️"], message: "A standard room in the mansion." },
  hallway: { items: ["🚪", "🪞", "💡"], message: "Long corridors connect the mansion's wings." },
  library: { items: ["📚", "📜", "🔍"], message: "Ancient tomes line the dusty shelves." },
  kitchen: { items: ["🍳", "🔪", "🥘"], message: "The heart of the mansion, still warm." },
  garden: { items: ["🌹", "🌳", "🦋"], message: "Nature reclaims what was once manicured." },
  basement: { items: ["🔦", "⛓️", "🕸️"], message: "Dark secrets lurk in the depths." },
  attic: { items: ["📦", "🕯️", "🦇"], message: "Forgotten memories gather dust above." },
  gallery: { items: ["🖼️", "🗿", "🎭"], message: "Portraits watch your every move." },
  study: { items: ["📖", "🖋️", "🔮"], message: "The master's private sanctuary." },
  vault: { items: ["🔐", "💎", "📜"], message: "Treasures and secrets await the worthy." },
};

const RoomPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: room, isLoading: roomLoading } = useRoom(slug || "");
  const { rooms: childRooms, isLoading: childrenLoading, addRoom, updateRoom, deleteRoom } = useRooms(room?.id);
  const { data: breadcrumbs = [] } = useRoomBreadcrumbs(room?.id);
  const { updateRoom: updateCurrentRoom } = useRooms(room?.parent_id);
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  // Check if user is authenticated
  useEffect(() => {
    const isHome = localStorage.getItem("isHome");
    if (!isHome) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (room?.content) {
      setContent(room.content);
    } else {
      setContent("");
    }
  }, [room?.content]);

  const handleSave = async () => {
    if (room) {
      await updateCurrentRoom(room.id, { content });
      toast({ title: "▸ SAVED", description: "Area content updated." });
      setIsEditing(false);
    }
  };

  const handleAddRoom = async (roomData: { name: string; icon: string; description: string; room_type: RoomType }) => {
    if (editingRoom) {
      await updateRoom(editingRoom.id, roomData);
      toast({ title: "▸ AREA MODIFIED", description: `${roomData.name} updated.` });
      setEditingRoom(null);
    } else {
      await addRoom({ ...roomData, parent_id: room?.id || null });
      toast({ title: "▸ NESTED AREA CREATED", description: `${roomData.name} added within ${room?.name}.` });
    }
  };

  const handleEditRoom = (id: string) => {
    const childRoom = childRooms.find((r) => r.id === id);
    if (childRoom) {
      setEditingRoom(childRoom);
      setIsAddDialogOpen(true);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    const childRoom = childRooms.find((r) => r.id === id);
    await deleteRoom(id);
    toast({
      title: "▸ AREA DEMOLISHED",
      description: `${childRoom?.name || "The area"} removed.`,
    });
  };

  if (roomLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background grain">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-black bg-primary animate-pulse mx-auto mb-4 shadow-brutal" />
          <p className="text-muted-foreground font-body uppercase tracking-widest text-sm">
            ACCESSING AREA...
          </p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background grain">
        <div className="text-center">
          <div className="bg-destructive inline-block px-8 py-4 border-4 border-black shadow-brutal mb-6">
            <h1 className="font-heading text-4xl text-destructive-foreground">
              ERROR 404
            </h1>
          </div>
          <p className="text-muted-foreground font-body uppercase tracking-widest mb-8">
            THIS AREA DOES NOT EXIST
          </p>
          <button
            onClick={() => navigate("/")}
            className="brutal-button font-heading"
          >
            RETURN TO MANSION
          </button>
        </div>
      </div>
    );
  }

  const roomTypeConfig = ROOM_TYPE_ITEMS[room.room_type as RoomType] || ROOM_TYPE_ITEMS.room;

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

      {/* Ambient lighting based on room type */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 opacity-15"
          style={{
            background: "radial-gradient(ellipse at center top, hsl(25 90% 50%), transparent 60%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 mb-6 flex-wrap"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-secondary border-2 border-black shadow-brutal-sm hover:bg-secondary/80 transition-colors font-body text-xs uppercase tracking-widest"
          >
            <Home className="w-4 h-4" />
            <span>MANSION</span>
          </button>
          
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <button
                onClick={() => navigate(`/room/${crumb.slug}`)}
                className={`px-3 py-2 font-body text-xs uppercase tracking-widest transition-colors ${
                  index === breadcrumbs.length - 1
                    ? "bg-primary border-2 border-black shadow-brutal-sm text-primary-foreground"
                    : "bg-secondary/50 border-2 border-black/50 hover:bg-secondary"
                }`}
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </motion.div>

        {/* Room header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Room type badge */}
          <div className="inline-block bg-primary px-4 py-1 border-2 border-black mb-4">
            <span className="font-body text-xs uppercase tracking-[0.3em] text-primary-foreground">
              {room.room_type?.toUpperCase() || "ROOM"}
            </span>
          </div>

          <div className="flex items-start gap-6 mb-4">
            <div className="w-24 h-24 bg-card border-4 border-black shadow-brutal flex items-center justify-center text-5xl">
              {room.icon}
            </div>
            <div className="flex-1">
              <h1 className="font-heading text-4xl md:text-6xl text-foreground uppercase tracking-wider">
                {room.name}
              </h1>
              {room.description && (
                <p className="text-muted-foreground font-body text-sm mt-2 max-w-xl">
                  {room.description}
                </p>
              )}
            </div>
          </div>

          {/* Room type items decoration */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex gap-2">
              {roomTypeConfig.items.map((item, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="text-2xl"
                >
                  {item}
                </motion.span>
              ))}
            </div>
            <p className="text-muted-foreground/60 font-body text-xs italic">
              {roomTypeConfig.message}
            </p>
          </div>

          <div className="mt-6 h-2 warning-tape" />
        </motion.div>

        {/* Room content area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border-4 border-black shadow-brutal mb-8"
        >
          <div className="bg-secondary/50 border-b-4 border-black px-6 py-4 flex items-center justify-between">
            <h2 className="font-heading text-xl text-foreground uppercase tracking-wider">
              {isEditing ? "▸ EDITING" : "▸ CONTENT"}
            </h2>
            <div className="flex gap-2">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="brutal-button py-2 px-4 text-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  SAVE
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary border-2 border-black shadow-brutal-sm hover:bg-secondary/80 transition-colors font-body text-xs uppercase tracking-widest"
                >
                  <Edit2 className="w-4 h-4" />
                  EDIT
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {isEditing ? (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Document the contents of this area..."
                className="brutal-input min-h-[200px] font-body"
              />
            ) : (
              <div className="min-h-[100px]">
                {content ? (
                  <div className="whitespace-pre-wrap text-foreground/90 font-body leading-relaxed">
                    {content}
                  </div>
                ) : (
                  <p className="text-muted-foreground font-body italic">
                    This area has no documented contents. Click EDIT to add information.
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Nested rooms section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <Layers className="w-6 h-6 text-primary" />
            <h2 className="font-heading text-2xl text-foreground uppercase tracking-wider">
              NESTED AREAS
            </h2>
            <div className="flex-1 h-1 bg-muted-foreground/20" />
          </div>

          {childrenLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-card border-4 border-black animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {childRooms.map((childRoom) => (
                <RoomCard
                  key={childRoom.id}
                  id={childRoom.id}
                  name={childRoom.name}
                  slug={childRoom.slug}
                  icon={childRoom.icon || "🚪"}
                  description={childRoom.description || ""}
                  isDefault={childRoom.is_default || false}
                  roomType={childRoom.room_type as RoomType}
                  onEdit={handleEditRoom}
                  onDelete={handleDeleteRoom}
                />
              ))}

              {/* Add nested room */}
              <motion.button
                onClick={() => {
                  setEditingRoom(null);
                  setIsAddDialogOpen(true);
                }}
                className="h-48 border-4 border-dashed border-muted-foreground/30 hover:border-primary flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary transition-all group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-14 h-14 border-4 border-current flex items-center justify-center group-hover:bg-primary group-hover:border-black group-hover:text-primary-foreground transition-colors">
                  <Plus className="w-7 h-7" />
                </div>
                <span className="font-heading text-lg uppercase tracking-wider">
                  ADD NESTED AREA
                </span>
              </motion.button>
            </div>
          )}
        </motion.div>
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

export default RoomPage;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type RoomType = 'room' | 'hallway' | 'library' | 'kitchen' | 'garden' | 'basement' | 'attic' | 'gallery' | 'study' | 'vault';

export interface Room {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  content: string | null;
  position: number;
  is_default: boolean;
  parent_id: string | null;
  room_type: RoomType;
  created_at: string;
  updated_at: string;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const useRooms = (parentId?: string | null) => {
  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms", parentId ?? "root"],
    queryFn: async () => {
      let query = supabase
        .from("rooms")
        .select("*")
        .order("position", { ascending: true });

      if (parentId) {
        query = query.eq("parent_id", parentId);
      } else {
        query = query.is("parent_id", null);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Room[];
    },
  });

  const addRoomMutation = useMutation({
    mutationFn: async (room: { 
      name: string; 
      icon: string; 
      description: string; 
      room_type?: RoomType;
      parent_id?: string | null;
    }) => {
      const slug = slugify(room.name) + "-" + Date.now().toString(36);
      const { data, error } = await supabase
        .from("rooms")
        .insert({
          name: room.name,
          slug,
          icon: room.icon,
          description: room.description || null,
          position: rooms.length,
          room_type: room.room_type || 'room',
          parent_id: room.parent_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  const updateRoomMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: { 
        name?: string; 
        icon?: string; 
        description?: string; 
        content?: string;
        room_type?: RoomType;
      };
    }) => {
      const { data, error } = await supabase
        .from("rooms")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("rooms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  return {
    rooms,
    isLoading,
    addRoom: addRoomMutation.mutateAsync,
    updateRoom: (id: string, updates: { 
      name?: string; 
      icon?: string; 
      description?: string; 
      content?: string;
      room_type?: RoomType;
    }) => updateRoomMutation.mutateAsync({ id, updates }),
    deleteRoom: deleteRoomMutation.mutateAsync,
  };
};

export const useRoom = (slug: string) => {
  return useQuery({
    queryKey: ["room", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Room;
    },
    enabled: !!slug,
  });
};

export const useRoomBreadcrumbs = (roomId: string | undefined) => {
  return useQuery({
    queryKey: ["room-breadcrumbs", roomId],
    queryFn: async () => {
      if (!roomId) return [];
      
      const breadcrumbs: Room[] = [];
      let currentId: string | null = roomId;
      
      while (currentId) {
        const { data, error } = await supabase
          .from("rooms")
          .select("*")
          .eq("id", currentId)
          .single();
        
        if (error || !data) break;
        breadcrumbs.unshift(data as Room);
        currentId = data.parent_id;
      }
      
      return breadcrumbs;
    },
    enabled: !!roomId,
  });
};
-- Add parent_id for nested pages support
ALTER TABLE public.rooms 
ADD COLUMN parent_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE;

-- Add index for faster nested queries
CREATE INDEX idx_rooms_parent_id ON public.rooms(parent_id);

-- Add room_type for different mansion areas
ALTER TABLE public.rooms
ADD COLUMN room_type TEXT DEFAULT 'room' CHECK (room_type IN ('room', 'hallway', 'library', 'kitchen', 'garden', 'basement', 'attic', 'gallery', 'study', 'vault'));
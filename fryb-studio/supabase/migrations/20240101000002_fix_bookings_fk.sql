-- Change bookings user_id FK to reference profiles instead of auth.users
-- This allows PostgREST to detect the relationship for joins

DO $$
BEGIN
  -- Try to drop the constraint if it exists
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_user_id_fkey') THEN
    ALTER TABLE public.bookings DROP CONSTRAINT bookings_user_id_fkey;
  END IF;
END $$;

ALTER TABLE public.bookings
ADD CONSTRAINT bookings_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

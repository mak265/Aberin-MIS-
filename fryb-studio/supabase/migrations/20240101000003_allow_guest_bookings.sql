-- Allow guest bookings by making user_id nullable
-- Add guest_info column to store details for non-registered users

ALTER TABLE public.bookings
ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.bookings
ADD COLUMN guest_info JSONB;

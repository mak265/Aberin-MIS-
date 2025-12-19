-- Create a storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to portfolio images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'portfolio' );

-- Allow authenticated users (admins) to upload images
CREATE POLICY "Admin Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );

-- Allow admins to delete images
CREATE POLICY "Admin Delete" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );

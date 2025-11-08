-- Create public storage bucket for resources
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true);

-- Allow public access to view/download files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'resources');

-- Allow authenticated users to upload files (for future admin functionality)
CREATE POLICY "Authenticated users can upload resources"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resources' AND auth.role() = 'authenticated');

-- Create table to track download statistics (optional but useful)
CREATE TABLE IF NOT EXISTS public.resource_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id TEXT NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS on download tracking
ALTER TABLE public.resource_downloads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert download records
CREATE POLICY "Anyone can track downloads"
ON public.resource_downloads FOR INSERT
WITH CHECK (true);
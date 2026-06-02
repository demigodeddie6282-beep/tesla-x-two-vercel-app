
-- Create payslips bucket (public so admin can download via URL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payslips', 'payslips', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own folder: payslips/{auth.uid()}/...
CREATE POLICY "Users upload own payslips"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payslips' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Public read so admin can view/download
CREATE POLICY "Payslips publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'payslips');

-- Users can update/delete their own
CREATE POLICY "Users manage own payslips"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'payslips' AND auth.uid()::text = (storage.foldername(name))[1]);


-- Payslips: replace public SELECT with owner/admin-only
DROP POLICY IF EXISTS "Payslips publicly readable" ON storage.objects;

CREATE POLICY "Users read own payslips"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'payslips'
    AND (
      (auth.uid())::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin'::public.app_role)
    )
  );

-- Payslips: add owner-only UPDATE policy
CREATE POLICY "Users update own payslips"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'payslips'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'payslips'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- user_roles: explicit restrictive policy — only admins may write
CREATE POLICY "Only admins can write roles"
  ON public.user_roles
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

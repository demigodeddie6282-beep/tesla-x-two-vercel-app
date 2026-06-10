-- Email verification codes table
CREATE TABLE public.email_verification_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_email_verification_codes_email ON public.email_verification_codes(email);
CREATE INDEX idx_email_verification_codes_expires ON public.email_verification_codes(expires_at);

-- Allow service role (Edge Functions) to manage codes
GRANT ALL ON public.email_verification_codes TO service_role;
GRANT SELECT ON public.email_verification_codes TO authenticated;

-- Cleanup old codes periodically
CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_codes()
RETURNS void
LANGUAGE SQL
SECURITY DEFINER
AS $$
  DELETE FROM public.email_verification_codes WHERE expires_at < now() - INTERVAL '1 day';
$$;
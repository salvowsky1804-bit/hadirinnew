
-- Offline invitation templates catalog (admin managed).
CREATE TABLE public.offline_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  cover_path TEXT,
  files JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.offline_templates TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.offline_templates TO authenticated;
GRANT ALL ON public.offline_templates TO service_role;

ALTER TABLE public.offline_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "offline_templates_public_read"
  ON public.offline_templates FOR SELECT
  USING (active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "offline_templates_admin_write"
  ON public.offline_templates FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER offline_templates_updated_at
  BEFORE UPDATE ON public.offline_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for offline-templates bucket
CREATE POLICY "offline_templates_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'offline-templates');

CREATE POLICY "offline_templates_admin_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'offline-templates' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "offline_templates_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'offline-templates' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "offline_templates_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'offline-templates' AND public.has_role(auth.uid(), 'admin'));

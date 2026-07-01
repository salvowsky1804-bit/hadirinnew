
-- Helper: check if authed user owns or admins a project referenced by storage folder (first path segment = project_id)
CREATE OR REPLACE FUNCTION public.can_manage_project_file(_bucket text, _name text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id::text = split_part(_name, '/', 1)
      AND (p.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  );
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='inv_media_owner_all') THEN
    CREATE POLICY inv_media_owner_all ON storage.objects
      FOR ALL TO authenticated
      USING (bucket_id IN ('invitation-media','guest-qr') AND public.can_manage_project_file(bucket_id, name))
      WITH CHECK (bucket_id IN ('invitation-media','guest-qr') AND public.can_manage_project_file(bucket_id, name));
  END IF;
END $$;

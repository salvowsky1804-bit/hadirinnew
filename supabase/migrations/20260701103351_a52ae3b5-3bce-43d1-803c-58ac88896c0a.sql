
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS qr_path text;

-- Ensure delete on guests (owner_all is ALL so already covers, keep for safety)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='wishes' AND policyname='wishes_public_insert') THEN
    CREATE POLICY wishes_public_insert ON public.wishes
      FOR INSERT TO anon, authenticated
      WITH CHECK (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = wishes.project_id AND p.status = 'published'));
  END IF;
END $$;

-- Public may read a guest's minimal info if the project is published (needed to render QR on invite page)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='guests' AND policyname='guests_public_read_min') THEN
    CREATE POLICY guests_public_read_min ON public.guests
      FOR SELECT TO anon, authenticated
      USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = guests.project_id AND p.status = 'published'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_guests_project ON public.guests(project_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_project_created ON public.rsvps(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wishes_project_created ON public.wishes(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);

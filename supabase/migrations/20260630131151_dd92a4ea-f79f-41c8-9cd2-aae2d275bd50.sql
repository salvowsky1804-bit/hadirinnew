
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'wo');
CREATE TYPE public.project_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.rsvp_attendance AS ENUM ('hadir', 'tidak_hadir', 'ragu');

-- ============ UPDATED_AT HELPER ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ USER ROLES (separate table, never on profile) ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- ============ AUTO PROFILE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'phone'
  );
  -- default role: wo
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'wo')
    ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ TEMPLATES (catalog) ============
CREATE TABLE public.templates (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  manifest JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_templates_active ON public.templates(active) WHERE active = true;
GRANT SELECT ON public.templates TO anon, authenticated;
GRANT ALL ON public.templates TO service_role;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_templates_updated BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PROJECTS ============
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  template_slug TEXT NOT NULL REFERENCES public.templates(slug),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  status public.project_status NOT NULL DEFAULT 'draft',
  groom_name TEXT NOT NULL DEFAULT '',
  bride_name TEXT NOT NULL DEFAULT '',
  event_date TIMESTAMPTZ,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  music_url TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_projects_owner ON public.projects(owner_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_template ON public.projects(template_slug);
CREATE INDEX idx_projects_event_date ON public.projects(event_date DESC NULLS LAST);
CREATE INDEX idx_projects_created ON public.projects(created_at DESC);
-- slug is already UNIQUE (implicit btree index) — perfect for /u/:slug lookups
GRANT SELECT ON public.projects TO anon; -- guest view by slug; restricted by RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ GUESTS ============
CREATE TABLE public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  group_label TEXT,
  invite_code TEXT,
  plus_ones INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_guests_project ON public.guests(project_id);
CREATE INDEX idx_guests_invite_code ON public.guests(invite_code) WHERE invite_code IS NOT NULL;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guests TO authenticated;
GRANT ALL ON public.guests TO service_role;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_guests_updated BEFORE UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ RSVPS ============
CREATE TABLE public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  attendance public.rsvp_attendance NOT NULL,
  head_count INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rsvps_project ON public.rsvps(project_id, created_at DESC);
CREATE INDEX idx_rsvps_project_attendance ON public.rsvps(project_id, attendance);
GRANT SELECT, INSERT ON public.rsvps TO anon; -- guests submit without login
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rsvps TO authenticated;
GRANT ALL ON public.rsvps TO service_role;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- ============ WISHES ============
CREATE TABLE public.wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_wishes_project_created ON public.wishes(project_id, created_at DESC);
CREATE INDEX idx_wishes_project_approved ON public.wishes(project_id, approved, created_at DESC);
GRANT SELECT, INSERT ON public.wishes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wishes TO authenticated;
GRANT ALL ON public.wishes TO service_role;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- ============ STUDIO SETTINGS (singleton) ============
CREATE TABLE public.studio_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  studio_name TEXT NOT NULL DEFAULT 'Hadirin',
  contact_email TEXT,
  contact_phone TEXT,
  whatsapp TEXT,
  default_template TEXT REFERENCES public.templates(slug),
  features JSONB NOT NULL DEFAULT '{"music":true,"wishes":true}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.studio_settings TO anon, authenticated;
GRANT ALL ON public.studio_settings TO service_role;
ALTER TABLE public.studio_settings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.studio_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.studio_settings (id) VALUES (1);

-- ============ RLS POLICIES ============

-- profiles: user reads/updates own; admin all
CREATE POLICY "profiles_self_select" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles_admin_insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles_admin_delete" ON public.profiles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- user_roles: user reads own; admin manages all
CREATE POLICY "roles_self_read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "roles_admin_write" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- templates: public read of active; admin write
CREATE POLICY "templates_public_read" ON public.templates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "templates_admin_write" ON public.templates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- projects: published readable by anyone (guest invitation page); owner/admin full
CREATE POLICY "projects_public_published" ON public.projects FOR SELECT TO anon, authenticated
  USING (status = 'published');
CREATE POLICY "projects_owner_select" ON public.projects FOR SELECT TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "projects_owner_insert" ON public.projects FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "projects_owner_update" ON public.projects FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "projects_owner_delete" ON public.projects FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- guests: only owner/admin
CREATE POLICY "guests_owner_all" ON public.guests FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id
    AND (p.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id
    AND (p.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- rsvps: anyone can insert on published projects; owner/admin read & manage
CREATE POLICY "rsvps_public_insert" ON public.rsvps FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.status = 'published'));
CREATE POLICY "rsvps_owner_select" ON public.rsvps FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id
    AND (p.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "rsvps_owner_modify" ON public.rsvps FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id
    AND (p.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "rsvps_owner_delete" ON public.rsvps FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id
    AND (p.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- wishes: anyone reads approved on published; anyone inserts on published; owner manages
CREATE POLICY "wishes_public_read" ON public.wishes FOR SELECT TO anon, authenticated
  USING (approved = true AND EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.status = 'published'));
CREATE POLICY "wishes_owner_read_all" ON public.wishes FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id
    AND (p.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "wishes_public_insert" ON public.wishes FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.status = 'published'));
CREATE POLICY "wishes_owner_modify" ON public.wishes FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id
    AND (p.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "wishes_owner_delete" ON public.wishes FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id
    AND (p.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- studio_settings: public read; admin write
CREATE POLICY "settings_public_read" ON public.studio_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings_admin_write" ON public.studio_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ SEED TEMPLATES ============
INSERT INTO public.templates (slug, name, description, active) VALUES
  ('aksara', 'Aksara', 'Klasik minimalis ivory & bordeaux', true),
  ('senandika', 'Senandika', 'Editorial dark mode', true),
  ('elegant', 'Elegant Onyx', 'Sinematik onyx & emas', true)
ON CONFLICT (slug) DO NOTHING;

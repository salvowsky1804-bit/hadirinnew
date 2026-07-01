
REVOKE ALL ON FUNCTION public.can_manage_project_file(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_manage_project_file(text, text) TO authenticated, service_role;

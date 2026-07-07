
CREATE POLICY "template_thumbnails_admin_write" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'template-thumbnails' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'template-thumbnails' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "template_thumbnails_auth_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'template-thumbnails');

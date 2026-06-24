// Auto-discover every template under src/templates/<slug>/.
// A new folder with a manifest.ts is picked up at build time — no manual
// registration. Components are loaded lazily so guest pages only ship the
// code for the template they actually render.

import type {
  RegisteredTemplate,
  TemplateManifest,
  TemplateRenderProps,
} from "@/types/template";
import type { ComponentType } from "react";

type ManifestModule = { manifest: TemplateManifest };
type ComponentModule = { default: ComponentType<TemplateRenderProps> };

const manifestModules = import.meta.glob<ManifestModule>(
  "../templates/*/manifest.ts",
  { eager: true },
);

const componentLoaders = import.meta.glob<ComponentModule>(
  "../templates/*/index.tsx",
);

function folderFromPath(path: string): string {
  // ../templates/aksara/manifest.ts -> aksara
  const m = path.match(/\.\.\/templates\/([^/]+)\//);
  return m?.[1] ?? "";
}

export const templateRegistry: RegisteredTemplate[] = Object.entries(
  manifestModules,
)
  .map(([path, mod]) => {
    const folder = folderFromPath(path);
    const componentPath = `../templates/${folder}/index.tsx`;
    const loader = componentLoaders[componentPath];
    if (!loader) return null;
    return {
      manifest: mod.manifest,
      load: loader,
    } satisfies RegisteredTemplate;
  })
  .filter((x): x is RegisteredTemplate => x !== null);

export function getTemplate(slug: string): RegisteredTemplate | undefined {
  return templateRegistry.find((t) => t.manifest.slug === slug);
}

export function listTemplates(): RegisteredTemplate[] {
  return templateRegistry;
}

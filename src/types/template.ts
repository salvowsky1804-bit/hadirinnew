// Template manifest types — every template folder ships one of these.
// Form renderer (WO) reads `fields` to generate the data-entry form dynamically.

export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "time"
  | "image"
  | "url"
  | "list"; // generic repeating list of strings or objects

export interface TemplateFieldDef {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  /** For list fields: shape of one entry as nested fields */
  itemFields?: TemplateFieldDef[];
}

export type TemplateCategory = "online" | "offline";

export interface TemplateManifest {
  slug: string;
  name: string;
  tagline?: string;
  thumbnail: string;
  category: TemplateCategory;
  /** Optional internal package label (not shown to guests) */
  internalPackage?: string;
  /** Custom fields beyond the core invitation shape */
  fields: TemplateFieldDef[];
}

export interface RegisteredTemplate {
  manifest: TemplateManifest;
  /** Lazy loader for the template component; keeps bundle split per-template */
  load: () => Promise<{ default: React.ComponentType<TemplateRenderProps> }>;
}

import type { InvitationData } from "./invitation";
export interface TemplateRenderProps {
  data: InvitationData;
  guestName?: string;
}

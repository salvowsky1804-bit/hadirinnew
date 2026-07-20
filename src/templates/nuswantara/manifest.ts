import type { TemplateManifest } from "@/types/template";

export const manifest: TemplateManifest = {
  slug: "nuswantara",
  name: "Nuswantara",
  tagline: "Klasik Jawa — joglo, wayang, dan lanskap sepia romantis.",
  thumbnail: "/src/assets/nuswantara-hero.jpg",
  category: "online",
  internalPackage: "Signature",
  fields: [
    {
      id: "quote",
      label: "Kutipan Pembuka",
      type: "textarea",
      required: false,
      placeholder: "Ayat / kutipan singkat",
      help: "Ditampilkan setelah cover.",
    },
    {
      id: "quoteSource",
      label: "Sumber Kutipan",
      type: "text",
      required: false,
      placeholder: "— QS Ar-Rum 21",
    },
    {
      id: "filosofi",
      label: "Filosofi / Prakata Jawa",
      type: "textarea",
      required: false,
      placeholder: "Sugeng rawuh, matur nuwun atas rawuhipun...",
    },
    {
      id: "dresscode",
      label: "Dresscode",
      type: "text",
      required: false,
      placeholder: "Earth tone / Batik",
    },
  ],
};
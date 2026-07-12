import type { TemplateManifest } from "@/types/template";

export const manifest: TemplateManifest = {
  slug: "botanika",
  name: "Botanika",
  tagline: "Garden botanical — sage, krim, dan sentuhan terracotta.",
  thumbnail:
    "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=70&auto=format&fit=crop",
  category: "online",
  internalPackage: "Signature",
  fields: [
    {
      id: "quote",
      label: "Kutipan Pembuka",
      type: "textarea",
      required: false,
      placeholder: "Kutipan singkat / ayat favorit",
      help: "Ditampilkan di bagian pembuka setelah cover.",
    },
    {
      id: "quoteSource",
      label: "Sumber Kutipan",
      type: "text",
      required: false,
      placeholder: "— QS Ar-Rum 21",
    },
    {
      id: "dresscode",
      label: "Dresscode",
      type: "text",
      required: false,
      placeholder: "Sage green / Earth tone",
    },
  ],
};

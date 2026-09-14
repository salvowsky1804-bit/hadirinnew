import type { TemplateManifest } from "@/types/template";

export const manifest: TemplateManifest = {
  slug: "laras",
  name: "Laras",
  tagline: "Minimal editorial dengan ruang putih dan sentuhan hijau zaitun.",
  thumbnail:
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=70&auto=format&fit=crop",
  category: "online",
  internalPackage: "Essential",
  fields: [
    {
      id: "quote",
      label: "Kutipan Pembuka",
      type: "textarea",
      required: false,
      placeholder: "Dua hati, satu perjalanan.",
    },
  ],
};
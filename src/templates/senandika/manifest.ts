import type { TemplateManifest } from "@/types/template";

export const manifest: TemplateManifest = {
  slug: "senandika",
  name: "Senandika",
  tagline: "Editorial modern dengan ruang untuk kisah personal.",
  thumbnail:
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=70&auto=format&fit=crop",
  category: "online",
  internalPackage: "Premium",
  // Field custom — form WO otomatis memunculkan input untuk dua field ini.
  fields: [
    {
      id: "favoriteVerse",
      label: "Ayat / Kutipan Favorit",
      type: "textarea",
      required: false,
      placeholder: "Mis. QS Ar-Rum 21 atau kutipan favorit pasangan",
      help: "Ditampilkan di bagian pembuka undangan.",
    },
    {
      id: "preweddingVideoUrl",
      label: "Tautan Video Prewedding",
      type: "url",
      required: false,
      placeholder: "https://youtube.com/...",
    },
  ],
};

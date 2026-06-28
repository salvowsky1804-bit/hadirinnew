import type { TemplateManifest } from "@/types/template";

export const manifest: TemplateManifest = {
  slug: "elegant",
  name: "Elegant Onyx",
  tagline: "Editorial gelap dengan sentuhan emas, partikel ambient, dan tipografi Playfair.",
  thumbnail:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=70&auto=format&fit=crop",
  category: "online",
  internalPackage: "Heritage",
  fields: [
    {
      id: "heroSubtitle",
      label: "Hero subtitle",
      type: "text",
      placeholder: "Ngunduh Mantu",
      help: "Label kecil di atas nama pasangan pada cover.",
    },
    {
      id: "quote",
      label: "Quote / Ayat",
      type: "textarea",
      placeholder: "Dan di antara tanda-tanda kekuasaan-Nya…",
    },
    {
      id: "quoteSource",
      label: "Sumber quote",
      type: "text",
      placeholder: "QS. Ar-Rum: 21",
    },
  ],
};
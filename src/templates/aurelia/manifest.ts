import royalHero from "@/assets/aurelia-royal-hero.jpg";
import type { TemplateManifest } from "@/types/template";

export const manifest: TemplateManifest = {
  slug: "aurelia",
  name: "Aurelia",
  tagline: "Royal editorial sinematik dengan arsitektur klasik dan aksen champagne.",
  thumbnail: royalHero,
  category: "online",
  internalPackage: "Signature",
  fields: [
    {
      id: "monogram",
      label: "Monogram Pasangan",
      type: "text",
      placeholder: "RS",
      help: "Gunakan dua inisial pasangan.",
    },
    {
      id: "quote",
      label: "Kutipan Pembuka",
      type: "textarea",
      placeholder: "Cinta adalah rumah yang kami pilih untuk pulang.",
    },
    {
      id: "quoteSource",
      label: "Sumber Kutipan",
      type: "text",
      placeholder: "— Sebuah janji",
    },
    {
      id: "storyTitle",
      label: "Judul Kisah",
      type: "text",
      placeholder: "A Story Written in Time",
    },
    {
      id: "dresscode",
      label: "Dress Code",
      type: "text",
      placeholder: "Black Tie · Champagne · Ivory",
    },
    {
      id: "rundown",
      label: "Susunan Acara",
      type: "textarea",
      placeholder: "08.00 — Akad Nikah\n11.00 — Resepsi\n13.30 — Penutup",
      help: "Tulis satu agenda per baris.",
    },
  ],
};
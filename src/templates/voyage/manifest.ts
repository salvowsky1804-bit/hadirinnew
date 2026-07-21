import type { TemplateManifest } from "@/types/template";

export const manifest: TemplateManifest = {
  slug: "voyage",
  name: "Voyage",
  tagline: "Boarding pass — undangan bergaya tiket destinasi navy & krim.",
  thumbnail:
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=70&auto=format&fit=crop",
  category: "online",
  internalPackage: "Signature",
  fields: [
    {
      id: "tagline",
      label: "Tagline / Sub-judul",
      type: "text",
      required: false,
      placeholder: "A DESTINATION TO REMEMBER",
    },
    {
      id: "flightCode",
      label: "Kode Penerbangan",
      type: "text",
      required: false,
      placeholder: "AR 2106",
    },
    {
      id: "flightClass",
      label: "Kelas",
      type: "text",
      required: false,
      placeholder: "FIRST CLASS",
    },
    {
      id: "destination",
      label: "Destinasi",
      type: "text",
      required: false,
      placeholder: "LAKE COMO, ITALY",
    },
    {
      id: "boardingNote",
      label: "Catatan Boarding",
      type: "text",
      required: false,
      placeholder: "BOARDING FOR LOVE",
    },
    {
      id: "dresscode",
      label: "Dresscode",
      type: "text",
      required: false,
      placeholder: "Ivory / Cream / Taupe / Navy / Black",
    },
    {
      id: "dresscodePalette",
      label: "Palet Warna Dresscode (pisahkan koma)",
      type: "text",
      required: false,
      placeholder: "IVORY,CREAM,TAUPE,NAVY,BLACK",
      help: "Nama warna dipisah koma. Ditampilkan sebagai swatch bulat.",
    },
  ],
};
import type { InvitationData } from "@/types/invitation";
import type { TemplateManifest } from "@/types/template";

/**
 * Build sample InvitationData for previewing a template in the admin catalog.
 * Core fields are fixed; `custom` is seeded from the template manifest so
 * Senandika (and future templates) show their custom fields populated.
 */
export function buildSampleInvitation(
  manifest: TemplateManifest,
): InvitationData {
  const custom: Record<string, unknown> = {};
  for (const field of manifest.fields) {
    custom[field.id] = sampleForField(field.id, field.type);
  }
  return {
    id: `preview-${manifest.slug}`,
    eventId: `preview-evt-${manifest.slug}`,
    templateSlug: manifest.slug,
    groom: {
      fullName: "Rama Adi Pratama",
      nickName: "Rama",
      fatherName: "Bapak Sutopo Adi",
      motherName: "Ibu Lestari",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=70&auto=format&fit=crop",
      instagram: "@ramaadi",
    },
    bride: {
      fullName: "Sinta Maharani",
      nickName: "Sinta",
      fatherName: "Bapak Wahyu Maharani",
      motherName: "Ibu Ratih",
      photo:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=70&auto=format&fit=crop",
      instagram: "@sintamaharani",
    },
    events: [
      {
        id: "e1",
        name: "Akad Nikah",
        date: "2026-08-22",
        startTime: "08:00",
        endTime: "10:00",
        venueName: "Masjid Istiqlal",
        address: "Jl. Taman Wijaya Kusuma, Jakarta Pusat",
        mapsUrl: "https://maps.google.com/?q=Masjid+Istiqlal",
      },
      {
        id: "e2",
        name: "Resepsi",
        date: "2026-08-22",
        startTime: "11:00",
        endTime: "14:00",
        venueName: "Ballroom Hotel Mulia",
        address: "Jl. Asia Afrika, Senayan, Jakarta",
        mapsUrl: "https://maps.google.com/?q=Hotel+Mulia+Senayan",
      },
    ],
    loveStory: [
      {
        id: "ls1",
        date: "2019-09-10",
        title: "Pertemuan Pertama",
        description:
          "Bertemu di acara kampus, sapaan sederhana berbuah cerita.",
      },
      {
        id: "ls2",
        date: "2024-12-25",
        title: "Lamaran",
        description: "Disaksikan keluarga besar, ikatan dimulai.",
      },
    ],
    gallery: [
      {
        id: "ph1",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=70&auto=format&fit=crop",
      },
      {
        id: "ph2",
        url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=70&auto=format&fit=crop",
      },
    ],
    gifts: [
      {
        id: "gi1",
        kind: "bank",
        provider: "BCA",
        accountNumber: "1234567890",
        accountName: "Sinta Maharani",
      },
    ],
    settings: {
      greeting:
        "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir.",
      closing:
        "Merupakan suatu kehormatan bagi kami atas kehadiran dan doa restunya.",
    },
    custom,
  };
}

function sampleForField(id: string, type: string): unknown {
  // Known-id shortcuts give nicer demo content.
  if (id === "favoriteVerse")
    return "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri…";
  if (id === "preweddingVideoUrl") return "https://youtu.be/dQw4w9WgXcQ";
  if (id === "heroSubtitle") return "The Wedding Of";
  if (id === "quote")
    return "Dua jiwa, satu janji — dalam senyap doa, kami menyatu.";
  if (id === "quoteSource") return "— Kalam Sukma";
  switch (type) {
    case "url":
      return "https://example.com";
    case "date":
      return "2026-08-22";
    case "time":
      return "10:00";
    case "image":
      return "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=70&auto=format&fit=crop";
    case "list":
      return [];
    default:
      return "Contoh teks pratinjau";
  }
}
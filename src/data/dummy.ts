import type {
  Guest,
  InvitationProject,
  RsvpEntry,
  WishEntry,
} from "@/types/invitation";

export interface WoMember {
  id: string;
  name: string;
  email: string;
  active: boolean;
  joinedAt: string;
}

export const dummyWoTeam: WoMember[] = [
  {
    id: "wo-1",
    name: "Anindya Putri",
    email: "anindya@studio.id",
    active: true,
    joinedAt: "2025-02-12",
  },
  {
    id: "wo-2",
    name: "Bagas Wirawan",
    email: "bagas@studio.id",
    active: true,
    joinedAt: "2025-04-03",
  },
  {
    id: "wo-3",
    name: "Citra Larasati",
    email: "citra@studio.id",
    active: false,
    joinedAt: "2024-11-20",
  },
];

const sampleGuests: Guest[] = [
  { id: "g1", name: "Keluarga Pak Hendra", group: "Keluarga", pax: 4, slug: "hendra" },
  { id: "g2", name: "Sahabat SMA", group: "Teman", pax: 2, slug: "sma" },
  { id: "g3", name: "Rekan Kantor", group: "Kantor", pax: 1, slug: "kantor" },
];

const sampleRsvps: RsvpEntry[] = [
  {
    id: "r1",
    guestName: "Keluarga Pak Hendra",
    status: "attending",
    pax: 4,
    submittedAt: "2026-06-10T10:00:00Z",
  },
  {
    id: "r2",
    guestName: "Sahabat SMA",
    status: "tentative",
    pax: 2,
    submittedAt: "2026-06-12T14:00:00Z",
  },
];

const sampleWishes: WishEntry[] = [
  {
    id: "w1",
    guestName: "Dewi",
    message: "Selamat menempuh hidup baru, semoga sakinah mawadah warahmah.",
    submittedAt: "2026-06-09T08:30:00Z",
  },
  {
    id: "w2",
    guestName: "Pak Hendra",
    message: "Barakallah, semoga menjadi keluarga yang bahagia selamanya.",
    submittedAt: "2026-06-10T11:00:00Z",
  },
];

export const dummyProjects: InvitationProject[] = [
  {
    id: "p1",
    slug: "rama-sinta",
    coupleLabel: "Rama & Sinta",
    eventDate: "2026-08-22",
    templateSlug: "aksara",
    status: "published",
    createdAt: "2026-05-01",
    ownerWoId: "wo-1",
    guests: sampleGuests,
    rsvps: sampleRsvps,
    wishes: sampleWishes,
    data: {
      id: "inv-1",
      eventId: "evt-rama-sinta-2026",
      templateSlug: "aksara",
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
          description: "Bertemu di acara kampus, sapaan sederhana berbuah cerita.",
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
        closing: "Merupakan suatu kehormatan bagi kami atas kehadiran dan doa restunya.",
      },
      custom: {},
    },
  },
  {
    id: "p2",
    slug: "arka-naya",
    coupleLabel: "Arka & Naya",
    eventDate: "2026-10-05",
    templateSlug: "senandika",
    status: "draft",
    createdAt: "2026-06-01",
    ownerWoId: "wo-2",
    guests: [],
    rsvps: [],
    wishes: [],
    data: {
      id: "inv-2",
      eventId: "evt-arka-naya-2026",
      templateSlug: "senandika",
      groom: {
        fullName: "Arka Wibisana",
        nickName: "Arka",
        fatherName: "Bapak Wibowo",
        motherName: "Ibu Sari",
      },
      bride: {
        fullName: "Naya Anggraini",
        nickName: "Naya",
        fatherName: "Bapak Anggara",
        motherName: "Ibu Maya",
      },
      events: [
        {
          id: "e1",
          name: "Resepsi",
          date: "2026-10-05",
          startTime: "18:00",
          endTime: "22:00",
          venueName: "The Glasshouse",
          address: "Bandung",
        },
      ],
      loveStory: [],
      gallery: [],
      gifts: [],
      settings: {},
      custom: {
        favoriteVerse:
          "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan…",
        preweddingVideoUrl: "https://youtu.be/dQw4w9WgXcQ",
      },
    },
  },
];

/** A "newly detected" template that admin hasn't activated yet — demo only. */
export const dummyDetectedNewTemplate = {
  slug: "candrawasih",
  name: "Candrawasih",
  thumbnail:
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=70&auto=format&fit=crop",
};

/** Activation state for templates in the catalog — admin can toggle these. */
export const dummyTemplateActiveState: Record<string, boolean> = {
  aksara: true,
  senandika: true,
};

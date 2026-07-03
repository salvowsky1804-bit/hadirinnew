// Invitation domain model. Shared core that every template can rely on,
// plus a flexible `custom` bag whose keys come from the template manifest.

export interface Person {
  fullName: string;
  nickName: string;
  fatherName: string;
  motherName: string;
  photo?: string;
  instagram?: string;
}

export interface InvitationEvent {
  id: string;
  name: string; // e.g. "Akad Nikah", "Resepsi"
  date: string; // ISO date
  startTime: string; // "HH:mm"
  endTime: string;
  venueName: string;
  address: string;
  mapsUrl?: string;
}

export interface LoveStoryMoment {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
}

export interface GiftAccount {
  id: string;
  kind: "bank" | "ewallet";
  provider: string; // BCA, Mandiri, GoPay…
  accountNumber: string;
  accountName: string;
}

export interface InvitationSettings {
  musicUrl?: string;
  greeting?: string;
  closing?: string;
}

export interface Guest {
  id: string;
  name: string;
  group?: string;
  pax: number;
  slug: string; // appended to invitation URL
  /** Storage path to the guest's QR image inside the `guest-qr` bucket. */
  qr?: string;
}

export type RsvpStatus = "attending" | "not_attending" | "tentative";

export interface RsvpEntry {
  id: string;
  guestName: string;
  status: RsvpStatus;
  pax: number;
  submittedAt: string;
}

export interface WishEntry {
  id: string;
  guestName: string;
  message: string;
  submittedAt: string;
  /** When false, wish is hidden from the public invitation. Defaults to true. */
  visible?: boolean;
}

/**
 * The single source of truth for a wedding invitation.
 * Core fields are stable; `custom` holds any extra field declared by the
 * selected template's manifest (keyed by field id).
 */
export interface InvitationData {
  id: string;
  eventId: string; // reserved: bridges to future QR attendance app
  templateSlug: string;
  groom: Person;
  bride: Person;
  events: InvitationEvent[];
  loveStory: LoveStoryMoment[];
  gallery: GalleryPhoto[];
  gifts: GiftAccount[];
  settings: InvitationSettings;
  /** Field-id → value, declared by the template manifest. */
  custom: Record<string, unknown>;
}

export type ProjectStatus = "draft" | "published";

export interface InvitationProject {
  id: string;
  slug: string; // /u/:slug
  coupleLabel: string; // "Rama & Sinta"
  eventDate: string;
  templateSlug: string;
  status: ProjectStatus;
  createdAt: string;
  ownerWoId: string;
  data: InvitationData;
  guests: Guest[];
  rsvps: RsvpEntry[];
  wishes: WishEntry[];
}

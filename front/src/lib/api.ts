import { BACKEND_URL } from '@/lib/config';

export interface TrackItem {
  id: number;
  name: string;
  description: string;
  order: number;
}

export interface MemberItem {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string | null;
  order: number;
}

export interface PartnerItem {
  id: number;
  name: string;
  logo: string;
  url: string;
  order: number;
}

export interface SiteConfig {
  event_start: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface BrandColorItem {
  id: number;
  label: string;
  hex: string;
  usage: string;
  order: number;
}

export interface BrandTypeItem {
  id: number;
  label: string;
  size: string;
  weight: number;
  tracking: string;
  mono: boolean;
  order: number;
}

export interface BrandRuleItem {
  id: number;
  kind: "do" | "dont";
  text: string;
  order: number;
}

export interface BrandBook {
  id: number;
  name: string;
  tagline: string;
  description: string;
  logo: string | null;
  font_family: string;
  font_mono: string;
  colors: BrandColorItem[];
  type_scale: BrandTypeItem[];
  rules: BrandRuleItem[];
}

export interface PartnerAdvantageItem {
  id: number;
  title: string;
  description: string;
  order: number;
}

export interface PartnerPackageItem {
  id: number;
  label: string;
  description: string;
  perks: string[];
  order: number;
}

export interface PartnerAssetItem {
  id: number;
  title: string;
  file: string;
  order: number;
}

export interface PartnerSection {
  description: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  advantages: PartnerAdvantageItem[];
  packages: PartnerPackageItem[];
  assets: PartnerAssetItem[];
}

export interface PartnerMe {
  email: string;
  name: string;
  participant_count: number;
  partner: {
    name: string;
    url: string;
    order: number;
    logo: string | null;
  } | null;
  lead: {
    company: string;
    status: string;
    package: string | null;
  } | null;
}

const REVALIDATE_SECONDS = 60;

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (error) {
    console.error(`[api] Failed to fetch ${path}`, error);
    return null;
  }
}

export function fetchTracks(locale: string) {
  return getJson<TrackItem[]>(`/api/tracks/?locale=${locale}`);
}

export function fetchMentors(locale: string) {
  return getJson<MemberItem[]>(`/api/mentors/?locale=${locale}`);
}

export function fetchJury(locale: string) {
  return getJson<MemberItem[]>(`/api/jury/?locale=${locale}`);
}

export function fetchPartners(locale: string) {
  return getJson<PartnerItem[]>(`/api/partners/?locale=${locale}`);
}

export function fetchConfig() {
  return getJson<SiteConfig>(`/api/config/`);
}

export async function fetchConfigClient(): Promise<SiteConfig | null> {
  try {
    const res = await fetch("/api/config/");
    if (!res.ok) return null;
    return (await res.json()) as SiteConfig;
  } catch (error) {
    console.error("[api] Failed to fetch /api/config/", error);
    return null;
  }
}

export function fetchFaq(locale: string) {
  return getJson<FaqItem[]>(`/api/faq/?locale=${locale}`);
}

export function fetchBrandBook(locale: string) {
  return getJson<BrandBook>(`/api/brand-book/?locale=${locale}`);
}

export function fetchPartnerSection(locale: string) {
  return getJson<PartnerSection>(`/api/partner-section/?locale=${locale}`);
}

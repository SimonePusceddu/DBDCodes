// === PROMO CODES ===
export interface PromoCode {
  id: string;
  code: string;
  title: string;
  description: string;
  expiresAt: string | null;
  daysLeft: number | null;
  type: PromoCodeType;
  isExpired: boolean;
}

export type PromoCodeType = 'badge' | 'charm' | 'cosmetic' | 'shards' | 'unknown';

export interface PromoCodesResponse {
  codes: PromoCode[];
  lastUpdated: Date;
  error?: string;
}

// === SHRINE OF SECRETS ===
export interface ShrinePerk {
  id: string;
  name: string;
  bloodpoints: number;
  shards: number;
  iconUrl?: string;
  characterName?: string;
  type: 'survivor' | 'killer';
}

export interface ShrineData {
  id: number;
  perks: ShrinePerk[];
  startTime: Date;
  endTime: Date;
  lastUpdated: Date;
}

export interface ShrineApiResponse {
  id: number;
  perks: Array<{
    id: string;
    bloodpoints: number;
    shards: number;
  }>;
  start: number;
  end: number;
}

// === APP STATE ===
export interface AppState {
  promoCodes: PromoCodesResponse | null;
  shrine: ShrineData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  toastMessage: string | null;
}

// === COUNTDOWN ===
export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

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
  id: number;
  name: string;
  bloodpoints: number;
  shards: number;
  image?: string;
  characterName?: string;
  type: 'survivor' | 'killer';
  usageTier?: 'high' | 'low';
}

export interface ShrineData {
  week: number;
  perks: ShrinePerk[];
  startTime: Date;
  endTime: Date;
  lastUpdated: Date;
}

export interface NightLightShrineResponse {
  status: string;
  error: null | string;
  data: {
    start: string;
    end: string;
    week: number;
    perks: Array<{
      id: number;
      bloodpoints: number;
      shards: number;
      name: string;
      image: string;
      character: string;
      usage_tier: 'high' | 'low';
    }>;
  };
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

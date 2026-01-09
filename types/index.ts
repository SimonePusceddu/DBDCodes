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

// Mixed list item type for codes and ads
export type PromoListItem =
  | { type: 'code'; data: PromoCode }
  | { type: 'ad'; id: string };

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
  news: NewsResponse | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  toastMessage: string | null;
}

// === NEWS ===
export interface NewsItem {
  id: string;
  title: string;
  url: string;
  author: string;
  contents: string;
  feedLabel: string;
  date: Date;
}

export interface NewsResponse {
  items: NewsItem[];
  lastUpdated: Date;
}

export interface SteamNewsApiResponse {
  appnews: {
    appid: number;
    newsitems: Array<{
      gid: string;
      title: string;
      url: string;
      is_external_url: boolean;
      author: string;
      contents: string;
      feedlabel: string;
      date: number;
      feedname: string;
      feed_type: number;
      appid: number;
    }>;
    count: number;
  };
}

// === COUNTDOWN ===
export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

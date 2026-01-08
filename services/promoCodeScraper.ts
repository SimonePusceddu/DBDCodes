import { PromoCode, PromoCodesResponse, PromoCodeType } from '@/types';

const DBDCOUPONS_URL = 'https://dbdcoupons.com/';

interface RawCouponData {
  title: string;
  desc: string;
  code: string;
  expires: string;
  daysLeft: number;
  usesToday: number;
  type: string;
}

export async function fetchPromoCodes(): Promise<PromoCodesResponse> {
  try {
    const response = await fetch(DBDCOUPONS_URL, {
      headers: {
        'User-Agent': 'DBDCodes-App/1.0',
        Accept: 'text/html',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const html = await response.text();
    const codes = extractCodesFromHtml(html);

    return {
      codes,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Failed to fetch promo codes:', error);
    return {
      codes: [],
      lastUpdated: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function extractCodesFromHtml(html: string): PromoCode[] {
  // Strategy 1: Extract from embedded JavaScript array
  // The site uses: const coupons = [...]
  const couponsMatch = html.match(/const\s+coupons\s*=\s*(\[[\s\S]*?\]);/);

  if (couponsMatch) {
    try {
      // Convert JavaScript object notation to valid JSON
      const jsArray = couponsMatch[1];
      const jsonString = convertJsToJson(jsArray);
      const rawCoupons: RawCouponData[] = JSON.parse(jsonString);
      return rawCoupons
        .map(transformRawCoupon)
        .filter((code) => !code.isExpired);
    } catch (e) {
      console.error('Failed to parse coupons array:', e);
    }
  }

  // Strategy 2: Fallback to regex-based extraction of individual codes
  return extractCodesWithRegex(html);
}

function convertJsToJson(jsString: string): string {
  // Convert JavaScript object notation to valid JSON
  // 1. Add quotes around unquoted property names
  // 2. Handle trailing commas

  let json = jsString
    // Add quotes around unquoted property names (word followed by colon)
    .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
    // Remove trailing commas before ] or }
    .replace(/,(\s*[}\]])/g, '$1');

  return json;
}

function extractCodesWithRegex(html: string): PromoCode[] {
  const codes: PromoCode[] = [];
  const foundCodes = new Set<string>();

  // Pattern to extract individual coupon objects from the JavaScript
  // Match: { title: "...", desc: "...", code: "...", ... }
  const objectPattern = /\{\s*title:\s*"([^"]+)"[^}]*code:\s*"([^"]+)"[^}]*desc:\s*"([^"]*)"[^}]*(?:expires:\s*"([^"]*)")?[^}]*(?:daysLeft:\s*(\d+))?[^}]*(?:type:\s*"([^"]*)")?[^}]*\}/gi;

  let match;
  while ((match = objectPattern.exec(html)) !== null) {
    const [, title, code, desc, expires, daysLeftStr, type] = match;

    if (code && !foundCodes.has(code)) {
      foundCodes.add(code);
      const daysLeft = daysLeftStr ? parseInt(daysLeftStr, 10) : null;

      codes.push({
        id: generateId(code),
        code,
        title: title || code,
        description: desc || '',
        expiresAt: expires || null,
        daysLeft,
        type: mapCodeType(type || ''),
        isExpired: daysLeft !== null && daysLeft <= 0,
      });
    }
  }

  // If no structured matches, try simple code extraction
  if (codes.length === 0) {
    const simpleCodePattern = /code:\s*"([A-Z0-9]+)"/gi;
    while ((match = simpleCodePattern.exec(html)) !== null) {
      const code = match[1];
      if (code && code.length >= 6 && !foundCodes.has(code)) {
        foundCodes.add(code);
        codes.push({
          id: generateId(code),
          code,
          title: code,
          description: 'Promo Code',
          expiresAt: null,
          daysLeft: null,
          type: 'unknown',
          isExpired: false,
        });
      }
    }
  }

  return codes;
}

function transformRawCoupon(raw: RawCouponData): PromoCode {
  const isExpired = raw.daysLeft !== undefined && raw.daysLeft <= 0;

  return {
    id: generateId(raw.code),
    code: raw.code,
    title: raw.title,
    description: raw.desc,
    expiresAt: raw.expires || null,
    daysLeft: raw.daysLeft ?? null,
    type: mapCodeType(raw.type),
    isExpired,
  };
}

function mapCodeType(type: string): PromoCodeType {
  if (!type) return 'unknown';
  const typeMap: Record<string, PromoCodeType> = {
    badge: 'badge',
    charm: 'charm',
    cosmetic: 'cosmetic',
    shards: 'shards',
  };
  return typeMap[type.toLowerCase()] || 'unknown';
}

function generateId(code: string): string {
  return `code_${code.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
}

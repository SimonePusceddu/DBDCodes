import { PromoCode, PromoListItem } from '@/types';

/**
 * Inserts ad placeholders into a codes array at regular intervals
 *
 * @param codes - Array of promo codes
 * @param adFrequency - Show an ad after every N codes (default: 8)
 * @returns Mixed array of codes and ad placeholders
 *
 * @example
 * // With 20 codes and frequency of 8:
 * // Returns array with codes at 0-7, ad at 8, codes at 9-15, ad at 16, codes at 17-19
 * const mixed = insertAdsIntoCodesList(codes, 8);
 */
export function insertAdsIntoCodesList(
  codes: PromoCode[],
  adFrequency: number = 8
): PromoListItem[] {
  const items: PromoListItem[] = [];

  codes.forEach((code, index) => {
    // Add the promo code
    items.push({ type: 'code', data: code });

    // Insert ad after every adFrequency codes
    // But not after the last code (to avoid orphaned ad at the end)
    if ((index + 1) % adFrequency === 0 && index < codes.length - 1) {
      items.push({
        type: 'ad',
        id: `ad-${Math.floor(index / adFrequency)}`,
      });
    }
  });

  return items;
}

/**
 * Calculate how many ads will be shown for a given number of codes
 *
 * @param codeCount - Number of promo codes
 * @param adFrequency - Show an ad after every N codes (default: 8)
 * @returns Number of ads that will be displayed
 *
 * @example
 * getAdCount(16, 8) // Returns 1 (ad after 8th code)
 * getAdCount(20, 8) // Returns 2 (ads after 8th and 16th codes)
 * getAdCount(7, 8)  // Returns 0 (not enough codes)
 */
export function getAdCount(codeCount: number, adFrequency: number = 8): number {
  if (codeCount < adFrequency) return 0;
  return Math.floor(codeCount / adFrequency);
}

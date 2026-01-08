import { ShrineData, NightLightShrineResponse, ShrinePerk } from '@/types';

const SHRINE_API_URL = 'https://api.nightlight.gg/v1/shrine';

export async function fetchShrineOfSecrets(): Promise<ShrineData | null> {
  try {
    const response = await fetch(SHRINE_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const apiResponse: NightLightShrineResponse = await response.json();

    if (apiResponse.status !== 'success' || !apiResponse.data) {
      throw new Error('Invalid API response');
    }

    return transformShrineData(apiResponse);
  } catch (error) {
    console.error('Failed to fetch shrine:', error);
    return null;
  }
}

function transformShrineData(response: NightLightShrineResponse): ShrineData {
  const { data } = response;

  return {
    week: data.week,
    perks: data.perks.map(transformPerk),
    startTime: new Date(data.start),
    endTime: new Date(data.end),
    lastUpdated: new Date(),
  };
}

function transformPerk(raw: {
  id: number;
  bloodpoints: number;
  shards: number;
  name: string;
  image: string;
  character: string;
  usage_tier: 'high' | 'low';
}): ShrinePerk {
  return {
    id: raw.id,
    name: raw.name,
    bloodpoints: raw.bloodpoints,
    shards: raw.shards,
    image: raw.image,
    characterName: raw.character,
    type: determineType(raw.character),
    usageTier: raw.usage_tier,
  };
}

function determineType(character: string): 'survivor' | 'killer' {
  // Killer characters typically start with "The"
  if (character.startsWith('The ')) {
    return 'killer';
  }
  return 'survivor';
}

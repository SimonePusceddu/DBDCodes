import { ShrineData, ShrineApiResponse, ShrinePerk } from '@/types';

const SHRINE_API_URL = 'https://dbd.tricky.lol/api/shrine';

export async function fetchShrineOfSecrets(): Promise<ShrineData | null> {
  try {
    const response = await fetch(SHRINE_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data: ShrineApiResponse = await response.json();
    return transformShrineData(data);
  } catch (error) {
    console.error('Failed to fetch shrine:', error);
    return null;
  }
}

function transformShrineData(raw: ShrineApiResponse): ShrineData {
  return {
    id: raw.id,
    perks: raw.perks.map(transformPerk),
    startTime: new Date(raw.start * 1000),
    endTime: new Date(raw.end * 1000),
    lastUpdated: new Date(),
  };
}

function transformPerk(raw: {
  id: string;
  bloodpoints: number;
  shards: number;
}): ShrinePerk {
  const perkInfo = getPerkInfo(raw.id);

  return {
    id: raw.id,
    name: perkInfo.name,
    bloodpoints: raw.bloodpoints,
    shards: raw.shards,
    characterName: perkInfo.character,
    type: perkInfo.type,
  };
}

interface PerkInfo {
  name: string;
  character?: string;
  type: 'survivor' | 'killer';
}

function getPerkInfo(perkId: string): PerkInfo {
  // Common perk name mappings
  const perkMap: Record<string, PerkInfo> = {
    // Survivor Perks
    Adrenaline: { name: 'Adrenaline', character: 'Meg Thomas', type: 'survivor' },
    'Borrowed Time': { name: 'Borrowed Time', character: 'Bill Overbeck', type: 'survivor' },
    'Dead Hard': { name: 'Dead Hard', character: 'David King', type: 'survivor' },
    'Decisive Strike': { name: 'Decisive Strike', character: 'Laurie Strode', type: 'survivor' },
    'Iron Will': { name: 'Iron Will', character: 'Jake Park', type: 'survivor' },
    'Self-Care': { name: 'Self-Care', character: 'Claudette Morel', type: 'survivor' },
    'Sprint Burst': { name: 'Sprint Burst', character: 'Meg Thomas', type: 'survivor' },
    'Unbreakable': { name: 'Unbreakable', character: 'Bill Overbeck', type: 'survivor' },
    'Urban Evasion': { name: 'Urban Evasion', character: 'Nea Karlsson', type: 'survivor' },
    'We\'re Gonna Live Forever': { name: 'We\'re Gonna Live Forever', character: 'David King', type: 'survivor' },
    Lithe: { name: 'Lithe', character: 'Feng Min', type: 'survivor' },
    Alert: { name: 'Alert', character: 'Feng Min', type: 'survivor' },
    'Bond': { name: 'Bond', character: 'Dwight Fairfield', type: 'survivor' },
    'Prove Thyself': { name: 'Prove Thyself', character: 'Dwight Fairfield', type: 'survivor' },
    'Quick & Quiet': { name: 'Quick & Quiet', character: 'Meg Thomas', type: 'survivor' },
    'Spine Chill': { name: 'Spine Chill', type: 'survivor' },
    'Kindred': { name: 'Kindred', type: 'survivor' },
    'Windows of Opportunity': { name: 'Windows of Opportunity', character: 'Kate Denson', type: 'survivor' },
    'Off the Record': { name: 'Off the Record', character: 'Zarina Kassir', type: 'survivor' },
    'Circle of Healing': { name: 'Circle of Healing', character: 'Mikaela Reid', type: 'survivor' },

    // Killer Perks
    'A Nurse\'s Calling': { name: 'A Nurse\'s Calling', character: 'The Nurse', type: 'killer' },
    'Barbecue & Chili': { name: 'Barbecue & Chili', character: 'The Cannibal', type: 'killer' },
    'Corrupt Intervention': { name: 'Corrupt Intervention', character: 'The Plague', type: 'killer' },
    'Hex: Ruin': { name: 'Hex: Ruin', character: 'The Hag', type: 'killer' },
    'Hex: No One Escapes Death': { name: 'Hex: No One Escapes Death', type: 'killer' },
    'Pop Goes the Weasel': { name: 'Pop Goes the Weasel', character: 'The Clown', type: 'killer' },
    'Save the Best for Last': { name: 'Save the Best for Last', character: 'The Shape', type: 'killer' },
    'Scourge Hook: Pain Resonance': { name: 'Scourge Hook: Pain Resonance', character: 'The Artist', type: 'killer' },
    'Thanatophobia': { name: 'Thanatophobia', character: 'The Nurse', type: 'killer' },
    'Tinkerer': { name: 'Tinkerer', character: 'The Hillbilly', type: 'killer' },
    'Enduring': { name: 'Enduring', character: 'The Hillbilly', type: 'killer' },
    'Brutal Strength': { name: 'Brutal Strength', character: 'The Trapper', type: 'killer' },
    'Monitor & Abuse': { name: 'Monitor & Abuse', character: 'The Doctor', type: 'killer' },
    'Infectious Fright': { name: 'Infectious Fright', character: 'The Plague', type: 'killer' },
    'Discordance': { name: 'Discordance', character: 'The Legion', type: 'killer' },
    'I\'m All Ears': { name: 'I\'m All Ears', character: 'The Ghost Face', type: 'killer' },
    'Lethal Pursuer': { name: 'Lethal Pursuer', character: 'The Nemesis', type: 'killer' },
    'Deadlock': { name: 'Deadlock', character: 'The Cenobite', type: 'killer' },
    'Call of Brine': { name: 'Call of Brine', character: 'The Onryo', type: 'killer' },
    'Eruption': { name: 'Eruption', character: 'The Nemesis', type: 'killer' },
  };

  if (perkMap[perkId]) {
    return perkMap[perkId];
  }

  // Format unknown perk IDs
  return {
    name: formatPerkId(perkId),
    type: guessType(perkId),
  };
}

function formatPerkId(id: string): string {
  // Convert camelCase or PascalCase to "Title Case"
  return id
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, ' ')
    .trim();
}

function guessType(perkId: string): 'survivor' | 'killer' {
  // Some heuristics to guess perk type
  const killerKeywords = ['hex', 'scourge', 'devour', 'undying', 'ruin', 'noed'];
  const lowerPerkId = perkId.toLowerCase();

  for (const keyword of killerKeywords) {
    if (lowerPerkId.includes(keyword)) {
      return 'killer';
    }
  }

  // Default to survivor if unsure
  return 'survivor';
}

import { NewsResponse, NewsItem, SteamNewsApiResponse } from '@/types';

const NEWS_API_URL =
  'https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=381210&count=5&maxlength=300&format=json';

export async function fetchNews(): Promise<NewsResponse | null> {
  try {
    const response = await fetch(NEWS_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const apiResponse: SteamNewsApiResponse = await response.json();

    if (!apiResponse.appnews?.newsitems) {
      throw new Error('Invalid API response');
    }

    return transformNewsData(apiResponse);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return null;
  }
}

function transformNewsData(response: SteamNewsApiResponse): NewsResponse {
  const { newsitems } = response.appnews;

  return {
    items: newsitems.map(transformNewsItem),
    lastUpdated: new Date(),
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function transformNewsItem(raw: SteamNewsApiResponse['appnews']['newsitems'][0]): NewsItem {
  return {
    id: raw.gid,
    title: stripHtml(raw.title),
    url: raw.url,
    author: raw.author,
    contents: stripHtml(raw.contents),
    feedLabel: raw.feedlabel,
    date: new Date(raw.date * 1000),
  };
}

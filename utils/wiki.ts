export function getPerkWikiUrl(perkName: string): string {
  const formattedName = perkName.replace(/ /g, '_');
  return `https://deadbydaylight.wiki.gg/wiki/${encodeURIComponent(formattedName)}`;
}

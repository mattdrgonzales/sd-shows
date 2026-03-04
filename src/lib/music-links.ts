export function spotifySearchUrl(artist: string): string {
  return `https://open.spotify.com/search/${encodeURIComponent(artist)}`;
}

export function appleMusicSearchUrl(artist: string): string {
  return `https://music.apple.com/us/search?term=${encodeURIComponent(artist)}`;
}

export function youtubeSearchUrl(artist: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(artist)}`;
}

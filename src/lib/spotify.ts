import { unstable_cache } from "next/cache";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) return null;

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.access_token;
}

async function searchArtistImage(
  artist: string,
  token: string,
): Promise<string | null> {
  const url = `${SPOTIFY_SEARCH_URL}?${new URLSearchParams({
    q: artist,
    type: "artist",
    limit: "1",
  })}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get("retry-after") || "2");
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return searchArtistImage(artist, token);
  }

  if (!res.ok) return null;

  const data = await res.json();
  const artists = data?.artists?.items;
  if (!artists?.length) return null;

  const images = artists[0].images;
  if (!images?.length) return null;

  const medium = images.find(
    (img: { width: number }) => img.width >= 160 && img.width <= 400,
  );
  return (medium || images[0]).url;
}

async function _fetchArtistImages(
  artists: string[],
): Promise<Record<string, string | null>> {
  const result: Record<string, string | null> = {};

  const token = await getAccessToken();
  if (!token) {
    for (const a of artists) result[a] = null;
    return result;
  }

  const CONCURRENCY = 10;

  for (let i = 0; i < artists.length; i += CONCURRENCY) {
    const batch = artists.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map((a) => searchArtistImage(a, token).catch(() => null)),
    );
    batch.forEach((a, idx) => (result[a] = results[idx] ?? null));
  }

  return result;
}

/**
 * Batch-fetch artist images from Spotify, cached for 1 hour.
 */
export async function fetchArtistImages(
  artists: string[],
): Promise<Map<string, string | null>> {
  const sorted = [...artists].sort();
  const key = sorted.join("|");

  const cached = unstable_cache(
    async () => _fetchArtistImages(sorted),
    [`spotify-images-${key}`],
    { revalidate: 3600 },
  );

  const record = await cached();
  return new Map(Object.entries(record));
}

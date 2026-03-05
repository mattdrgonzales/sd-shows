const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) return null;

  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

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
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.token;
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

  // Pick medium-sized image (300px) or first available
  const images = artists[0].images;
  if (!images?.length) return null;

  const medium = images.find(
    (img: { width: number }) => img.width >= 160 && img.width <= 400,
  );
  return (medium || images[0]).url;
}

/**
 * Batch-fetch artist images from Spotify.
 * Returns a map of artist name → image URL (or null).
 */
export async function fetchArtistImages(
  artists: string[],
): Promise<Map<string, string | null>> {
  const result = new Map<string, string | null>();

  const token = await getAccessToken();
  if (!token) {
    // No credentials — return all nulls
    for (const a of artists) result.set(a, null);
    return result;
  }

  const CONCURRENCY = 5;
  const DELAY_MS = 200;

  for (let i = 0; i < artists.length; i += CONCURRENCY) {
    const batch = artists.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map((a) => searchArtistImage(a, token).catch(() => null)),
    );
    batch.forEach((a, idx) => result.set(a, results[idx] ?? null));

    if (i + CONCURRENCY < artists.length) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  return result;
}

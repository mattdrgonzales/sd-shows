import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string | null> {
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
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.token;
}

export async function GET(req: NextRequest) {
  const artist = req.nextUrl.searchParams.get("artist");
  if (!artist) {
    return NextResponse.json({ error: "artist param required" }, { status: 400 });
  }

  const token = await getToken();
  if (!token) {
    return NextResponse.json({ image: null }, {
      headers: { "Cache-Control": "public, s-maxage=3600" },
    });
  }

  const url = `${SPOTIFY_SEARCH_URL}?${new URLSearchParams({ q: artist, type: "artist", limit: "1" })}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  if (!res.ok) {
    return NextResponse.json({ image: null }, {
      headers: { "Cache-Control": "public, s-maxage=60" },
    });
  }

  const data = await res.json();
  const images = data?.artists?.items?.[0]?.images;
  let image: string | null = null;

  if (images?.length) {
    const medium = images.find((img: { width: number }) => img.width >= 160 && img.width <= 400);
    image = (medium || images[0]).url;
  }

  return NextResponse.json({ image }, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}

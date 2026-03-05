import { NextRequest, NextResponse } from "next/server";
import { fetchArtistImages } from "@/lib/spotify";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { artists } = await req.json();

  if (!Array.isArray(artists)) {
    return NextResponse.json({ error: "artists must be an array" }, { status: 400 });
  }

  const imageMap = await fetchArtistImages(artists);
  const images: Record<string, string | null> = {};
  for (const [k, v] of imageMap) {
    images[k] = v;
  }

  return NextResponse.json(images, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}

import { NextResponse } from "next/server";
export async function POST() {
  if (!process.env.IMAGE_PROVIDER_API_KEY || !process.env.IMAGE_PROVIDER_BASE_URL) {
    return NextResponse.json({ error: "Image generation is not configured. Add an image provider and credentials." }, { status: 503 });
  }
  return NextResponse.json({ error: "Connect and implement your selected image provider before enabling this endpoint." }, { status: 501 });
}

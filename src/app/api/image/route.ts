import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 2;
const requests = new Map<string, number[]>();
function limited(key: string) {
  const now = Date.now();
  const recent = (requests.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) { requests.set(key, recent); return true; }
  recent.push(now); requests.set(key, recent);
  if (requests.size > 1000) for (const [k, values] of requests) if (!values.some((time) => now - time < WINDOW_MS)) requests.delete(k);
  return false;
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try { if (new URL(origin).host !== new URL(request.url).host) return NextResponse.json({ error: "Cross-site requests are not allowed." }, { status: 403 }); }
    catch { return NextResponse.json({ error: "Invalid request origin." }, { status: 403 }); }
  }
  if (Number(request.headers.get("content-length") ?? "0") > 5000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  const key = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(key)) return NextResponse.json({ error: "Image limit reached. Please wait a minute before generating another image." }, { status: 429, headers: { "Retry-After": "60" } });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "Image generation is not connected yet. Add OPENAI_API_KEY in Vercel after setting up API billing." }, { status: 503 });
  try {
    const body = await request.json();
    const rawPrompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const style = body.style === "anime" ? "anime illustration" : "photorealistic";
    if (rawPrompt.length < 8 || rawPrompt.length > 800) return NextResponse.json({ error: "Describe your character in 8 to 800 characters." }, { status: 400 });
    const prompt = [
      "Create one polished, original AI companion character portrait for a fictional character design app.",
      "The character must be clearly an adult age 25 or older, fully clothed, non-explicit, and presented respectfully.",
      "Visual style: " + style + ".",
      "Character description: " + rawPrompt,
      "High-quality composition, expressive face, tasteful lighting, clean detailed background, no text, no watermark.",
      "Do not imitate a living artist exact style or depict a real person."
    ].join("\n");
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: "Bearer " + process.env.OPENAI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-image-2", prompt, n: 1, size: "1024x1024", quality: "low", output_format: "webp", moderation: "auto" }),
      signal: AbortSignal.timeout(90000),
    });
    if (!response.ok) {
      if (response.status === 429) return NextResponse.json({ error: "The image provider is busy or has reached its usage limit. Try later." }, { status: 429 });
      if (response.status === 401 || response.status === 403) return NextResponse.json({ error: "The API key or image-model access is not configured correctly." }, { status: 502 });
      return NextResponse.json({ error: "Image generation failed. Check API access and usage limits, then try again." }, { status: 502 });
    }
    const data = await response.json();
    const b64 = data.data?.[0]?.b64_json;
    if (typeof b64 !== "string" || !b64.length) return NextResponse.json({ error: "The image provider returned no image. Please try again." }, { status: 502 });
    return NextResponse.json({ image: "data:image/webp;base64," + b64 }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Could not process image request. Please try again." }, { status: 400 }); }
}
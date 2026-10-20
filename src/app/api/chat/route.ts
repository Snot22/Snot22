import { NextResponse } from "next/server";
export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Chat is not configured yet. Add OPENAI_API_KEY in your deployment environment." }, { status: 503 });
  }
  try {
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (!messages.length || messages.length > 30) {
      return NextResponse.json({ error: "Provide between 1 and 30 messages." }, { status: 400 });
    }
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages.map((m: { role?: string; content?: string }) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.content ?? "").slice(0, 6000),
        })),
        max_tokens: 700,
      }),
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: "The AI provider request failed." }, { status: 502 });
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content ?? "" });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

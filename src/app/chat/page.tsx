"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi, I'm Aria ✨ I'm an AI companion created for thoughtful, imaginative conversations. What would you like to talk about?" },
  ]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, busy]);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || busy || text.length > 2000) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setDraft("");
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-10) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Message could not be sent.");
      setMessages((current) => [...current, { role: "assistant", content: String(data.reply ?? "") }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="wrap chat-wrap">
    <header className="nav"><Link href="/" className="logo">lumora<span>✦</span></Link><Link href="/" className="btn secondary">← Home</Link></header>
    <section className="chat-shell">
      <div className="chat-heading"><div className="chat-avatar">A</div><div><h1>Chat with Aria</h1><p className="tiny">AI companion · Preview mode</p></div><span className="chat-status">● Online preview</span></div>
      <div className="chat-notice">AI-generated conversation. Please don't share passwords, payment details, or sensitive personal information.</div>
      <div className="chat-messages" aria-live="polite">
        {messages.map((m, i) => <div key={i} className={"message-row " + (m.role === "user" ? "mine" : "")}><div className={"message " + (m.role === "user" ? "user-message" : "ai-message")}>{m.content}</div></div>)}
        {busy && <div className="message-row"><div className="message ai-message typing">Aria is thinking…</div></div>}
        <div ref={endRef}/>
      </div>
      {error && <div className="chat-error" role="alert">{error}</div>}
      <form className="chat-form" onSubmit={sendMessage}>
        <textarea aria-label="Your message" value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Write a message to Aria…" rows={2} maxLength={2000} disabled={busy}/>
        <div className="chat-form-bottom"><span className="tiny">{draft.length}/2000 · Limited preview requests</span><button className="btn" type="submit" disabled={busy || !draft.trim()}> {busy ? "Sending…" : "Send ↑"} </button></div>
      </form>
      <p className="tiny chat-footnote">Preview only: conversation history is not saved. API requests are throttled best-effort; production needs sign-in and a shared rate limiter.</p>
    </section>
  </main>;
}

"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
export default function ImagesPage() {
  const [style, setStyle] = useState<"realistic" | "anime">("realistic");
  const [prompt, setPrompt] = useState("An adult woman with long dark hair, hazel eyes, a warm smile, elegant modern clothing, soft cinematic lighting, dreamy lavender background");
  const [image, setImage] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function generate(event: FormEvent) {
    event.preventDefault(); if (busy || prompt.trim().length < 8) return;
    setBusy(true); setError(""); setImage("");
    try {
      const response = await fetch("/api/image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ style, prompt: prompt.trim() }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Image generation failed."); setImage(String(data.image || ""));
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong. Please try again."); } finally { setBusy(false); }
  }
  return <main className="wrap images-wrap">
    <header className="nav"><Link href="/" className="logo">lumora<span>✦</span></Link><Link href="/" className="btn secondary">← Home</Link></header>
    <section className="section"><span className="eyebrow">AI CHARACTER STUDIO</span><h2 style={{marginTop:18}}>Give your imagination <span className="gradient">a face.</span></h2>
      <p className="sub">Design an original fictional adult character in realistic or anime style. Generated images are temporary in this preview and are not saved to an account.</p>
      <div className="creator-grid image-builder"><form className="card image-controls" onSubmit={generate}>
        <div className="field"><label>Visual style</label><div className="chips">
          <button type="button" className={"chip "+(style==="realistic"?"active":"")} onClick={()=>setStyle("realistic")}>Realistic</button>
          <button type="button" className={"chip "+(style==="anime"?"active":"")} onClick={()=>setStyle("anime")}>Anime</button>
        </div></div>
        <div className="field"><label htmlFor="character-prompt">Describe your character</label><textarea id="character-prompt" rows={7} maxLength={800} value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Hair, eyes, clothing, lighting, setting…" required minLength={8}/><span className="tiny">{prompt.length}/800 characters</span></div>
        <div className="image-cost-note">Each generation uses paid API credits. Start with low quality to keep costs down. Avoid including private information.</div>
        <button className="btn" type="submit" disabled={busy || prompt.trim().length < 8}>{busy ? "Creating your character…" : "✦ Generate character image"}</button>
        {error && <div className="chat-error" role="alert">{error}</div>}
        <p className="tiny">Limit: 2 generation requests per minute per IP in this preview. The limit is best-effort and not a production-grade global quota.</p>
      </form><div className="image-result">
        {image ? <><img className="generated-image" src={image} alt="Generated fictional AI companion portrait"/><div className="image-result-actions"><span className="tiny">Generated preview · Not saved</span><a className="btn" href={image} download="lumora-character.webp">Download image ↓</a></div></> : <div className="image-placeholder"><div className="image-placeholder-icon">{busy ? "✧" : "✦"}</div><h3>{busy ? "Creating your character…" : "Your character appears here"}</h3><p className="tiny">{busy ? "This may take a little while. Keep this page open." : "Choose a style, refine the prompt, then generate your first portrait."}</p></div>}
      </div></div>
    </section></main>;
}
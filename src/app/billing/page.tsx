import Link from "next/link";
export default function BillingPage() {
 return <main className="wrap"><header className="nav"><Link href="/" className="logo">lumora<span>✦</span></Link><Link href="/" className="btn secondary">← Home</Link></header><section className="section"><h2>Plans & billing</h2><p className="sub">Pricing shown on the homepage is illustrative. Subscription checkout is disabled until account authentication, Stripe checkout, and verified webhooks are implemented.</p><div className="card" style={{marginTop:24,maxWidth:650}}><h3>No payment will be collected</h3><p>Do not advertise paid subscriptions as active until the full billing flow has been tested end to end.</p><Link className="btn secondary" href="/#plans">View plan preview</Link></div></section></main>;
}

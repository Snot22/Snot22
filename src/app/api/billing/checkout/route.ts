import { NextResponse } from "next/server";
export async function POST() {
  // Intentionally disabled until authenticated user ownership, Stripe checkout,
  // and subscription entitlement checks are implemented.
  return NextResponse.json({ error: "Billing is not enabled. Configure authentication and Stripe before launch." }, { status: 501 });
}

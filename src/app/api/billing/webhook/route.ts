import { NextResponse } from "next/server";
export async function POST() {
  // Do not enable paid plans until raw-body Stripe signature verification and
  // idempotent subscription state updates are implemented.
  return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 501 });
}

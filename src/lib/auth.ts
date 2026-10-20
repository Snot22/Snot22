/**
 * Authentication is intentionally not wired yet.
 * Before launch, integrate a supported auth provider and enforce authorization
 * in every private API route and admin page. Do not treat this helper as auth.
 */
export function authNotConfigured() {
  return new Response(JSON.stringify({ error: "Authentication is not configured." }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  });
}

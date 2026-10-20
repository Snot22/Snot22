# Lumora — AI Companion

An original AI companion website starter with a dark, luxury-inspired interface and a character studio for realistic and anime concepts.

## Preview features
- Responsive landing page and illustrative pricing section
- Interactive character studio: name, style, personality, and appearance brief
- Copyable character brief
- Placeholder routes for login, billing, and admin
- Starter API route for OpenAI-compatible chat requests
- Prisma/PostgreSQL data model for users, companions, conversations, messages, and subscriptions
- Environment-variable template with no real credentials

## Run locally
Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The public preview does not need API keys. The chat API returns a configuration message until `OPENAI_API_KEY` is set.

## Deploy on Vercel
1. Open https://vercel.com/new and connect GitHub if prompted.
2. Import `Snot22/Snot22`.
3. Keep the root directory as `./` and the framework as Next.js.
4. Deploy. No environment variables are required for the public landing-page preview.

Vercel supports importing Git repositories and automatically deploying new pushes. See the [Vercel Git deployment guide](https://vercel.com/docs/git).

## Environment variables
Copy `.env.example` to `.env.local` for local development. Add real values only in your local ignored env file or Vercel Project Settings → Environment Variables. Never commit secrets.

- `OPENAI_API_KEY`: optional, enables the starter chat endpoint
- `DATABASE_URL`: PostgreSQL connection string, needed when database features are implemented
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`: reserved for future authentication setup
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PREMIUM`: reserved for future billing setup
- `IMAGE_PROVIDER_API_KEY`, `IMAGE_PROVIDER_BASE_URL`: reserved for image provider integration
- `VOICE_PROVIDER_API_KEY`: reserved for voice provider integration

## Important: not production-ready
This is a scaffold, not a complete commercial service. Authentication, persistent chat memory, image generation, voice conversations, Stripe checkout and webhook signature verification, subscription entitlements, admin authorization, rate limiting, moderation, privacy/deletion flows, and abuse prevention are not fully implemented. The billing endpoints are intentionally disabled. Do not accept payments or store sensitive user data until these systems are implemented and security-tested.

The name “Lumora” is a working brand; check trademark and domain availability before commercial use.

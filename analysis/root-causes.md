# Root Causes — POST /api/checkout/create-session → 500

## Cause 1: Wrong App Deployed (HIGH confidence)

**Explanation:** The `vercel.json` at the repo root had no `rootDirectory` field. Vercel defaulted to building from `/`, which deployed the **root-level app** — an older version using Stripe Checkout Sessions. The root app has `app/api/checkout/create-session/route.ts`, which was the route returning 500.

The gemini app (`gemini/tsuyanouchi/`) does not have this route at all. It uses `/api/payments/create-intent` with embedded Stripe Elements. If the gemini app had been deployed, the user would have seen a 404 (not 500) on `/api/checkout/create-session`.

**Affected files:**
- `vercel.json` (missing `rootDirectory`)
- `app/api/checkout/create-session/route.ts` (root app — the crashing route)

**Confidence:** HIGH

---

## Cause 2: STRIPE_SECRET_KEY Missing on Vercel (HIGH confidence)

**Explanation:** Even within the root app, the 500 was likely triggered by `getStripeClient()` in `lib/stripe.ts` throwing `"STRIPE_SECRET_KEY is not set"`. If the Stripe secret key was configured for the gemini app's environment but not for the root app's Vercel deployment, the Stripe client would fail to initialize.

**Affected files:**
- `lib/stripe.ts` (Stripe client initialization)
- `app/api/checkout/create-session/route.ts` (calls `stripe.checkout.sessions.create()`)

**Confidence:** HIGH (for production)

---

## Cause 3: Dual next.config Blocking Builds (MEDIUM confidence)

**Explanation:** Both `next.config.mjs` and `next.config.ts` existed at the repo root. Next.js uses `.ts` over `.mjs`, so the `typescript.ignoreBuildErrors: true` setting in `.mjs` was silently ignored. Any TypeScript errors in the root app could fail the Vercel build entirely, preventing deployment of the latest code.

**Affected files:**
- `next.config.mjs` (now deleted)
- `next.config.ts` (now updated)

**Confidence:** MEDIUM

---

## Cause 4: Error Swallowing Masked the Real Issue (LOW — contributing factor)

**Explanation:** The catch block in `create-session/route.ts` logged to `console.error` but returned a generic error message to the client. Without access to server logs, the actual Stripe error (missing key, invalid params, etc.) was invisible to the developer.

**Affected files:**
- `app/api/checkout/create-session/route.ts` (lines 163-168)

**Confidence:** LOW (not a root cause, but made debugging harder)

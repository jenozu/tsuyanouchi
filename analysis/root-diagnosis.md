# Root Diagnosis

## Confirmed Active Root

**`gemini/tsuyanouchi/`** is the correct and intended active root.

## Evidence

- The Repo Audit Summary (`gemini/tsuyanouchi/misc/Repo Audit Summary.md`) identifies `gemini/tsuyanouchi/` as the "current version" and the root-level app as "an older version."
- The gemini app uses the modern Stripe Payment Intents pattern with embedded Stripe Elements.
- The root app uses the older Stripe Checkout Sessions pattern (redirect to Stripe-hosted page).
- The 500 error (`POST /api/checkout/create-session`) was caused by Vercel deploying the **root app** instead of the gemini app, because `vercel.json` had no `rootDirectory` set.

## Fix Applied

`vercel.json` at the repo root now includes `"rootDirectory": "gemini/tsuyanouchi"`.

## Directory Layout

| Directory | Status | Notes |
|-----------|--------|-------|
| `/` (repo root) | **Legacy** | Old Next.js app with Stripe Checkout Sessions. Contains `app/`, `lib/`, `components/` that shadow the gemini app. |
| `gemini/tsuyanouchi/` | **Active** | Current Next.js app with Stripe Payment Intents + Elements. |
| `old-root-backup/` | **Archive** | Even older version (v0 project). Safely ignorable. |

## Duplicate / Stale Files at Root

- `next.config.mjs` (deleted) — conflicted with `next.config.ts`, silently overrode settings
- `next.config.ts` at root — only relevant if root app is used
- `app/api/checkout/create-session/route.ts` — old Checkout Sessions route, not used by gemini app
- `app/checkout/page.tsx` — old checkout page (redirect-based), not used by gemini app
- `lib/stripe.ts` at root — duplicate of `gemini/tsuyanouchi/lib/stripe.ts`
- `vercel.json` at root — now updated with `rootDirectory`

## Files Used by Checkout Flow (gemini/tsuyanouchi)

| File | Role |
|------|------|
| `app/checkout/page.tsx` | Checkout page (shipping form + Stripe Elements) |
| `app/api/payments/create-intent/route.ts` | Creates Stripe PaymentIntent |
| `app/api/payments/update-intent/route.ts` | Updates PaymentIntent |
| `app/api/orders/route.ts` | Creates order in Supabase |
| `app/api/webhooks/stripe/route.ts` | Handles Stripe webhook events |
| `app/api/shipping/rate/route.ts` | Returns shipping cost for country/quantity |
| `app/thank-you/page.tsx` | Post-checkout success page |
| `lib/stripe.ts` | Stripe client + PaymentIntent helpers |
| `lib/cart-context.tsx` | Cart state management |
| `lib/tax.ts` | Tax computation |
| `lib/shipping.ts` | Shipping rate lookup |
| `lib/supabase-helpers.ts` | DB helpers (orders, products) |
| `lib/email.ts` | Order confirmation + admin notification emails |

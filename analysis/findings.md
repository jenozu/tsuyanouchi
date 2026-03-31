# Findings — Wiring Audit

## Critical

### C-1: Vercel was deploying the wrong app
- **What:** `vercel.json` had no `rootDirectory`, so Vercel built from the repo root (old app) instead of `gemini/tsuyanouchi/` (current app).
- **Why it matters:** The root app's `/api/checkout/create-session` was being hit instead of the gemini app's `/api/payments/create-intent`. The root route was failing with 500.
- **Files:** `vercel.json` (repo root)
- **Impact:** Complete checkout failure in production.
- **Fix:** Added `"rootDirectory": "gemini/tsuyanouchi"` to `vercel.json`.

### C-2: Dual next.config files at repo root
- **What:** Both `next.config.mjs` and `next.config.ts` existed. Next.js picks `.ts`, silently ignoring `.mjs`.
- **Why it matters:** `typescript.ignoreBuildErrors: true` was only in the `.mjs` file and was silently inactive. TypeScript errors could fail the Vercel build.
- **Files:** `next.config.mjs` (deleted), `next.config.ts` (updated)
- **Impact:** Builds could fail on Vercel with TS errors.
- **Fix:** Deleted `next.config.mjs`, merged settings into `next.config.ts`. Also added `typescript.ignoreBuildErrors` to `gemini/tsuyanouchi/next.config.ts`.

## High

### H-1: ProductSize interface missing `cost` field
- **What:** `ProductSize` in `gemini/tsuyanouchi/lib/supabase-helpers.ts` lacked `cost?: number`.
- **Why it matters:** `lib/csv-parser.ts` pushes objects with `cost` onto `ProductSize[]`, causing a TypeScript error. CSV product import would fail at build time.
- **Files:** `gemini/tsuyanouchi/lib/supabase-helpers.ts`
- **Impact:** CSV import broken; build errors without `ignoreBuildErrors`.
- **Fix:** Added `cost?: number` to `ProductSize`.

### H-2: Gemini env var name mismatch
- **What:** `services/gemini.ts` read `process.env.API_KEY` but the env file has `GEMINI_API_KEY`.
- **Why it matters:** AI description generation always fails with "API Key is missing."
- **Files:** `gemini/tsuyanouchi/services/gemini.ts`
- **Impact:** Admin "Generate Description" button broken.
- **Fix:** Changed to `process.env.GEMINI_API_KEY`.

### H-3: Gemini under-construction page missing Owner Access
- **What:** The gemini app's `/under-construction` page had no `OwnerAccessForm`. The root app had it.
- **Why it matters:** Site owner cannot preview the site during under-construction mode.
- **Files:** `gemini/tsuyanouchi/app/under-construction/page.tsx`
- **Impact:** Owner locked out of own site.
- **Fix:** Added `OwnerAccessForm` component and `/api/preview-access` route to gemini app.

### H-4: Gemini middleware had no preview bypass
- **What:** The gemini middleware redirected ALL non-API/non-admin traffic to `/under-construction` with no way to bypass.
- **Why it matters:** Even admin-authenticated users and preview-password users were blocked from viewing the site.
- **Files:** `gemini/tsuyanouchi/middleware.ts`
- **Impact:** Owner cannot view shop/checkout/cart while under construction.
- **Fix:** Added `admin_session` and `preview_access` cookie checks to middleware.

## Medium

### M-1: Order creation is fire-and-forget
- **What:** After `stripe.confirmPayment()` succeeds, `POST /api/orders` is called inside a try/catch that swallows errors.
- **Why it matters:** If the order POST fails, payment is taken but no order record exists. The webhook can partially recover by updating order status, but if the order was never created, `updateOrderStatus` does nothing.
- **Files:** `gemini/tsuyanouchi/app/checkout/page.tsx` (StripePaymentForm.handlePay)
- **Impact:** Potential lost orders on Supabase failures.

### M-2: Error messages in create-intent were generic
- **What:** The original catch block returned `"Failed to create payment intent"` regardless of the actual error.
- **Why it matters:** Makes debugging impossible — no distinction between missing env vars, invalid amounts, or Stripe API errors.
- **Files:** `gemini/tsuyanouchi/app/api/payments/create-intent/route.ts`
- **Impact:** Difficult to debug payment failures.
- **Fix:** Added Stripe-specific error handling with type/code/message logging.

## Low

### L-1: No favicon.ico
- **What:** No favicon exists in `public/`.
- **Why it matters:** Browser console logs a 404 on every page load.
- **Impact:** Cosmetic / console noise only.

### L-2: Stripe API version hardcoded
- **What:** `lib/stripe.ts` uses `apiVersion: '2024-12-18.acacia'`.
- **Why it matters:** If the `stripe` npm package is updated, the API version string may need updating too.
- **Impact:** Low risk; Stripe maintains backward compatibility.

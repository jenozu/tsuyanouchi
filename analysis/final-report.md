# Final Report — Checkout Fix

## 1. Active Root

**`gemini/tsuyanouchi/`** is the confirmed active root.

- `vercel.json` at repo root sets `"rootDirectory": "gemini/tsuyanouchi"`
- Vercel builds and deploys from this directory
- All checkout, payment, and order logic lives in `gemini/tsuyanouchi/`

## 2. Checkout Flow

The gemini app uses **Stripe Payment Intents** with embedded Stripe Elements:

1. **Cart** → `/cart` or CartDrawer → "Proceed to Checkout" → `/checkout`
2. **Step 1 — Shipping** → Form (react-hook-form + zod) → `GET /api/shipping/rate` → `computeTaxAmount()` → "Continue to Payment"
3. **Step 2 — Payment** → `POST /api/payments/create-intent` → Stripe Elements with `PaymentElement` → `stripe.confirmPayment()`
4. **Order** → `POST /api/orders` (fire-and-forget) → `clearCart()` → redirect to `/thank-you?orderId=...`
5. **Webhook** → `payment_intent.succeeded` → `updateOrderStatus` + emails

## 3. Issues Found

| Severity | Issue | Status |
|----------|-------|--------|
| Critical | Vercel deploying wrong app | Fixed |
| Critical | Dual next.config conflict | Fixed |
| High | ProductSize missing `cost` | Fixed |
| High | Gemini env var `API_KEY` vs `GEMINI_API_KEY` | Fixed |
| High | Middleware missing preview/admin bypass | Fixed |
| Medium | Generic error messages in create-intent | Fixed |
| Medium | Order creation fire-and-forget | Documented (risk) |

## 4. Root Cause(s)

- **Primary:** Vercel was deploying the wrong app (root instead of gemini). The root app has `/api/checkout/create-session`; the gemini app uses `/api/payments/create-intent`. The 500 error occurred because the root route was hit (possibly due to missing `STRIPE_SECRET_KEY` in Vercel if root was ever deployed).
- **Secondary:** Config and env mismatches that could cause build failures or silent failures.

## 5. Fixes Applied

| Fix | File(s) |
|-----|---------|
| Set Vercel root directory | `vercel.json` |
| Remove dual next.config | Deleted `next.config.mjs`, merged into `next.config.ts` |
| Add `cost?: number` to ProductSize | `gemini/tsuyanouchi/lib/supabase-helpers.ts` |
| Fix Gemini env var | `gemini/tsuyanouchi/services/gemini.ts` |
| Add preview/admin bypass to middleware | `gemini/tsuyanouchi/middleware.ts` |
| Add `preview_access` cookie check | `gemini/tsuyanouchi/middleware.ts` |
| Add Stripe error logging | `gemini/tsuyanouchi/app/api/payments/create-intent/route.ts` |
| Add order creation logging | `gemini/tsuyanouchi/app/api/orders/route.ts` |
| Remove deprecated eslint config | `gemini/tsuyanouchi/next.config.ts` |
| Add PREVIEW_PASSWORD to ENV_TEMPLATE | `gemini/tsuyanouchi/ENV_TEMPLATE.md` |

## 6. Remaining Risks

1. **Order creation fire-and-forget** — If `POST /api/orders` fails after payment, the order record may be missing. The webhook can update status but cannot create the order. Consider creating the order before payment confirmation.
2. **Stripe webhook** — Ensure `STRIPE_WEBHOOK_SECRET` in Vercel matches the signing secret from the Stripe Dashboard webhook endpoint. Register events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`.
3. **Root-level app** — The `/app`, `/lib`, `/components` at repo root are legacy and can cause confusion. Consider removing or moving to `old-root-backup/` once gemini is confirmed stable.

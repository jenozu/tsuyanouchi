# Deployment Checklist — gemini/tsuyanouchi

## Before Deploy

### 1. Correct Root Directory

- [ ] Vercel project Root Directory is set to **`gemini/tsuyanouchi`**
- [ ] Or `vercel.json` at repo root contains `"rootDirectory": "gemini/tsuyanouchi"`

### 2. Environment Variables (Vercel)

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `STRIPE_SECRET_KEY` (use live key for production, test key for preview)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET` (must match Stripe Dashboard webhook signing secret)
- [ ] `ADMIN_PASSWORD`
- [ ] `PREVIEW_PASSWORD` (for owner access on under-construction page)
- [ ] `RESEND_API_KEY`
- [ ] `ORDER_NOTIFICATION_EMAIL`
- [ ] `RESEND_FROM_EMAIL`
- [ ] `GEMINI_API_KEY` (optional, for AI product descriptions)
- [ ] `NEXT_PUBLIC_UNDER_CONSTRUCTION` (set to `true` for under-construction mode)

### 3. Build Command

- [ ] `npm run build` (default)
- [ ] Build completes successfully from `gemini/tsuyanouchi` directory

### 4. Route Sanity Checks

After deploy, verify:

- [ ] `GET /api/products` → returns product list
- [ ] `GET /api/shipping/rate?country=US&quantity=1` → returns `{ price: number }`
- [ ] `POST /api/payments/create-intent` with valid body → returns `{ clientSecret, paymentIntentId }`
- [ ] `POST /api/orders` with valid order payload → returns 201 with order object

### 5. Stripe Test Mode Validation

- [ ] Stripe Dashboard → Developers → API keys: test mode keys used for preview deployments
- [ ] Webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
- [ ] Webhook events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`
- [ ] `STRIPE_WEBHOOK_SECRET` in Vercel matches the webhook signing secret from Stripe Dashboard

### 6. Post-Deploy

- [ ] Redeploy triggered after any root directory or env var change
- [ ] Test full checkout flow on production URL (add item → checkout → pay with test card)

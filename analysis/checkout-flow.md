# Checkout Flow (gemini/tsuyanouchi)

## Flow Overview

```
Cart (/cart or CartDrawer)
  └── "Proceed to Checkout" → /checkout

Checkout Page (/checkout) — Two Steps:

  Step 1: Shipping Form
    ├── react-hook-form + zod validation
    ├── GET /api/shipping/rate?country=XX&quantity=N → lib/shipping.ts
    ├── computeTaxAmount() via lib/tax.ts
    └── "Continue to Payment" button

  Step 2: Stripe Payment
    ├── POST /api/payments/create-intent
    │     body: { amount, currency, metadata: { orderId, email } }
    │     → lib/stripe.ts createPaymentIntent()
    │     ← { clientSecret, paymentIntentId }
    ├── Stripe Elements rendered with clientSecret
    ├── elements.submit() → stripe.confirmPayment()
    ├── POST /api/orders (fire-and-forget order creation)
    └── router.push(/thank-you?orderId=X)

Webhook: POST /api/webhooks/stripe
  ├── payment_intent.succeeded → updateOrderStatus('processing', 'paid') + emails
  ├── payment_intent.payment_failed → updateOrderStatus('failed', 'failed')
  └── payment_intent.canceled → updateOrderStatus('canceled', 'canceled')

Success: /thank-you?orderId=X (clears cart)
```

## File-by-File Trace

### 1. Cart State — `lib/cart-context.tsx`
- CartProvider wraps the app in `app/layout.tsx`
- Exposes: `cartItems`, `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `getCartTotal`, `getCartCount`
- Persisted in `localStorage` under key `tsuyanouchi_cart`

### 2. Checkout Page — `app/checkout/page.tsx`
- Client component (`'use client'`)
- Uses `useCart()` for cart items and totals
- Step 1: Shipping form with zod schema validation
- Step 2: Stripe Elements payment form

### 3. "Continue to Payment" Handler — `onContinueToPayment()`
- Generates orderId: `ORD-{timestamp}-{random}`
- Sends `POST /api/payments/create-intent` with `{ amount: total, metadata: { orderId, email } }`
- On success: sets `clientSecret`, `orderId`, `pendingOrderData`, switches to payment step

### 4. Frontend Request — `fetch('/api/payments/create-intent', ...)`
**Request payload:**
```json
{
  "amount": 150.00,
  "currency": "usd",
  "metadata": {
    "orderId": "ORD-1710720000000-ABC123DEF",
    "email": "customer@example.com"
  }
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### 5. API Route — `app/api/payments/create-intent/route.ts`
- Validates amount > 0
- Calls `createPaymentIntent(amount, currency, metadata)` from `lib/stripe.ts`
- `createPaymentIntent()` converts dollars to cents: `Math.round(amount * 100)`
- Returns `{ clientSecret, paymentIntentId }`

### 6. Stripe Payment — `StripePaymentForm` component
- Wrapped in `<Elements>` provider with `clientSecret`
- Uses `PaymentElement` for the payment UI
- On "Place Order": `elements.submit()` → `stripe.confirmPayment()` with `redirect: 'if_required'`
- On success: fire-and-forget `POST /api/orders`, then `clearCart()` + redirect

### 7. Order Creation — `app/api/orders/route.ts`
**Request payload:**
```json
{
  "order_id": "ORD-xxx",
  "email": "customer@example.com",
  "items": [{ "productId": "...", "productName": "...", "quantity": 1, "price": 50 }],
  "subtotal": 50.00,
  "taxes": 4.00,
  "shipping": 10.00,
  "total": 64.00,
  "status": "pending",
  "payment_status": "pending",
  "payment_intent_id": "pi_xxx",
  "shipping_address": { "firstName": "...", ... }
}
```

### 8. Webhook — `app/api/webhooks/stripe/route.ts`
- Verifies signature with `STRIPE_WEBHOOK_SECRET`
- `payment_intent.succeeded`: updates order to `processing`/`paid`, sends confirmation + admin emails
- `payment_intent.payment_failed`: updates order to `failed`
- `payment_intent.canceled`: updates order to `canceled`

### 9. Success Page — `app/thank-you/page.tsx`
- Reads `orderId` from URL query param
- Clears cart when orderId is present
- Shows order confirmation message

## Dependencies

| Package | Role |
|---------|------|
| `stripe` | Server-side Stripe API client |
| `@stripe/stripe-js` | Client-side `loadStripe()` |
| `@stripe/react-stripe-js` | `Elements`, `PaymentElement`, `useStripe`, `useElements` |
| `react-hook-form` | Form state management |
| `zod` | Schema validation |
| `@supabase/supabase-js` | Database (orders, products) |
| `resend` | Transactional emails |

## Potential Breakpoints

1. `STRIPE_SECRET_KEY` missing → `getStripeClient()` throws immediately
2. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` missing → `loadStripe()` returns null, Elements won't render
3. `STRIPE_WEBHOOK_SECRET` missing → webhook signature verification fails
4. Supabase down → order creation fails silently (fire-and-forget)
5. Amount = 0 or negative → create-intent returns 400
6. Network error on `/api/orders` → payment taken but no order record (webhook can recover)

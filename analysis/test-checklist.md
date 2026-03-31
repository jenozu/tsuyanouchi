# Test Checklist — Checkout Flow

## Prerequisites

- [ ] `cd gemini/tsuyanouchi`
- [ ] `.env.local` exists with: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `PREVIEW_PASSWORD`, `ADMIN_PASSWORD`
- [ ] `npm install` completed
- [ ] `npm run dev` running on port 3000

## 1. Add to Cart

- [ ] Go to `/under-construction`, enter `PREVIEW_PASSWORD`, click "Enter site"
- [ ] Navigate to `/shop`
- [ ] Click a product card to add to cart (or use "Add to Cart" if size selection is required)
- [ ] Cart badge in navbar increments

## 2. Go to Checkout

- [ ] Open cart drawer or go to `/cart`
- [ ] Click "Proceed to Checkout" or "Checkout"
- [ ] Verify `/checkout` page loads with shipping form

## 3. Trigger Payment

- [ ] Fill shipping form fields (first name, last name, email, address, city, state, postal code, country)
- [ ] Wait for shipping cost to load (country dropdown triggers `GET /api/shipping/rate`)
- [ ] Click "Continue to Payment"
- [ ] Verify `POST /api/payments/create-intent` returns 200 in Network tab
- [ ] Stripe Elements payment form appears

## 4. Stripe Redirect / Payment

- [ ] Enter Stripe test card: `4242 4242 4242 4242`
- [ ] Expiry: any future date (e.g. 12/34)
- [ ] CVC: any 3 digits (e.g. 123)
- [ ] Click "Place Order"
- [ ] No error in console (payment confirms with `redirect: 'if_required'`)

## 5. Complete Payment (Test Mode)

- [ ] Payment completes without redirect
- [ ] `POST /api/orders` appears in Network tab (may be fire-and-forget)

## 6. Verify Success Page

- [ ] Redirected to `/thank-you?orderId=ORD-...`
- [ ] Order number displayed
- [ ] Cart is cleared

## 7. Verify Order Creation

- [ ] Check Supabase `orders` table: row exists with `order_id` matching URL
- [ ] `payment_status` is `pending` initially (before webhook)

## 8. Verify Webhook (Optional — Local)

- [ ] Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] After payment, `payment_intent.succeeded` event appears in Stripe CLI output
- [ ] Order in Supabase updates to `status: 'processing'`, `payment_status: 'paid'`
- [ ] Email notifications sent (if Resend configured)

## API-Only Quick Test (No Browser)

```powershell
# 1. Shipping rate
Invoke-RestMethod -Uri "http://localhost:3000/api/shipping/rate?country=US&quantity=1" -Method GET

# 2. Create payment intent
$body = '{"amount": 50, "currency": "usd", "metadata": {"orderId": "ORD-TEST-123", "email": "test@example.com"}}'
Invoke-RestMethod -Uri "http://localhost:3000/api/payments/create-intent" -Method POST -Body $body -ContentType "application/json"

# 3. Create order (use paymentIntentId from step 2)
$orderBody = '{"order_id":"ORD-TEST-123","email":"test@example.com","items":[{"productId":"p1","productName":"Test","quantity":1,"price":50}],"subtotal":50,"taxes":5,"shipping":0,"total":55,"status":"pending","payment_status":"pending","payment_intent_id":"pi_xxx","shipping_address":{"firstName":"Test","lastName":"User","address":"123 Main","city":"Austin","state":"TX","postalCode":"78701","country":"US"}}'
Invoke-RestMethod -Uri "http://localhost:3000/api/orders" -Method POST -Body $orderBody -ContentType "application/json"
```

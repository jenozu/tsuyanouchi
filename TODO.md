# 📋 YOUR TO-DO CHECKLIST

All code implementation is **COMPLETE**! Here's what YOU need to do to get it running:

---

## ✅ STEP 1: Install Dependencies (5 minutes)

Open your terminal and run:

```bash
npm install
```

This installs all the new packages (Supabase, Stripe, Resend, etc.)

---

## ✅ STEP 2: Set Up Supabase (15-20 minutes)

### 2.1 Create Supabase Project
1. Go to https://supabase.com
2. Click "New Project"
3. Choose organization and create project (wait ~2 minutes for setup)

### 2.2 Get API Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### 2.3 Run SQL Migrations
1. Go to **SQL Editor** in Supabase dashboard
2. Click "New query"
3. Open `supabase-setup.sql` in your project root
4. Copy ALL the contents and paste into the SQL Editor
5. Click "Run" - this creates all tables, indexes, RLS policies, and default shipping rates in one go!

### 2.4 Create Storage Bucket
1. Go to **Storage** in Supabase dashboard
2. Click "New bucket"
3. Name it: `product-images`
4. Make it **Public**
5. Click "Create bucket"
6. (Optional) Configure CORS if needed for direct uploads

**✅ NOTE**: Your SQL setup is complete! The `supabase-setup.sql` file created all tables, indexes, RLS policies, and default shipping rates.

---

## ✅ STEP 3: Get Stripe API Keys (10 minutes)

### 3.1 Create Stripe Account
1. Go to https://stripe.com
2. Sign up or log in

### 3.2 Get Test API Keys
1. Go to **Developers** → **API keys**
2. Make sure you're in **Test mode** (toggle at top)
3. Copy these keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 3.3 Set Up Webhook (for local development)
Install Stripe CLI:
```bash
# Windows (with Scoop)
scoop install stripe

# Mac (with Homebrew)
brew install stripe/stripe-cli/stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

Then run:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook secret that appears (starts with `whsec_`)

---

## ✅ STEP 4: Get Resend API Key (5 minutes)

1. Go to https://resend.com
2. Sign up or log in
3. Go to **API Keys**
4. Click "Create API Key"
5. Copy the key (starts with `re_`)

---

## ✅ STEP 5: Create .env.local File (5 minutes)

Create a file called `.env.local` in your project root and paste this:

```env
# Supabase (from Step 2)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key

# Stripe (from Step 3)
STRIPE_SECRET_KEY=sk_test_your-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Admin Password (make up a strong password)
ADMIN_PASSWORD=YourSecurePassword123!

# Resend (from Step 4)
RESEND_API_KEY=re_your-resend-key
RESEND_FROM_EMAIL=TSUYA NO UCHI <orders@yourdomain.com>
ORDER_NOTIFICATION_EMAIL=your-email@example.com

# OpenAI (optional - only if you want AI descriptions)
# OPENAI_API_KEY=sk-your-openai-key
```

**Replace all the placeholder values with your actual keys!**

---

## ✅ STEP 6: Migrate Existing Data (OPTIONAL - only if you have products)

If you have existing products in Vercel KV that you want to keep:

```bash
npx tsx scripts/migrate-to-supabase.ts
```

Skip this if you're starting fresh!

---

## ✅ STEP 7: Start Development Server (1 minute)

```bash
npm run dev
```

Open http://localhost:3000

---

## ✅ STEP 8: Test Everything (15 minutes)

### Test Shopping Flow
- [ ] Browse products at http://localhost:3000
- [ ] Add items to cart
- [ ] Check cart page at http://localhost:3000/cart
- [ ] Add items to favorites
- [ ] Check favorites at http://localhost:3000/favourites
- [ ] Go to checkout at http://localhost:3000/checkout
- [ ] Fill out checkout form
- [ ] Submit order (it will create order in Supabase)

### Test Admin
- [ ] Go to http://localhost:3000/admin (should redirect to login)
- [ ] Go to http://localhost:3000/admin/login
- [ ] Enter your ADMIN_PASSWORD
- [ ] Should see admin dashboard
- [ ] Try creating a product
- [ ] Try uploading an image
- [ ] Check it uploads to Supabase Storage

### Check Supabase
- [ ] Open Supabase dashboard
- [ ] Go to **Table Editor** → **products**
- [ ] Should see your products
- [ ] Go to **Table Editor** → **orders**
- [ ] Should see test orders
- [ ] Go to **Storage** → **product-images**
- [ ] Should see uploaded images

---

## 🎉 THAT'S IT! YOU'RE DONE!

---

## 🐛 Troubleshooting

**"NEXT_PUBLIC_SUPABASE_URL is not set"**
→ Make sure `.env.local` exists and has the correct values
→ Restart your dev server after creating `.env.local`

**"Failed to fetch products"**
→ Check that SQL migrations ran successfully in Supabase
→ Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

**"Invalid admin password"**
→ Check that `ADMIN_PASSWORD` in `.env.local` matches what you're typing

**Stripe webhook not working**
→ Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
→ Copy the webhook secret it shows

**Images not uploading**
→ Check that `product-images` bucket exists in Supabase Storage
→ Make sure it's set to **Public**

---

## 📚 Need More Help?

Check these files:
- `INTEGRATION_COMPLETE.md` - Full overview of what was built
- `IMPLEMENTATION_SUMMARY.md` - Quick reference
- `ENV_TEMPLATE.md` - Environment variable guide
- `docs/koji_tsuya_integration_plan.md` - Full technical details

---

## 🚀 Ready for Production?

When you're ready to deploy:
1. Create production Supabase project
2. Get **live** Stripe keys (not test keys)
3. Set up Stripe webhook in Stripe Dashboard (not CLI)
4. Set all environment variables in Vercel
5. Deploy!

See `IMPLEMENTATION_SUMMARY.md` for deployment details.

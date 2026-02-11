# 🚀 Deployment Instructions

## What You Need to Do

Your code has been updated to use **Vercel KV** for persistent product storage.

---

## Quick Setup (5 Minutes)

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Switch to Vercel KV for persistent product storage"
git push origin main
```

### 2. Set Up Vercel KV

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Storage" tab
3. Click "Create Database"
4. Select "KV" (Redis)
5. Name: `tsuyanouchi-products`
6. Click "Create"
7. Click "Connect Project" → Select `tsuyanouchi`
8. Click "Connect"

### 3. Redeploy

Vercel will auto-deploy after connecting KV, or manually trigger:
- Go to Deployments → Latest → Three dots → "Redeploy"

### 4. Add Products

1. Visit: `https://v0-tsuya.vercel.app/admin`
2. Click "Products" → "Add Product"
3. Fill in details and save
4. **It will work this time!** ✅

---

## Why This Change?

**Problem:** File storage (`/data/products.json`) doesn't work on Vercel's serverless platform.

**Solution:** Vercel KV (Redis) - persistent cloud storage.

**Benefits:**
- ✅ Products save permanently
- ✅ Fast access worldwide
- ✅ Free tier (30k requests/month)
- ✅ Zero configuration needed

---

## Environment Variables Needed

Vercel automatically adds these when you connect KV:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_URL`

**You don't need to do anything!** Vercel handles it.

---

## Optional: OpenAI API Key

To enable AI product descriptions:

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add:
   ```
   OPENAI_API_KEY = your_openai_key_here
   ```
4. Redeploy

Get your key: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

---

## Commit Message

```bash
git commit -m "Switch to Vercel KV for persistent product storage

- Replace filesystem storage with Vercel KV (Redis)
- Update all API routes to use async KV operations
- Add VERCEL_KV_SETUP.md with setup instructions
- Products now persist permanently on Vercel
"
```

---

## After Deploy

Test the admin:
1. Go to `/admin`
2. Add a product
3. Check it appears in the Products list
4. Go to `/shop` - see your product!

---

## Need Help?

See `VERCEL_KV_SETUP.md` for detailed troubleshooting.


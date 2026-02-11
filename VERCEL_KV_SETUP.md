# Vercel KV Setup Guide

## Why Vercel KV?

Your products weren't saving because Vercel serverless functions have **read-only filesystems**. We've switched to **Vercel KV (Redis)** for persistent storage.

---

## Setup (5 minutes)

### Step 1: Create Vercel KV Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on the "Storage" tab at the top
3. Click "Create Database"
4. Select "KV"
5. Name it: `tsuyanouchi-products`
6. Choose region closest to you
7. Click "Create"

### Step 2: Connect to Your Project

1. After creating the database, click "Connect Project"
2. Select your `tsuyanouchi` project
3. Click "Connect"
4. Vercel automatically adds the environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
   - `KV_URL`

### Step 3: Redeploy

Your project will auto-redeploy, or you can manually trigger a redeploy:

1. Go to your project
2. Click "Deployments"
3. Click the three dots on latest deployment
4. Click "Redeploy"

---

## Testing

After deployment:

1. Go to `/admin`
2. Click "Add Product"
3. Fill in product details
4. Click "Create Product"
5. Product should appear immediately!
6. Go to `/shop` - product appears there too

---

## What Changed

### Before (Didn't Work)
```
Products saved to /data/products.json
❌ Lost when serverless function spins down
```

### After (Works!)
```
Products saved to Vercel KV (Redis)
✅ Persists permanently
✅ Fast access worldwide
✅ Free tier: 30k requests/month
```

---

## Free Tier Limits

- **Storage:** 256 MB
- **Requests:** 30,000/month
- **Bandwidth:** 100 MB/month

**For your use case:** More than enough! You could store thousands of products.

---

## Local Development

For local testing, add to your `.env.local`:

```bash
KV_REST_API_URL=your_url_here
KV_REST_API_TOKEN=your_token_here
KV_REST_API_READ_ONLY_TOKEN=your_readonly_token_here
KV_URL=your_kv_url_here
```

Get these values from:
1. Vercel Dashboard → Storage → Your KV database
2. Click ".env.local" tab
3. Copy all values

---

## Viewing Your Data

### In Vercel Dashboard:
1. Go to Storage → Your KV database
2. Click "Data Browser"
3. See all your products in real-time

### Via CLI:
```bash
vercel env pull .env.local
npm run dev
```

---

## Troubleshooting

### "Products still not saving"
- Check Vercel Dashboard → Storage
- Verify KV database is connected to your project
- Check environment variables are set
- Redeploy the project

### "Module not found: @vercel/kv"
- Run: `npm install @vercel/kv --legacy-peer-deps`
- Commit and push

### "KV_REST_API_URL is not defined"
- KV database not connected to project
- Go to Storage → Your database → Connect Project

---

## What Data is Stored

All product data:
- Product details (name, price, description)
- Categories
- Images (URLs to `/uploads/`)
- Stock levels
- Product sizes
- Timestamps

**Note:** Images are still stored in `/public/uploads/` (uploaded via API)

---

## Migration from JSON Files

Your existing products (if any) need to be manually added via the admin:

1. Go to `/admin`
2. Add each product manually
3. Or use CSV import (coming soon)

---

## Cost Estimate

**Typical usage:**
- 100 products = ~20 KB
- 10,000 page views/month = ~10,000 reads
- 50 product updates/month = 50 writes

**Monthly cost:** $0 (well within free tier)

---

## Next Steps

1. ✅ Set up Vercel KV
2. ✅ Redeploy
3. ✅ Add your first product
4. ✅ Verify it appears on `/shop`
5. 🎉 Done!

Your admin dashboard now works perfectly!


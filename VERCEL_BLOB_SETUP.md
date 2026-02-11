# 🗄️ Vercel Blob Storage Setup Guide

## Overview

This guide will help you set up Vercel Blob storage for image uploads in your TSUYA NO UCHI e-commerce site.

---

## ✅ Prerequisites

- [x] Vercel account with project deployed
- [x] Vercel CLI installed (`npm i -g vercel`)
- [x] `@vercel/blob` package installed (already done ✓)

---

## 📝 Step-by-Step Setup

### **Step 1: Create Vercel Blob Storage**

1. **Go to Vercel Dashboard**:
   - Navigate to https://vercel.com/dashboard
   - Select your project: **TSUYA NO UCHI**

2. **Create Blob Store**:
   - Click on the **"Storage"** tab
   - Click **"Create Database"** or **"Create Store"**
   - Select **"Blob"** from the options
   - Click **"Continue"**

3. **Configure Blob Store**:
   - **Name**: `tsuya-no-uchi-images` (or any name you prefer)
   - Click **"Create"**

4. **Connect to Your Project**:
   - In the connection dialog, select your project from the list
   - Click **"Connect"**
   - ✅ Vercel will automatically add `BLOB_READ_WRITE_TOKEN` to your environment variables

---

### **Step 2: Pull Environment Variables Locally**

To use Vercel Blob in development, you need to pull the environment variables:

```bash
# Login to Vercel CLI (if not already logged in)
vercel login

# Link your project (if not already linked)
vercel link

# Pull environment variables to .env.local
vercel env pull .env.local
```

After running this, check your `.env.local` file - you should see:
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

---

### **Step 3: Verify the Setup**

Run the test script to verify Vercel Blob is working:

```bash
# If using ts-node
npx ts-node scripts/test-blob-connection.ts

# Or create a simpler JS version
node scripts/test-blob-connection.js
```

You should see:
```
✅ BLOB_READ_WRITE_TOKEN is set
✅ Test file uploaded successfully!
🎉 All tests passed!
```

---

### **Step 4: Restart Your Development Server**

After pulling environment variables, restart your Next.js dev server:

```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

---

### **Step 5: Test Image Upload in Admin Dashboard**

1. Navigate to http://localhost:3000/admin
2. Click **"Add Product"**
3. Fill in product details
4. Click **"Upload"** button to upload an image
5. ✅ The image should upload to Vercel Blob and return a URL like:
   ```
   https://your-blob-store.public.blob.vercel-storage.com/products/...
   ```

---

## 🔍 How It Works

### **Before (Local Filesystem)**
```
Upload → Save to /public/uploads/ → Return /uploads/filename.jpg
```
❌ **Problem**: Files don't persist in Vercel (serverless environment)

### **After (Vercel Blob)**
```
Upload → Save to Vercel Blob → Return https://blob-url.com/filename.jpg
```
✅ **Benefits**:
- Persistent storage
- Global CDN
- Automatic optimization
- No server filesystem needed

---

## 📁 What Was Changed

### **1. Upload API Route** (`app/api/upload/route.ts`)

**Before**:
```typescript
import { writeFile, mkdir } from 'fs/promises'
// ... saves to local filesystem
```

**After**:
```typescript
import { put } from '@vercel/blob'
// ... uploads to Vercel Blob
```

### **2. Workflow**

1. User uploads image in `/admin`
2. Image sent to `/api/upload`
3. `/api/upload` uses `put()` to save to Vercel Blob
4. Returns Blob URL (e.g., `https://xxx.blob.vercel-storage.com/...`)
5. Product data with Blob URL saved to Vercel KV
6. Image displayed from Blob URL

---

## 🔐 Environment Variables

### **Required**

| Variable | Source | Purpose |
|----------|--------|---------|
| `BLOB_READ_WRITE_TOKEN` | Vercel (auto) | Access token for Vercel Blob |
| `KV_REST_API_URL` | Vercel (auto) | Vercel KV endpoint |
| `KV_REST_API_TOKEN` | Vercel (auto) | Vercel KV access token |

### **How to Get Them**

```bash
# Pull all environment variables
vercel env pull .env.local
```

---

## 🧪 Testing Checklist

- [ ] Created Blob store in Vercel Dashboard
- [ ] Connected Blob store to project
- [ ] Pulled environment variables locally (`vercel env pull`)
- [ ] Restarted dev server
- [ ] Tested upload in `/admin`
- [ ] Confirmed image URL is from Vercel Blob (`.blob.vercel-storage.com`)
- [ ] Confirmed product with image saves to KV
- [ ] Deployed to Vercel
- [ ] Tested upload in production

---

## 🚀 Deployment

When you're ready to deploy:

```bash
# Commit changes
git add .
git commit -m "feat: Switch to Vercel Blob storage for images"

# Push to trigger deployment
git push

# Or deploy manually
vercel --prod
```

**Note**: Environment variables are already set in production (Vercel Dashboard), so uploads will work immediately!

---

## 🐛 Troubleshooting

### **Error: "BLOB_READ_WRITE_TOKEN is not set"**

**Solution**:
1. Make sure you created the Blob store in Vercel Dashboard
2. Make sure it's connected to your project
3. Run `vercel env pull .env.local`
4. Restart dev server

### **Error: "Failed to upload file"**

**Check**:
1. Is `BLOB_READ_WRITE_TOKEN` in `.env.local`?
2. Is `@vercel/blob` installed? (`npm list @vercel/blob`)
3. Is dev server restarted after pulling env vars?

### **Image uploads work locally but not in production**

**Check**:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Confirm `BLOB_READ_WRITE_TOKEN` exists
3. If not, reconnect Blob store to project in Storage tab

---

## 📊 Storage Limits

| Plan | Storage | Bandwidth |
|------|---------|-----------|
| **Hobby (Free)** | 5 GB | 100 GB/month |
| **Pro** | 100 GB | 1 TB/month |

Check your usage: Vercel Dashboard → Storage → Usage

---

## 🔗 Useful Links

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Blob SDK Reference](https://vercel.com/docs/storage/vercel-blob/using-blob-sdk)
- [Your Vercel Dashboard](https://vercel.com/dashboard)

---

## ✨ Next Steps

After Blob is working:

1. **Optional**: Set up image optimization
   ```typescript
   const blob = await put(filename, file, {
     access: 'public',
     contentType: file.type,
     cacheControlMaxAge: 31536000, // 1 year
   })
   ```

2. **Optional**: Add delete functionality
   ```typescript
   import { del } from '@vercel/blob'
   await del(imageUrl)
   ```

3. **Optional**: Add image resize/optimization using Sharp or similar

---

**Questions?** Check the troubleshooting section or contact support.

**Ready?** Let's test it! 🚀



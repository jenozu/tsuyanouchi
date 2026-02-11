# 🎯 Quick Start: Vercel Blob Setup

## 🚀 You're Almost There!

Your code is **already updated** to use Vercel Blob! Now you just need to create the storage in your Vercel Dashboard.

---

## 📋 Your Current Status

✅ **DONE:**
- ✓ `@vercel/blob` package installed
- ✓ Upload API route updated to use Blob storage
- ✓ Admin interface ready to upload images
- ✓ Vercel KV (Redis) connected

⏳ **TO DO:**
- Create Vercel Blob storage (5 minutes)
- Pull environment variables locally
- Test uploads

---

## 🎬 STEP 1: Create Blob Storage (Do This First!)

### Option A: Via Vercel Dashboard (Recommended)

1. **Open**: https://vercel.com/dashboard
2. **Click**: Your project name
3. **Click**: "Storage" tab (top navigation)
4. **Click**: "Create Database" or "Create Store"
5. **Select**: "Blob"
6. **Click**: "Continue"
7. **Name it**: `tsuya-images` (or anything you like)
8. **Click**: "Create"
9. **Select**: Your project from the dropdown
10. **Click**: "Connect"

✅ **Done!** The `BLOB_READ_WRITE_TOKEN` is now in your project's environment variables.

### Option B: Via Vercel CLI (Alternative)

```bash
vercel link  # Link to your project if not already
vercel storage create blob tsuya-images
```

---

## 🎬 STEP 2: Pull Environment Variables Locally

To use Blob storage in development, pull the token:

```bash
# Make sure Vercel CLI is installed
npm i -g vercel

# Pull environment variables
vercel env pull .env.local
```

You should see output like:
```
✅ Downloaded environment variables to .env.local
```

---

## 🎬 STEP 3: Verify the Token

Check your `.env.local` file:

```bash
cat .env.local
```

You should see:
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXX
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

---

## 🎬 STEP 4: Test the Connection

Run the test script:

```bash
node scripts/test-blob.js
```

Expected output:
```
🔍 Testing Vercel Blob Connection...

✅ BLOB_READ_WRITE_TOKEN is set
📋 Test 1: Listing existing blobs...
✅ Found 0 existing blob(s)
📤 Test 2: Uploading a test file...
✅ Test file uploaded successfully!

🎉 SUCCESS! Vercel Blob is working correctly.
```

---

## 🎬 STEP 5: Restart Dev Server & Test Upload

1. **Stop** your current dev server (Ctrl+C if running)

2. **Start** it again:
   ```bash
   npm run dev
   ```

3. **Open**: http://localhost:3000/admin

4. **Click**: "Add Product"

5. **Fill** in product details

6. **Click**: "Upload" button and select an image

7. **Watch**: The image should upload successfully! ✨

8. **Check** the URL - it should look like:
   ```
   https://abc123xyz.public.blob.vercel-storage.com/products/1234567890_image.jpg
   ```

---

## 🎉 Success Criteria

You'll know it's working when:

- ✅ Image upload shows "Upload successful" (not an error)
- ✅ Image URL starts with `https://` and contains `.blob.vercel-storage.com`
- ✅ Image preview appears below the upload button
- ✅ Product saves with the Blob URL
- ✅ Image displays on the product page

---

## 🐛 Troubleshooting

### "BLOB_READ_WRITE_TOKEN is not set"

**Fix**:
```bash
vercel env pull .env.local
```
Then restart dev server.

### "Failed to upload file"

**Check**:
1. Is `.env.local` present?
2. Run: `cat .env.local | grep BLOB`
3. Does it show a token?
4. Did you restart dev server after pulling env vars?

### "No such store exists"

**Fix**: Make sure you **created** the Blob store in Vercel Dashboard (Step 1).

### Test script fails

**Fix**:
```bash
npm install @vercel/blob
vercel env pull .env.local
node scripts/test-blob.js
```

---

## 🚢 Deployment

After testing locally:

```bash
git add .
git commit -m "Add Vercel Blob storage for images"
git push
```

Vercel will auto-deploy. **No additional config needed!** The `BLOB_READ_WRITE_TOKEN` is already in production.

---

## 📊 What Happens Now?

### Before (Local Storage)
```
[User] → Upload Image → [Server Saves to /public/uploads/]
❌ Problem: Files lost on redeploy (Vercel is serverless)
```

### After (Vercel Blob)
```
[User] → Upload Image → [Vercel Blob] → Returns CDN URL
✅ Images persist forever
✅ Global CDN (fast worldwide)
✅ Automatic optimization
```

### Data Flow
```
1. User uploads image in /admin
2. Frontend sends to /api/upload
3. API uploads to Vercel Blob
4. Blob returns URL: https://xyz.blob.vercel-storage.com/...
5. URL saved to Vercel KV (with product data)
6. Image displayed from Blob URL
```

---

## 🎓 Summary

| What | Why | Status |
|------|-----|--------|
| Vercel Blob | Store images persistently | ✅ Code ready |
| BLOB_READ_WRITE_TOKEN | Authentication | ⏳ Need to pull |
| Vercel KV | Store product data | ✅ Already working |
| `/api/upload` | Upload endpoint | ✅ Updated |

---

## 📞 Next Steps

1. **Now**: Go create the Blob storage in Vercel Dashboard → Storage
2. **Then**: Run `vercel env pull .env.local`
3. **Finally**: Test upload in `/admin`

**You're 5 minutes away from working image uploads!** 🚀

---

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard) - Create Blob storage here
- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Your Admin Dashboard](http://localhost:3000/admin) - Test uploads here

---

**Questions?** 
- See `VERCEL_BLOB_SETUP.md` for detailed documentation
- Run `node scripts/test-blob.js` to diagnose issues

# ✅ Vercel Blob Setup Checklist

## 📋 Pre-Flight Check

- [x] `@vercel/blob` package installed in package.json
- [x] Upload API route updated to use Vercel Blob
- [x] Admin interface ready for uploads
- [x] Vercel KV already connected and working
- [x] Test scripts created
- [x] Documentation written

**Status**: ✅ All code changes complete!

---

## 🎯 Your Action Items

### 1️⃣ Create Blob Storage (5 min)

- [ ] Go to https://vercel.com/dashboard
- [ ] Select your project: **TSUYA NO UCHI**
- [ ] Click **Storage** tab
- [ ] Click **Create Database** → **Blob**
- [ ] Name: `tsuya-images` (or any name)
- [ ] Click **Create**
- [ ] Select your project to connect
- [ ] Click **Connect**
- [ ] ✅ Confirm you see "Store Connected Successfully"

📖 **Help**: See `DASHBOARD_GUIDE.txt` for visual walkthrough

---

### 2️⃣ Pull Environment Variables (1 min)

```bash
# In your project directory
vercel env pull .env.local
```

- [ ] Command executed successfully
- [ ] `.env.local` file created/updated
- [ ] Check file contains: `BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...`

**Verify**:
```bash
cat .env.local | grep BLOB
```

Should show: `BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXX`

---

### 3️⃣ Test Connection (1 min)

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

- [ ] Test script runs without errors
- [ ] See "SUCCESS!" message
- [ ] Test file uploaded

**If fails**: See Troubleshooting section below

---

### 4️⃣ Restart Dev Server (1 min)

```bash
# Stop current server (Ctrl+C if running)
npm run dev
```

- [ ] Server stopped
- [ ] Server restarted
- [ ] No errors in console
- [ ] Can access http://localhost:3000

---

### 5️⃣ Test Image Upload (2 min)

1. Navigate to: http://localhost:3000/admin
2. Click: **Settings** tab
3. Verify: "Vercel Blob Storage" shows `✓ Connected` (green)
4. Click: **Products** tab
5. Click: **Add Product** button
6. Fill in:
   - Name: `Test Product`
   - Category: `Test`
   - Price: `100`
7. Click: **Upload** button
8. Select: Any image file
9. Wait for upload...

**Checklist**:
- [ ] Upload button works
- [ ] No error messages
- [ ] Image preview appears
- [ ] Image URL is displayed
- [ ] URL starts with `https://` and contains `.blob.vercel-storage.com`

**Example URL**:
```
https://abc123xyz.public.blob.vercel-storage.com/products/1733251234567_test.jpg
```

---

### 6️⃣ Verify Product Saved (1 min)

1. Click: **Create Product** button
2. Should see success message
3. Product should appear in products list
4. Image should display correctly

**Checklist**:
- [ ] Product created successfully
- [ ] Image displays in product list
- [ ] Image displays on product page (frontend)
- [ ] Image loads from Blob URL

---

### 7️⃣ Deploy to Production (5 min)

```bash
# Commit changes
git add .
git commit -m "feat: Add Vercel Blob storage for image uploads"

# Push to trigger deployment
git push
```

**Checklist**:
- [ ] Changes committed
- [ ] Pushed to GitHub/GitLab
- [ ] Vercel deployment triggered
- [ ] Deployment successful
- [ ] Test upload in production: https://your-site.vercel.app/admin

**Note**: No additional config needed! `BLOB_READ_WRITE_TOKEN` is already in production.

---

## 🎉 Final Verification

### All Systems Check:

- [ ] Local dev environment working
- [ ] Test script passes
- [ ] Can upload images in `/admin` (local)
- [ ] Images display correctly (local)
- [ ] Settings page shows "Connected" status
- [ ] Deployed to Vercel
- [ ] Can upload images in `/admin` (production)
- [ ] Images display correctly (production)

### Data Flow Check:

- [ ] Upload image → Returns Blob URL
- [ ] Create product → Saves with Blob URL to KV
- [ ] View product → Image loads from Blob URL
- [ ] Image accessible via CDN URL

---

## 🐛 Troubleshooting

### ❌ "BLOB_READ_WRITE_TOKEN is not set"

**Fix**:
```bash
vercel env pull .env.local
cat .env.local  # Verify token exists
```

### ❌ Test script fails

**Fix**:
```bash
npm install @vercel/blob
vercel env pull .env.local
node scripts/test-blob.js
```

### ❌ "Failed to upload file" in admin

**Check**:
1. Did you restart dev server after pulling env vars?
2. Does `.env.local` have `BLOB_READ_WRITE_TOKEN`?
3. Go to `/admin` → Settings → Is Blob showing "Connected"?

**Fix**:
```bash
# Restart dev server
# Ctrl+C then:
npm run dev
```

### ❌ Settings page shows "Not configured"

**Fix**:
1. Pull env vars: `vercel env pull .env.local`
2. Restart dev server
3. Refresh admin page
4. Should now show "✓ Connected"

### ❌ Upload works locally but not in production

**Check**:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Confirm `BLOB_READ_WRITE_TOKEN` exists
3. If missing, reconnect Blob store in Storage tab
4. Redeploy

### ❌ Images not displaying

**Check**:
1. Is URL from Blob (contains `.blob.vercel-storage.com`)?
2. Can you open URL directly in browser?
3. Check browser console for errors
4. Verify URL saved correctly in KV

**Debug**:
```bash
# Check what's in KV
curl "YOUR_KV_URL/get/products:all" -H "Authorization: Bearer YOUR_KV_TOKEN"
```

---

## 📊 Storage Usage

**Check your usage**:
- Vercel Dashboard → Storage → tsuya-images → Usage

**Free Tier Limits**:
- Storage: 5 GB
- Bandwidth: 100 GB/month

**Recommendation**:
- Each image ~500 KB on average
- 5 GB ≈ 10,000 images
- More than enough for most e-commerce sites!

---

## 📚 Documentation Reference

| File | Purpose |
|------|---------|
| `QUICK_START.md` | 10-minute setup guide |
| `VERCEL_BLOB_SETUP.md` | Comprehensive documentation |
| `SETUP_SUMMARY.md` | What was changed & why |
| `DASHBOARD_GUIDE.txt` | Visual Vercel Dashboard walkthrough |
| `CHECKLIST.md` | This file - step-by-step checklist |

**Test Scripts**:
- `scripts/test-blob.js` - Quick connection test
- `scripts/test-blob-connection.ts` - TypeScript version

---

## ✨ Success Criteria

You're done when:

✅ Test script shows: "SUCCESS! Vercel Blob is working correctly."  
✅ Settings page shows: "Vercel Blob Storage: ✓ Connected"  
✅ Can upload images in admin  
✅ Images return Blob URLs (not `/uploads/...`)  
✅ Images display on product pages  
✅ Everything works in production  

---

## 🚀 Ready?

**Start here**:
1. Read `QUICK_START.md` for overview
2. Use `DASHBOARD_GUIDE.txt` for Vercel Dashboard steps
3. Follow this checklist to complete setup
4. Test with test script: `node scripts/test-blob.js`

**Estimated Time**: 10-15 minutes total

**You got this!** 🎉

---

## 📝 Notes

### What Changed:
- Upload API now uses `@vercel/blob` instead of filesystem
- Images stored in cloud instead of `/public/uploads/`
- URLs changed from `/uploads/...` to `https://...blob.vercel-storage.com/...`
- Admin settings page shows connection status

### What Stayed the Same:
- Admin UI for uploading (no changes needed)
- Product data structure in KV
- Frontend display logic
- File size limits (5 MB)
- Allowed file types (JPEG, PNG, WebP, GIF)

### Benefits:
- ✅ Images persist forever (no redeploy issues)
- ✅ Global CDN (fast worldwide)
- ✅ Automatic optimization
- ✅ Scalable (no server limits)
- ✅ Cost-effective (free tier is generous)

---

**Last Updated**: Dec 3, 2025  
**Status**: Code ready ✅ | Awaiting Vercel Blob creation ⏳



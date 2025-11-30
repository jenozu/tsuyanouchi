# 🎨 Sanity CMS Setup - Step by Step Guide

## ✅ What You'll Get:
- Beautiful visual interface to manage products
- Drag & drop image uploads
- No coding needed to add products
- Can manage from anywhere

**Total time: ~10 minutes**

---

## 📋 Step-by-Step Instructions

### Step 1: Create Sanity Account (2 minutes)

1. **Open this link**: https://www.sanity.io/
2. **Click "Get Started"** (top right corner)
3. **Click "Continue with GitHub"** (easiest way)
4. **Authorize Sanity** to access your GitHub account
5. ✅ You now have a Sanity account! (100% FREE forever)

---

### Step 2: Create a New Project (2 minutes)

1. **Go to**: https://www.sanity.io/manage
2. **Click "Create project"** (big blue button)
3. **Fill in the form**:
   - **Project name**: `TSUYA NO UCHI` (or whatever you like)
   - **Use your own configuration**: Select this
4. **Click "Create project"**
5. **Choose dataset name**: `production` (leave as default)
6. **Click "Continue"**

---

### Step 3: Get Your Project ID (30 seconds)

After creating the project, you'll see a screen with your **Project ID**.

It looks like: `abc12xyz3`

**🎯 COPY THIS PROJECT ID!** You'll need it in the next step!

---

### Step 4: Add Environment Variables Locally (1 minute)

Open your terminal in VS Code and run these commands:

**Windows PowerShell:**
```powershell
# Create .env.local file with your Project ID
@"
NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_PROJECT_ID_HERE
NEXT_PUBLIC_SANITY_DATASET=production
"@ | Out-File -FilePath .env.local -Encoding utf8
```

**Or manually create the file:**

1. In VS Code, create a new file called `.env.local` in your project root
2. Add these two lines (replace with YOUR project ID):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_actual_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
```

**Example:**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=abc12xyz3
NEXT_PUBLIC_SANITY_DATASET=production
```

3. **Save the file!**

---

### Step 5: Configure CORS in Sanity (1 minute)

This allows your website to connect to Sanity:

1. **Go to**: https://www.sanity.io/manage
2. **Click on your project** (TSUYA NO UCHI)
3. **Click "API"** in the left sidebar
4. **Scroll down to "CORS Origins"**
5. **Click "Add CORS origin"**
6. **Add these URLs** (add them one by one):
   - `http://localhost:3000`
   - `https://v0-tsuya.vercel.app`
   - `https://*.vercel.app` (for preview deployments)
7. **Check "Allow credentials"** for each
8. **Click "Save"**

---

### Step 6: Start Your Dev Server (1 minute)

In your terminal:

```bash
npm run dev
```

Wait for it to start (should say "Ready in X ms")

---

### Step 7: Access Sanity Studio! 🎉 (30 seconds)

1. **Open your browser**
2. **Go to**: http://localhost:3000/studio
3. **Sign in with your Sanity account** (same GitHub login)
4. **You'll see the Sanity Studio interface!**

You should see:
- "TSUYA NO UCHI" at the top
- "Products" in the sidebar
- A clean interface ready to use!

---

### Step 8: Add Your First Product! 🎨 (2 minutes)

In Sanity Studio:

1. **Click "Products"** in the left sidebar
2. **Click "Create"** button (top right, or center if empty)
3. **Fill in the form**:

   **Title**: `Moonlit Garden`
   
   **Slug**: Click "Generate" (it auto-creates from title)
   
   **Price**: `38`
   
   **Main Image**: Click the image area → Upload your image
   
   **Gallery**: Click "Add item" → Upload 2-3 more images
   
   **Available Sizes**: Click checkboxes for A4, A3, 11x14
   
   **Tags**: Click checkboxes for nature, yokai
   
   **Description**: Write something like:
   ```
   Under the pale moonlight, spirits dance among ancient stones. 
   Rendered in soft indigos and silvers with delicate brushwork 
   that captures the quiet magic of a Japanese garden at night.
   ```
   
   **In Stock**: Check the box ✅

4. **Click "Publish"** (bottom right)

**🎉 Your product is now saved!**

---

### Step 9: See Your Products on the Site (30 seconds)

1. **Go to**: http://localhost:3000/shop
2. **You should see your new product!**
3. **Click on it to see the detail page**

**If you don't see it**, refresh the page or restart the dev server.

---

### Step 10: Deploy to Vercel (3 minutes)

Now let's make your products live on the internet!

1. **Go to Vercel**: https://vercel.com/jenozus-projects/v0-tsuya/settings/environment-variables

2. **Add environment variable**:
   - Click "Add New" or "Add Environment Variable"
   - **Key**: `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - **Value**: Your project ID (the one from Step 3)
   - **Environments**: Check ALL boxes (Production, Preview, Development)
   - Click "Save"

3. **Add second variable**:
   - Click "Add New" again
   - **Key**: `NEXT_PUBLIC_SANITY_DATASET`
   - **Value**: `production`
   - **Environments**: Check ALL boxes
   - Click "Save"

4. **Redeploy**:
   - Go to "Deployments" tab: https://vercel.com/jenozus-projects/v0-tsuya
   - Click the three dots (...) on the latest deployment
   - Click "Redeploy"
   - Wait 2-3 minutes

5. **Check your live site**: https://v0-tsuya.vercel.app/shop

**🎉 Your products are now LIVE!**

---

## 🎯 You're Done! Now You Can:

✅ **Add products** anytime at http://localhost:3000/studio (while dev server is running)

✅ **Or go to**: https://www.sanity.io/manage → Your project → "Open Studio"

✅ **Upload images** with drag & drop

✅ **Edit descriptions** with a rich text editor

✅ **Products appear immediately** on your live site!

---

## 💡 Pro Tips:

**Adding Multiple Products:**
- Add 5-10 products to start
- Use consistent image sizes (800x1200px recommended)
- Write engaging descriptions (2-3 sentences)
- Add multiple gallery images for each

**Image Tips:**
- Upload high-quality images (Sanity handles optimization)
- Add 3-5 gallery images per product
- Show different angles, details, framing options

**Managing Products:**
- You can edit products anytime
- Click "Publish" to make changes live
- Unpublish products to temporarily hide them
- Use "In Stock" checkbox to control availability

---

## 🆘 Troubleshooting:

**"Can't access Studio"**
- Make sure dev server is running: `npm run dev`
- Check you're at: http://localhost:3000/studio
- Try clearing browser cache

**"Products not showing"**
- Check environment variables are set correctly
- Make sure you clicked "Publish" in Sanity
- Try refreshing the page
- Check browser console for errors

**"CORS error"**
- Make sure you added the CORS origins in Sanity dashboard
- Include http://localhost:3000 and your Vercel URLs

---

## ✨ Next Steps:

1. **Add more products!** Make your shop full and beautiful
2. **Write great descriptions** - tell the story of each piece
3. **Upload quality images** - show your art in the best light
4. **Organize with tags** - makes filtering work better

**Need help?** Just ask! I'm here to help you add amazing products! 🎨


# 🛍️ How to Add & Edit Products - Complete Guide

## 🎯 You Have 2 Options:

---

## ✨ Option 1: Use Sanity CMS (RECOMMENDED)

**Best for:** Production websites, easy management, no coding needed

### Step 1: Create a FREE Sanity Account

1. Go to: https://www.sanity.io/
2. Click "Get Started" (top right)
3. Sign up with GitHub (easiest)
4. It's **100% FREE** forever!

### Step 2: Create a New Project

1. After signing in, go to: https://www.sanity.io/manage
2. Click "Create project"
3. Name it: `TSUYA NO UCHI` (or whatever you want)
4. Choose dataset: `production`
5. Region: Choose closest to you
6. Click "Create project"

### Step 3: Get Your Project ID

After creating the project:
1. You'll see your **Project ID** (looks like: `abc123xyz`)
2. **COPY THIS!** You need it for the next step

### Step 4: Add Environment Variables

Open your terminal in VS Code and run:

```bash
# Create .env.local file
echo NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_PROJECT_ID_HERE > .env.local
echo NEXT_PUBLIC_SANITY_DATASET=production >> .env.local
```

**Or manually create a file called `.env.local` in your project root:**

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
```

### Step 5: Start Your Dev Server

```bash
npm run dev
```

### Step 6: Access Sanity Studio

Open your browser and go to:
**http://localhost:3000/studio**

You'll see the Sanity Studio interface!

### Step 7: Add Products! 🎨

In Sanity Studio:

1. Click "Products" in the sidebar
2. Click "Create" button (top right)
3. Fill in the form:
   - **Title**: "Cherry Blossom Spirit"
   - **Slug**: Click "Generate" (auto-creates from title)
   - **Price**: 35
   - **Main Image**: Click to upload your main product image
   - **Gallery**: Add 2-4 additional images
   - **Sizes**: Select available sizes (A5, A4, A3, 11x14)
   - **Tags**: Select tags (blossom, portrait, nature, yokai)
   - **Description**: Write a beautiful description
   - **In Stock**: Check the box
4. Click "Publish" (bottom right)

**That's it!** Your product is now live!

### Step 8: Deploy to Vercel

After adding products, you need to add the environment variables to Vercel:

1. Go to: https://vercel.com/jenozus-projects/v0-tsuya/settings/environment-variables
2. Add these variables:
   - **Key**: `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - **Value**: Your project ID
   - **Environments**: Check all (Production, Preview, Development)
3. Click "Save"
4. Go to "Deployments" tab
5. Click "Redeploy" on the latest deployment

**Your products will now show on the live site!**

---

## 🚀 Option 2: Edit Products in Code (Quick & Easy)

**Best for:** Testing, quick changes, no Sanity account needed

### How It Works:

Products are stored in: `lib/products.ts`

### To Add/Edit Products:

1. **Open the file**: `lib/products.ts`
2. **Find the `fallbackProducts` array**
3. **Add a new product** or edit existing ones

### Example Product:

```typescript
{
  id: "my-new-product",           // Unique ID (lowercase, dashes)
  title: "Cherry Blossom Dream",  // Product name
  price: 35,                      // Price in dollars
  image: "/my-image.png",         // Main image path
  gallery: [                      // Additional images
    "/my-image.png",
    "/my-image-2.png"
  ],
  sizes: ["A5", "A4", "A3"],     // Available sizes
  tags: ["blossom", "portrait"],  // Category tags
  description: "A beautiful cherry blossom scene with soft pink petals drifting through the air...",
  inStock: true,                  // Is it available?
}
```

### Adding Your Images:

1. Put your images in the `public/` folder
2. Name them clearly: `cherry-blossom-main.png`
3. Reference them in the code: `"/cherry-blossom-main.png"`

### Example: Adding a Complete New Product

```typescript
{
  id: "moonlit-garden",
  title: "Moonlit Garden",
  price: 42,
  image: "/moonlit-garden-main.jpg",
  gallery: [
    "/moonlit-garden-main.jpg",
    "/moonlit-garden-detail.jpg",
    "/moonlit-garden-framed.jpg"
  ],
  sizes: ["A4", "A3", "11x14"],
  tags: ["nature", "yokai"],
  description: "Under the pale moonlight, spirits dance among ancient stones. Rendered in soft indigos and silvers with delicate brushwork that captures the quiet magic of a Japanese garden at night. This piece brings tranquility and mystery to any space.",
  inStock: true,
},
```

### After Editing:

```bash
# Save your changes
git add .
git commit -m "Added new products"
git push origin main
```

**Vercel auto-deploys in 2-3 minutes!**

---

## 📸 Image Guidelines

### Best Practices:

**Dimensions:**
- **Main Image**: 800x1200px (3:4 ratio)
- **Gallery Images**: 800x1200px (3:4 ratio)
- **File Format**: JPG or PNG
- **File Size**: Under 500KB each (compress if needed)

**Tips:**
- Use consistent lighting
- White or neutral backgrounds work best
- Show the artwork clearly
- Include lifestyle shots (framed, on wall)
- Add detail shots

### Free Image Compression Tools:
- https://tinypng.com/
- https://squoosh.app/
- https://compressor.io/

---

## ✍️ Writing Great Descriptions

### Formula for Product Descriptions:

1. **Opening**: Emotional hook (1 sentence)
2. **Story**: What's depicted, mood, colors (2-3 sentences)
3. **Technique**: Art style, materials mention (1 sentence)
4. **Benefit**: How it enhances a space (1 sentence)

### Example:

```
A moment of stillness captured in time. This piece depicts a young 
woman lost in thought beneath falling cherry blossoms, her kimono 
adorned with delicate floral patterns that echo the petals around her. 
Rendered in soft pinks, creams, and dusty violets using techniques 
inspired by traditional woodblock printing. Perfect for bringing a 
sense of calm and Japanese aesthetic to bedrooms, studios, or 
meditation spaces.
```

---

## 🎯 My Recommendation:

**Start with Option 2** (code) to get a few products up quickly, then **migrate to Option 1** (Sanity) for long-term management.

Why?
- ✅ Get products live today (Option 2)
- ✅ Learn the structure
- ✅ Set up Sanity later for easier management
- ✅ Best of both worlds!

---

## 🆘 Need Help?

Just tell me:
- "Help me add products via code" - I'll edit the file for you
- "Help me set up Sanity" - I'll walk you through it step-by-step
- "Can you write product descriptions?" - I'll create beautiful copy

**I'm here to help! Let's make your shop amazing! 🎨**


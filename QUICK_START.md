# Quick Start Guide - Product Management System

## ✅ What's Been Implemented

You now have a complete product management system similar to Gemini Studio, but integrated into your Next.js setup!

### Features Implemented:
1. ✅ **Admin Dashboard** at `/admin`
   - Analytics with recharts
   - Product CRUD operations
   - Low stock alerts
   - Revenue/inventory tracking

2. ✅ **Image Upload System**
   - Upload images directly in admin
   - Stored in `/public/uploads/`
   - No external image hosting needed

3. ✅ **File-Based Storage**
   - Products stored in `/data/products.json`
   - Images in `/public/uploads/`
   - No Sanity CMS dependency

4. ✅ **AI Product Descriptions**
   - One-click AI description generation
   - Uses Google Gemini 2.0 Flash

## 🚀 Getting Started

### 1. Install Dependencies (Already Done)
```bash
npm install openai recharts --legacy-peer-deps
```

### 2. Set Up Environment Variable

Create a `.env.local` file in your project root:

```bash
OPENAI_API_KEY=your_api_key_here
```

**Get your OpenAI API key:**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy and paste into `.env.local`

**Note:** Your ChatGPT Plus membership is separate! See `OPENAI_SETUP.md` for details.

**Cost:** ~$0.15 per 1000 descriptions (super cheap!)

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Access Admin Dashboard

Navigate to: `http://localhost:3000/admin`

## 📦 Data Storage

### Where Everything is Stored:

```
TsuyaNoUchi/
├── data/
│   ├── products.json      # Your product database
│   ├── carts.json         # Shopping carts (future)
│   ├── orders.json        # Orders (future)
│   └── favorites.json     # User favorites (future)
├── public/
│   └── uploads/           # Uploaded product images
│       ├── 1701234567_image1.jpg
│       └── 1701234568_image2.png
```

**On Your VPS:**
- All files stored locally on your server
- No external database required
- Easy to backup (just copy `/data` and `/public/uploads`)
- Free (no database hosting costs)

## 🎨 Using the Admin Dashboard

### Adding a Product:

1. Click "Products" in sidebar
2. Click "Add Product" button
3. Fill in:
   - **Name:** Product name
   - **Category:** e.g., "Art Prints"
   - **Description:** Click "AI Generate" for instant description! 🤖
   - **Price:** Selling price
   - **Cost:** (Optional) Cost of goods for profit tracking
   - **Stock:** Number of items available
   - **Image:** Upload or paste URL
   - **Sizes:** (Optional) Add size variants with different prices

4. Click "Create Product"

### Uploading Images:

**Option 1: Upload File (Recommended)**
- Click "Upload" button
- Select image from computer
- Image automatically uploads to `/public/uploads/`
- URL auto-populated

**Option 2: Paste URL**
- Paste any image URL
- Works with external images
- Or use existing `/images/...` files

### AI Description Generator:

1. Enter product name and category
2. Click the "AI Generate" button (wand icon)
3. ChatGPT writes a beautiful, brand-appropriate description
4. Edit as needed
5. Save!

**Cost:** ~$0.00015 per generation (basically free!)
**Using:** OpenAI GPT-4o-mini (better quality than Gemini!)

## 📊 Dashboard Analytics

Your admin dashboard shows:

- **Total Products:** Count of all products
- **Total Stock:** Total items in inventory
- **Inventory Value:** Total value of stock
- **Low Stock Alerts:** Items with < 5 in stock
- **Charts:**
  - Sales trends (mock data initially)
  - Inventory levels
  - Category distribution
  - Top products by value

## 🔄 Migrating from Sanity (Optional)

If you want to import your Sanity products:

1. Export products from Sanity
2. Transform to new format:
   ```json
   {
     "id": "p1701234567",
     "name": "Product Name",
     "description": "Description",
     "price": 45,
     "cost": 15,
     "category": "Art Prints",
     "imageUrl": "/uploads/image.jpg",
     "stock": 20,
     "sizes": [
       { "label": "A4", "price": 45 },
       { "label": "A3", "price": 65 }
     ]
   }
   ```
3. Add to `/data/products.json`

## 📝 API Endpoints

You now have these API routes:

```
GET    /api/products           # Get all products
POST   /api/products           # Create product
GET    /api/products/[id]      # Get single product
PUT    /api/products/[id]      # Update product
DELETE /api/products/[id]      # Delete product
POST   /api/upload             # Upload image
POST   /api/generate-description  # AI description
```

## 🎯 Next Steps

See `IMPLEMENTATION_ROADMAP.md` for:
- Authentication (Google Sign-in)
- Shopping cart
- Payment processing (Stripe)
- Order management
- Email notifications
- Full e-commerce features

## 🐛 Troubleshooting

### Images not showing?
- Check `/public/uploads/` folder exists
- Verify image URL starts with `/uploads/`
- Check file permissions on VPS

### AI not generating?
- Verify `OPENAI_API_KEY` in `.env.local`
- Check API key is valid at [OpenAI Platform](https://platform.openai.com/api-keys)
- Ensure you have credits in your OpenAI account
- Restart dev server after adding env variable
- See `OPENAI_SETUP.md` for detailed setup instructions

### Can't access admin?
- URL: `http://localhost:3000/admin`
- Make sure dev server is running
- Check browser console for errors

## 💾 Backup Your Data

**Important:** Regularly backup these folders:

```bash
# On your VPS
tar -czf backup-$(date +%Y%m%d).tar.gz data/ public/uploads/

# Download backup
scp user@yourserver:/path/backup-20241130.tar.gz ./backups/
```

## 🆘 Need Help?

1. Check `IMPLEMENTATION_ROADMAP.md` for detailed guides
2. Check browser console for errors
3. Check terminal for server errors
4. Verify all environment variables are set

---

**You're all set!** 🎉 Your product management system is ready to use. Start by adding your first product in the admin dashboard!


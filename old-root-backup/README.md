# TSUYA NO UCHI — Ukiyo‑e Style Anime Art Prints

A modern e-commerce website for ukiyo‑e inspired anime art prints. Built with Next.js 15, Supabase, Stripe, and Tailwind CSS v4.

![TSUYA NO UCHI](public/images/tsuya-triple.png)

## ✨ Features

- **🎨 Beautiful Ukiyo-e Aesthetic**: Soft palettes, paper textures, and timeless design
- **🛍️ Full E-commerce Platform**: Browse, cart, favorites, and complete checkout with Stripe
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **💳 Secure Payments**: Stripe integration with webhook support
- **📧 Email Notifications**: Order confirmations and admin alerts via Resend
- **🔐 Admin Dashboard**: Password-protected admin panel for product and order management
- **⚡ High Performance**: Built with Next.js 15 App Router and React 19
- **🎭 Modern UI Components**: shadcn/ui components with Tailwind CSS v4
- **🔍 SEO Optimized**: Proper metadata and OpenGraph tags for better discoverability
- **☁️ Cloud Infrastructure**: Supabase for database and storage with global CDN
- **🗄️ Real-time Features**: Instant cart and favorites updates with Context API

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security)
- **Storage**: [Supabase Storage](https://supabase.com/docs/guides/storage) (Image uploads)
- **Payments**: [Stripe](https://stripe.com/) (Payment processing + webhooks)
- **Email**: [Resend](https://resend.com/) (Transactional emails)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Font**: [Geist Sans & Mono](https://vercel.com/font)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Package Manager**: [npm](https://www.npmjs.com/)

## 📋 Prerequisites

Before you begin, ensure you have the following:

- **Node.js** (v20 or higher)
- **npm** (v10 or higher)
- **Git**
- **Supabase Account** (free tier works)
- **Stripe Account** (for payments)
- **Resend Account** (for emails)

## 🛠️ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/jenozu/tsuyanouchi.git
cd tsuyanouchi
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up External Services

Follow the detailed setup guide in **[TODO.md](./TODO.md)** to configure:
- Supabase (database + storage)
- Stripe (payments)
- Resend (emails)

Or use the quick reference in **[COMPLETED_WORK.md](./COMPLETED_WORK.md)**

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory. See **[ENV_TEMPLATE.md](./ENV_TEMPLATE.md)** for the complete template.

Required variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret

# Admin
ADMIN_PASSWORD=your-secure-password

# Resend
RESEND_API_KEY=re_your-key
ORDER_NOTIFICATION_EMAIL=your-email@example.com
```

### 5. Set Up Database

1. Go to your Supabase dashboard
2. Open SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the query

This creates all tables, indexes, RLS policies, and default data.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Documentation

- **[TODO.md](./TODO.md)** - Step-by-step setup checklist
- **[COMPLETED_WORK.md](./COMPLETED_WORK.md)** - Summary of completed features
- **[AUTOMATED_IMPROVEMENTS.md](./AUTOMATED_IMPROVEMENTS.md)** - Technical improvements details
- **[ENV_TEMPLATE.md](./ENV_TEMPLATE.md)** - Environment variables guide
- **[docs/koji_tsuya_integration_plan.md](./docs/koji_tsuya_integration_plan.md)** - Full integration plan

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Sanity Configuration
# Get these values from https://www.sanity.io/manage
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production

# Optional: For Sanity Studio authentication and live preview
# Create a token with Viewer permissions at https://www.sanity.io/manage
SANITY_API_READ_TOKEN=your_read_token_here

# Vercel Storage (auto-configured when deploying to Vercel)
# For local development: run `vercel env pull .env.local`
BLOB_READ_WRITE_TOKEN=your_blob_token_here
KV_REST_API_URL=your_kv_url_here
KV_REST_API_TOKEN=your_kv_token_here
```

### 4. Set Up Database

1. Go to your Supabase dashboard
2. Open SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the query

This creates all tables, indexes, RLS policies, and default data.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
tsuyanouchi/
├── app/                      # Next.js App Router
│   ├── globals.css          # Global styles with Tailwind v4
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Homepage
│   ├── shop/                # Shop pages
│   │   ├── page.tsx        # Shop listing
│   │   └── [slug]/         # Product detail pages
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── favourites/         # Favorites page
│   ├── thank-you/          # Order confirmation
│   ├── admin/              # Admin dashboard
│   │   ├── login/         # Admin authentication
│   │   └── page.tsx       # Dashboard home
│   └── api/                # API routes
│       ├── products/      # Product CRUD
│       ├── orders/        # Order management
│       ├── payments/      # Stripe integration
│       └── webhooks/      # Stripe webhooks
├── components/              # React components
│   ├── navbar.tsx          # Navigation with badges
│   ├── footer.tsx          # Footer
│   ├── product-card.tsx    # Product card
│   ├── add-to-cart-button.tsx
│   ├── favorites-client.tsx
│   ├── shop/               # Shop-specific components
│   └── ui/                 # shadcn/ui components
├── lib/                     # Utility functions
│   ├── supabase-client.ts  # Supabase setup
│   ├── supabase-helpers.ts # Database helpers
│   ├── cart-context.tsx    # Cart state management
│   ├── favorites-context.tsx # Favorites state
│   ├── stripe.ts           # Stripe utilities
│   ├── email.ts            # Email sending
│   └── products.ts         # Product utilities
├── scripts/                 # Utility scripts
│   └── migrate-to-supabase.ts
├── docs/                    # Documentation
├── public/                  # Static assets
├── supabase-setup.sql      # Database setup
└── middleware.ts           # Route protection
```

## 🎨 Key Features

### Homepage
- Hero section with featured artwork
- About section with brand story
- Featured products showcase

### Shop Page
- Product grid with filtering
- Filter by size and category
- Responsive layout
- Real-time favorites and cart badges

### Product Detail Page
- Image gallery with thumbnails
- Size selector
- Quantity picker
- Instant add to cart
- Instant favorites toggle
- Related products recommendations

### Shopping Cart
- Real-time cart management
- Quantity updates
- LocalStorage persistence
- Cart count badge in navbar

### Favorites
- Instant favorites toggling
- Persistent favorites list
- Favorites count badge in navbar
- Quick product access

### Checkout
- Guest checkout
- Form validation with Zod
- Shipping address capture
- Shipping rate selection
- Stripe payment integration
- Order confirmation page

### Admin Dashboard (`/admin`)
- Password-protected access
- Product management (CRUD operations)
- Image uploads to Supabase Storage
- Order management
- Shipping rates configuration
- Real-time analytics

### Email Notifications
- Customer order confirmations
- Admin new order alerts
- Beautiful HTML templates
- Powered by Resend

## 🧪 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npm run type-check

# Migrate data from Vercel KV to Supabase (one-time)
npx tsx scripts/migrate-to-supabase.ts
```

## 🔐 Security Features

- Row Level Security (RLS) on all Supabase tables
- Password-protected admin routes with HTTP-only cookies
- Middleware-based route protection
- Stripe webhook signature verification
- Secure payment processing with Stripe
- Environment variable validation

## 🚀 Deployment

### Deploy to Vercel

The easiest way to deploy this project is using [Vercel](https://vercel.com):

1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Import to Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
3. **Configure Environment Variables**: Add all variables from `ENV_TEMPLATE.md`
4. **Deploy**: Click "Deploy"

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jenozu/tsuyanouchi)

### Environment Variables for Production

Set these in your Vercel project settings (see `ENV_TEMPLATE.md` for complete list):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# Stripe (use live keys for production!)
STRIPE_SECRET_KEY=sk_live_your-live-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-live-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-production-webhook-secret

# Admin
ADMIN_PASSWORD=your-secure-production-password

# Resend
RESEND_API_KEY=re_your-key
ORDER_NOTIFICATION_EMAIL=orders@yourdomain.com
```

**Important for Production**:
1. Use **live** Stripe keys (not test keys)
2. Set up Stripe webhook in Dashboard (not CLI)
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
3. Use a **strong** admin password
4. Create a production Supabase project (separate from dev)

## 🎨 Customization

### Colors

The site uses a custom emerald color scheme. To change it, update the Tailwind classes in components:

```tsx
// Current: bg-emerald-900
// Change to: bg-your-color-900
```

### Products

To add or modify products:

1. **Via Admin Dashboard**: Visit `/admin` and manage products through the UI
2. **Via Supabase**: Edit directly in the Supabase dashboard Table Editor

### Styling

Global styles are in `app/globals.css`. The project uses Tailwind CSS v4 with custom CSS variables for theming.

## 📝 Product Management

### Using Admin Dashboard

1. Navigate to `http://localhost:3000/admin/login`
2. Enter your admin password (from `.env.local`)
3. Click "Products" to manage your inventory
4. Add new products with:
   - Name and description
   - Price and cost
   - Category
   - Images (uploaded to Supabase Storage)
   - Sizes (JSON array)
   - Stock quantity

### Using Supabase Directly

You can also manage products directly in the Supabase dashboard:
1. Go to Table Editor
2. Select `products` table
3. Add/edit/delete rows

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Failed to fetch from Sanity"
- **Solution**: Check that your `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
- The site will fall back to demo products if Sanity is unavailable

**Issue**: "BLOB_READ_WRITE_TOKEN is not set"
- **Solution**: Run `vercel env pull .env.local` to get storage credentials
- See **[START_HERE.md](START_HERE.md)** for complete Blob setup guide

**Issue**: Image upload fails in `/admin`
- **Solution**: 
  1. Make sure Vercel Blob is created and connected
  2. Run `vercel env pull .env.local`
  3. Restart your dev server
  4. See **[CHECKLIST.md](CHECKLIST.md)** for step-by-step troubleshooting

**Issue**: Images not loading
- **Solution**: Ensure images are in the `public/` directory
- For Sanity images, check that the image URLs are accessible
- For uploaded images, verify they're on Vercel Blob (URL contains `.blob.vercel-storage.com`)

**Issue**: TypeScript errors
- **Solution**: Run `pnpm install` to ensure all dependencies are installed
- Check `tsconfig.json` for correct configuration

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)

## 📖 Setup Guides

### Vercel Blob Storage Setup

This project uses Vercel Blob for persistent image storage. To set it up:

1. **Quick Start**: See **[START_HERE.md](START_HERE.md)** for a 10-minute setup guide
2. **Visual Guide**: See **[DASHBOARD_GUIDE.txt](DASHBOARD_GUIDE.txt)** for dashboard walkthrough
3. **Checklist**: See **[CHECKLIST.md](CHECKLIST.md)** for step-by-step setup
4. **Comprehensive**: See **[VERCEL_BLOB_SETUP.md](VERCEL_BLOB_SETUP.md)** for detailed docs
5. **Summary**: See **[SETUP_SUMMARY.md](SETUP_SUMMARY.md)** for what changed

**Test Connection**:
```bash
node scripts/test-blob.js
```

**Key Features**:
- ✅ Persistent image storage (survives redeployments)
- ✅ Global CDN (fast image delivery worldwide)
- ✅ Automatic optimization and caching
- ✅ 5 GB free storage (≈10,000 images)
- ✅ Simple API (`put()`, `del()`, `list()`)

## 📄 License

This project is for educational and portfolio purposes.

## 👤 Author

Created with care for the art of ukiyo-e and modern design.

---

**Note**: This is a demonstration project. Cart and checkout functionality are currently in demo mode. For a full e-commerce solution, consider integrating Stripe, PayPal, or similar payment processors.


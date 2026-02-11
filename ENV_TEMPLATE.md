# Environment Variables Template

Copy this file to `.env.local` and fill in your values.

```env
# ========================================
# Supabase Configuration
# ========================================
# Get these from https://supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# ========================================
# Stripe Configuration
# ========================================
# Get these from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# ========================================
# Admin Authentication
# ========================================
# Set a secure password for admin access
ADMIN_PASSWORD=your-secure-admin-password

# ========================================
# Email Configuration (Resend)
# ========================================
# Get your API key from https://resend.com/api-keys
RESEND_API_KEY=re_your-resend-api-key
# The "From" address that appears on customer emails (use your verified domain)
# Format: "Your Store Name <orders@yourdomain.com>" or just "orders@yourdomain.com"
RESEND_FROM_EMAIL=TSUYA NO UCHI <orders@yourdomain.com>
# Your email address where you receive new order notifications
ORDER_NOTIFICATION_EMAIL=admin@yourdomain.com

# ========================================
# OpenAI (Optional - for AI description generation)
# ========================================
OPENAI_API_KEY=sk-your-openai-api-key
```

## Setup Instructions

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to Settings → API to get your credentials
3. Copy the Project URL and anon/public key
4. Run the SQL migrations from the integration plan document
5. Create a storage bucket named `product-images` and set it to public

### 2. Stripe Setup

1. Go to [stripe.com](https://stripe.com) and create an account
2. Navigate to Developers → API keys
3. Copy your publishable and secret keys (use test keys for development)
4. For webhooks:
   - **Local Development**: Use Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`)
   - **Production**: Add webhook endpoint in Stripe Dashboard pointing to `https://yourdomain.com/api/webhooks/stripe`
5. Copy the webhook signing secret

### 3. Admin Password

Set a strong password that you'll use to access the admin dashboard at `/admin/login`

### 4. Resend Email Setup

1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to API Keys and create a new key
3. Set `RESEND_FROM_EMAIL` - The "From" address for customer emails (use your verified domain for best deliverability)
4. Set `ORDER_NOTIFICATION_EMAIL` - Your email address where you want to receive new order alerts

### 5. OpenAI (Optional)

If you want AI-powered product description generation in the admin dashboard, add your OpenAI API key.

## For Production Deployment

Make sure to:
- Use **live** Stripe keys (not test keys) in production
- Set webhook endpoint to your production URL
- Use a **very strong** admin password
- Verify your sending domain in Resend for better email deliverability

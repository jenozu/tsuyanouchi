# Authentication Setup Complete! 🎉

## ✅ What's Been Implemented

1. **NextAuth.js v5** with Google OAuth provider
2. **Prisma** ORM with PostgreSQL adapter
3. **Database schema** for users, accounts, sessions
4. **Sign-in page** at `/auth/signin`
5. **Account page** with user profile at `/account`
6. **Protected routes** - Admin and Account pages require authentication
7. **Navbar with auth** - Shows user avatar when logged in

## 🔧 Setup Required Before Testing

### Step 1: Create Supabase Database

1. Go to https://supabase.com and create a free account
2. Create a new project (name: `tsuyanouchi`)
3. Wait ~2 minutes for database provisioning
4. Go to **Project Settings > Database > Connection String**
5. Copy the **Connection String** (URI format)
   - Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

### Step 2: Set Up Google OAuth

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Navigate to **APIs & Services > Credentials**
4. Click **"Create Credentials" > "OAuth 2.0 Client ID"**
5. Configure OAuth consent screen:
   - Select "External"
   - App name: "TSUYA NO UCHI"
   - Add your email
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://tsuya-no-uchi-site.vercel.app/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**

### Step 3: Generate Auth Secret

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Copy the output - this is your AUTH_SECRET.

### Step 4: Create `.env.local` File

Create a file named `.env.local` in the project root with these values:

```env
# Database (from Supabase)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres"

# NextAuth (generate with: openssl rand -base64 32)
AUTH_SECRET="[YOUR-GENERATED-SECRET]"
AUTH_URL="http://localhost:3000"

# Google OAuth (from Google Cloud Console)
AUTH_GOOGLE_ID="[YOUR-GOOGLE-CLIENT-ID]"
AUTH_GOOGLE_SECRET="[YOUR-GOOGLE-CLIENT-SECRET]"

# OpenAI (for AI description generation - you already have this)
OPENAI_API_KEY="your-existing-openai-key"
```

### Step 5: Run Prisma Migrations

After setting up `.env.local`, run:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

This will create all the necessary database tables in your Supabase PostgreSQL database.

### Step 6: Test Authentication

1. Start the dev server: `npm run dev`
2. Visit http://localhost:3000
3. Click the user icon (top right) - it should show "Sign in"
4. Click to go to the sign-in page
5. Click "Continue with Google"
6. Sign in with your Google account
7. You should be redirected back to the homepage
8. The navbar should now show your profile picture/avatar
9. Click your avatar to see Account menu with sign-out option
10. Visit http://localhost:3000/account to see your profile page
11. Check your Supabase database - you should see a user record!

## 📦 What's Next?

After authentication works, you can implement:

1. **Shopping Cart** - Store cart items per user
2. **Stripe Payments** - Accept real payments
3. **Order History** - Show user's past orders
4. **Favorites** - Save favorite products per user

## 🚀 Production Deployment

When ready to deploy to Vercel:

1. Add all environment variables to Vercel:
   - Go to your project settings on Vercel
   - Add the same variables from `.env.local`
   - **Important:** Use production URLs:
     - `AUTH_URL="https://tsuya-no-uchi-site.vercel.app"`
     - Generate a NEW `AUTH_SECRET` for production
2. Make sure Google OAuth has the production redirect URI added
3. Deploy!

## 🐛 Troubleshooting

**Error: "DATABASE_URL is not defined"**
- Make sure `.env.local` exists in project root
- Check that DATABASE_URL is spelled correctly
- Restart your dev server after creating `.env.local`

**Error: "Invalid client_id"**
- Double-check your Google OAuth credentials
- Make sure you copied the full Client ID
- Verify redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`

**Sign-in redirects to error page**
- Check that all environment variables are set
- Run `npx prisma generate` again
- Check browser console for error messages

**"Prisma Client not found"**
- Run: `npx prisma generate`
- Restart your dev server

## 📁 Files Created

- `auth.ts` - NextAuth configuration
- `lib/prisma.ts` - Prisma client
- `prisma/schema.prisma` - Database schema
- `app/api/auth/[...nextauth]/route.ts` - Auth API routes
- `app/auth/signin/page.tsx` - Sign-in page
- `app/account/page.tsx` - User account page
- `components/auth/signout-button.tsx` - Sign-out button
- `components/navbar-wrapper.tsx` - Auth-aware navbar wrapper
- `middleware.ts` - Protected routes middleware
- Updated: `components/navbar.tsx` - Now shows user avatar/menu


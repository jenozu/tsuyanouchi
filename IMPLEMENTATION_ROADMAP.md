# 🚀 TSUYA NO UCHI - Complete E-Commerce Implementation Roadmap

**From Current Setup to Fully Functional Sales Platform**

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Opportunities from Gemini Version](#opportunities-from-gemini-version)
3. [Phase 1: Enhanced Product Management](#phase-1-enhanced-product-management)
4. [Phase 2: Authentication & User Accounts](#phase-2-authentication--user-accounts)
5. [Phase 3: Shopping Cart & Checkout](#phase-3-shopping-cart--checkout)
6. [Phase 4: Payment Processing (Stripe)](#phase-4-payment-processing-stripe)
7. [Phase 5: Order Management](#phase-5-order-management)
8. [Phase 6: Email Notifications](#phase-6-email-notifications)
9. [Phase 7: Advanced Features](#phase-7-advanced-features)
10. [Deployment & Production Checklist](#deployment--production-checklist)
11. [Security Best Practices](#security-best-practices)
12. [Cost Breakdown](#cost-breakdown)
13. [Implementation Timeline](#implementation-timeline)

---

## Executive Summary

This document provides a complete roadmap to transform your TSUYA NO UCHI website from a content showcase into a **fully functional e-commerce platform** ready to process real sales. The implementation is divided into 7 phases, prioritized by business impact.

### Current Status ✅
- Beautiful Next.js 15 website
- Sanity CMS integration
- Product display pages
- Responsive design

### Missing Components ❌
- User authentication & accounts
- Shopping cart persistence
- Payment processing
- Order management system
- Email notifications
- Admin analytics dashboard
- AI-powered features

### End Goal 🎯
A production-ready e-commerce platform where customers can:
- Browse products
- Create accounts (Google Sign-in)
- Add items to cart
- Complete purchases with Stripe
- Track orders
- Receive email confirmations

---

## Opportunities from Gemini Version

### 1. 🎨 **Custom Admin Dashboard** (HIGH IMPACT)

**What Gemini Has:**
- Beautiful analytics dashboard with charts (Recharts)
- Real-time inventory tracking
- Low stock alerts
- Revenue/cost/profit analytics
- Category distribution pie charts
- Product CRUD interface

**Implementation Value:**
- ✅ Better inventory management
- ✅ Business insights at a glance
- ✅ No need for external analytics tools
- ✅ Saves ~$20-50/month on SaaS subscriptions

**Status:** ✅ Already implemented at `/admin`

---

### 2. 🤖 **AI-Powered Product Descriptions** (MEDIUM IMPACT)

**What Gemini Has:**
- One-click AI description generation
- Uses AI for brand-aware copywriting
- Saves hours of manual writing

**Our Implementation:**
- ✅ One-click AI description generation
- ✅ Uses OpenAI GPT-4o-mini (better quality!)
- ✅ Brand-aware copywriting
- ✅ Faster product uploads
- ✅ Consistent brand voice
- ✅ SEO-optimized descriptions
- ✅ Cost: ~$0.00015 per generation (super cheap!)

**Status:** ✅ Already implemented (needs OPENAI_API_KEY)

---

### 3. 💾 **Simple File-Based Storage** (COMPLETED)

**What Gemini Has:**
- localStorage for quick demos
- No database complexity

**Our Improvement:**
- ✅ VPS file storage (`/data/products.json`)
- ✅ Image uploads to `/public/uploads/`
- ✅ No Sanity CMS complexity
- ✅ Full control over data

**Status:** ✅ Implemented

---

### 4. ⭐ **Favorites/Wishlist System** (HIGH IMPACT)

**What Gemini Has:**
- Heart icon on products
- Persistent favorites list
- Favorites page view

**Implementation Value:**
- ✅ Increases conversions (25-30% higher)
- ✅ Encourages return visits
- ✅ Marketing opportunity (abandoned wishlist emails)

**Status:** ❌ Not yet implemented

**Implementation Guide:** [See Phase 3](#favorites-wishlist-implementation)

---

### 5. 📊 **Business Analytics** (MEDIUM IMPACT)

**What Gemini Has:**
- COGS (Cost of Goods Sold) tracking
- Profit margin calculations
- Revenue trends
- Mock sales data visualization

**Implementation Value:**
- ✅ Track actual profitability
- ✅ Make data-driven decisions
- ✅ Identify best-selling products

**Status:** ✅ UI implemented (needs real order data)

---

### 6. 📤 **CSV Bulk Upload** (MEDIUM IMPACT)

**What Gemini Has:**
- Upload multiple products via CSV
- Faster than adding one-by-one

**Implementation Value:**
- ✅ Speed up product catalog building
- ✅ Easy inventory updates
- ✅ Import from spreadsheets

**Status:** ❌ Not yet implemented

**Implementation Guide:** [See Phase 1](#csv-bulk-upload)

---

## Phase 1: Enhanced Product Management

**Goal:** Complete the product management system with missing features

### 1.1 CSV Bulk Upload

**Dependencies:** None
**Time Estimate:** 2-3 hours

**Implementation:**

```typescript
// app/api/products/bulk/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { bulkAddProducts } from '@/lib/product-storage'
import Papa from 'papaparse'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }
    
    const text = await file.text()
    const result = Papa.parse(text, { header: true })
    
    // Validate and transform CSV data
    const products = result.data.map((row: any) => ({
      name: row.name,
      description: row.description || '',
      price: parseFloat(row.price),
      cost: row.cost ? parseFloat(row.cost) : undefined,
      category: row.category,
      imageUrl: row.imageUrl || '',
      stock: parseInt(row.stock) || 0,
      sizes: row.sizes ? JSON.parse(row.sizes) : [],
    }))
    
    const added = await bulkAddProducts(products)
    
    return NextResponse.json({ 
      success: true, 
      count: added.length,
      products: added 
    })
  } catch (error) {
    console.error('Bulk upload error:', error)
    return NextResponse.json({ error: 'Failed to process CSV' }, { status: 500 })
  }
}
```

**Install dependency:**
```bash
npm install papaparse
npm install --save-dev @types/papaparse
```

**CSV Format Example:**
```csv
name,description,price,cost,category,imageUrl,stock,sizes
"Moonlight Print","Beautiful night scene",45,15,"Art Prints","/images/moon.jpg",20,"[{""label"":""A4"",""price"":45},{""label"":""A3"",""price"":65}]"
```

**Add to Admin UI:**
```typescript
// In app/admin/page.tsx
const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/products/bulk', {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  alert(`Successfully uploaded ${data.count} products!`)
  refreshProducts()
}
```

---

### 1.2 Product Image Gallery

**Current:** Single image per product
**Improvement:** Multiple images with thumbnails

**Implementation:**

```typescript
// Update Product interface in lib/product-storage.ts
export interface Product {
  // ... existing fields
  images?: string[] // Array of image URLs
  imageUrl: string // Primary image (backwards compatible)
}
```

**Update upload to handle multiple files:**

```typescript
// app/api/upload-multiple/route.ts
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const files = formData.getAll('files') as File[]
  
  const uploadedUrls = []
  
  for (const file of files) {
    // ... same upload logic
    uploadedUrls.push(`/uploads/${filename}`)
  }
  
  return NextResponse.json({ urls: uploadedUrls })
}
```

---

### 1.3 Product Categories Management

**Implementation:**

```typescript
// lib/categories.ts
import fs from 'fs'
import path from 'path'

const CATEGORIES_FILE = path.join(process.cwd(), 'data', 'categories.json')

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
}

export function getCategories(): Category[] {
  if (!fs.existsSync(CATEGORIES_FILE)) {
    const defaults = [
      { id: 'prints', name: 'Art Prints', slug: 'prints' },
      { id: 'originals', name: 'Original Artwork', slug: 'originals' },
      { id: 'accessories', name: 'Accessories', slug: 'accessories' },
    ]
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(defaults, null, 2))
    return defaults
  }
  
  return JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf-8'))
}

// Similar functions: addCategory, updateCategory, deleteCategory
```

---

## Phase 2: Authentication & User Accounts

**Goal:** Enable user registration, login, and account management

### 2.1 NextAuth.js Setup with Google Sign-In

**Why NextAuth.js?**
- ✅ Most popular auth solution for Next.js
- ✅ Built-in Google OAuth support
- ✅ Session management included
- ✅ Works with Next.js 15 App Router

**Time Estimate:** 3-4 hours

**Step 1: Install Dependencies**

```bash
npm install next-auth@beta
```

**Step 2: Configure Google OAuth**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. For production: `https://yourdomain.com/api/auth/callback/google`
7. Copy Client ID and Client Secret

**Step 3: Environment Variables**

```bash
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Step 4: Create Auth Configuration**

```typescript
// lib/auth.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
})
```

**Step 5: Create API Route Handler**

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
```

**Step 6: Create Sign-In Page**

```typescript
// app/auth/signin/page.tsx
import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F8F4]">
      <div className="bg-white p-8 shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-serif text-center mb-6">Sign In to TSUYA NO UCHI</h1>
        
        <form
          action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/" })
          }}
        >
          <Button type="submit" className="w-full">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              {/* Google icon SVG */}
            </svg>
            Continue with Google
          </Button>
        </form>
      </div>
    </div>
  )
}
```

**Step 7: Add Auth to Navbar**

```typescript
// components/navbar.tsx
import { auth } from "@/lib/auth"
import { SignOutButton } from "@/components/auth/signout-button"

export default async function Navbar() {
  const session = await auth()
  
  return (
    <nav>
      {/* ... existing nav */}
      {session?.user ? (
        <div className="flex items-center gap-3">
          <img 
            src={session.user.image || ''} 
            alt={session.user.name || ''} 
            className="w-8 h-8 rounded-full"
          />
          <span>{session.user.name}</span>
          <SignOutButton />
        </div>
      ) : (
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      )}
    </nav>
  )
}
```

**Step 8: Create Sign-Out Button (Client Component)**

```typescript
// components/auth/signout-button.tsx
'use client'

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  return (
    <Button onClick={() => signOut()} variant="ghost">
      Sign Out
    </Button>
  )
}
```

---

### 2.2 User Profile & Account Page

**Implementation:**

```typescript
// app/account/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AccountPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-serif mb-8">My Account</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="bg-white p-6 border">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <p><strong>Name:</strong> {session.user.name}</p>
          <p><strong>Email:</strong> {session.user.email}</p>
        </div>
        
        {/* Order History */}
        <div className="bg-white p-6 border">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          {/* Will implement in Phase 5 */}
        </div>
        
        {/* Wishlist */}
        <div className="bg-white p-6 border">
          <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
          {/* Will implement in Phase 3 */}
        </div>
      </div>
    </div>
  )
}
```

---

### 2.3 Protected Routes & Middleware

**Protect admin routes:**

```typescript
// middleware.ts
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }
  
  // Optional: Check if user is admin
  const isAdmin = req.auth?.user?.email === 'your-email@example.com'
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/account/:path*']
}
```

---

## Phase 3: Shopping Cart & Checkout

**Goal:** Functional shopping cart with persistence

### 3.1 Cart Database Schema

**Option A: User-Based Cart (Recommended for Auth)**

```typescript
// lib/cart-storage.ts
import fs from 'fs'
import path from 'path'

interface CartItem {
  productId: string
  quantity: number
  selectedSize?: string
  price: number
}

interface Cart {
  userId: string
  items: CartItem[]
  updatedAt: string
}

const CARTS_FILE = path.join(process.cwd(), 'data', 'carts.json')

export function getUserCart(userId: string): Cart {
  const carts = getAllCarts()
  return carts.find(c => c.userId === userId) || {
    userId,
    items: [],
    updatedAt: new Date().toISOString()
  }
}

export function updateUserCart(userId: string, items: CartItem[]): void {
  const carts = getAllCarts()
  const index = carts.findIndex(c => c.userId === userId)
  
  const cart: Cart = {
    userId,
    items,
    updatedAt: new Date().toISOString()
  }
  
  if (index >= 0) {
    carts[index] = cart
  } else {
    carts.push(cart)
  }
  
  saveCarts(carts)
}

function getAllCarts(): Cart[] {
  if (!fs.existsSync(CARTS_FILE)) {
    fs.writeFileSync(CARTS_FILE, JSON.stringify([]))
    return []
  }
  return JSON.parse(fs.readFileSync(CARTS_FILE, 'utf-8'))
}

function saveCarts(carts: Cart[]): void {
  fs.writeFileSync(CARTS_FILE, JSON.stringify(carts, null, 2))
}
```

**Option B: Session-Based Cart (No Auth Required)**

Use cookies to store cart items temporarily.

---

### 3.2 Cart API Routes

```typescript
// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getUserCart, updateUserCart } from '@/lib/cart-storage'

// GET /api/cart - Get user's cart
export async function GET() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const cart = getUserCart(session.user.id)
  return NextResponse.json(cart)
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  const { productId, quantity, selectedSize, price } = body
  
  const cart = getUserCart(session.user.id)
  
  // Check if item already exists
  const existingIndex = cart.items.findIndex(
    item => item.productId === productId && item.selectedSize === selectedSize
  )
  
  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += quantity
  } else {
    cart.items.push({ productId, quantity, selectedSize, price })
  }
  
  updateUserCart(session.user.id, cart.items)
  
  return NextResponse.json(cart)
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  const { productId, quantity, selectedSize } = body
  
  const cart = getUserCart(session.user.id)
  
  if (quantity === 0) {
    // Remove item
    cart.items = cart.items.filter(
      item => !(item.productId === productId && item.selectedSize === selectedSize)
    )
  } else {
    // Update quantity
    const item = cart.items.find(
      i => i.productId === productId && i.selectedSize === selectedSize
    )
    if (item) {
      item.quantity = quantity
    }
  }
  
  updateUserCart(session.user.id, cart.items)
  
  return NextResponse.json(cart)
}

// DELETE /api/cart - Clear cart
export async function DELETE() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  updateUserCart(session.user.id, [])
  
  return NextResponse.json({ success: true })
}
```

---

### 3.3 Cart Component

```typescript
// components/cart/cart-provider.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => Promise<void>
  updateQuantity: (productId: string, quantity: number, size?: string) => Promise<void>
  removeItem: (productId: string, size?: string) => Promise<void>
  clearCart: () => Promise<void>
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  
  // Load cart on mount
  useEffect(() => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => setItems(data.items || []))
  }, [])
  
  const addItem = async (item: CartItem) => {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    const data = await res.json()
    setItems(data.items)
  }
  
  const updateQuantity = async (productId: string, quantity: number, size?: string) => {
    const res = await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity, selectedSize: size }),
    })
    const data = await res.json()
    setItems(data.items)
  }
  
  const removeItem = async (productId: string, size?: string) => {
    await updateQuantity(productId, 0, size)
  }
  
  const clearCart = async () => {
    await fetch('/api/cart', { method: 'DELETE' })
    setItems([])
  }
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      total,
      itemCount,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
```

---

### 3.4 Favorites/Wishlist Implementation

**API Route:**

```typescript
// app/api/favorites/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

const FAVORITES_FILE = path.join(process.cwd(), 'data', 'favorites.json')

interface UserFavorites {
  userId: string
  productIds: string[]
}

function getAllFavorites(): UserFavorites[] {
  if (!fs.existsSync(FAVORITES_FILE)) {
    fs.writeFileSync(FAVORITES_FILE, JSON.stringify([]))
    return []
  }
  return JSON.parse(fs.readFileSync(FAVORITES_FILE, 'utf-8'))
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const favorites = getAllFavorites()
  const userFavs = favorites.find(f => f.userId === session.user.id)
  
  return NextResponse.json({ productIds: userFavs?.productIds || [] })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { productId } = await request.json()
  const favorites = getAllFavorites()
  const userIndex = favorites.findIndex(f => f.userId === session.user.id)
  
  if (userIndex >= 0) {
    const productIds = favorites[userIndex].productIds
    if (!productIds.includes(productId)) {
      productIds.push(productId)
    }
  } else {
    favorites.push({ userId: session.user.id, productIds: [productId] })
  }
  
  fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favorites, null, 2))
  
  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { productId } = await request.json()
  const favorites = getAllFavorites()
  const userIndex = favorites.findIndex(f => f.userId === session.user.id)
  
  if (userIndex >= 0) {
    favorites[userIndex].productIds = favorites[userIndex].productIds.filter(
      id => id !== productId
    )
  }
  
  fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favorites, null, 2))
  
  return NextResponse.json({ success: true })
}
```

---

## Phase 4: Payment Processing (Stripe)

**Goal:** Accept real payments securely

### 4.1 Stripe Setup

**Why Stripe?**
- ✅ Industry standard for online payments
- ✅ Excellent Next.js integration
- ✅ PCI compliance handled
- ✅ Support for global currencies
- ✅ ~2.9% + $0.30 per transaction

**Time Estimate:** 4-6 hours

**Step 1: Create Stripe Account**

1. Go to [stripe.com](https://stripe.com)
2. Sign up for free account
3. Get API keys from Dashboard
4. Enable test mode initially

**Step 2: Install Stripe**

```bash
npm install stripe @stripe/stripe-js
```

**Step 3: Environment Variables**

```bash
# .env.local
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**Step 4: Initialize Stripe**

```typescript
// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})
```

---

### 4.2 Checkout Session API

```typescript
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { getUserCart } from '@/lib/cart-storage'
import { getProduct } from '@/lib/product-storage'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const cart = getUserCart(session.user.id)
    
    if (cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    
    // Build line items with full product details
    const lineItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = getProduct(item.productId)
        if (!product) throw new Error(`Product ${item.productId} not found`)
        
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
              images: product.imageUrl ? [
                `${process.env.NEXT_PUBLIC_BASE_URL}${product.imageUrl}`
              ] : undefined,
              metadata: {
                productId: product.id,
                size: item.selectedSize || 'default',
              },
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        }
      })
    )
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      customer_email: session.user.email!,
      metadata: {
        userId: session.user.id,
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'JP'], // Add your countries
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0, // Free shipping
              currency: 'usd',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 10,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500, // $15 express shipping
              currency: 'usd',
            },
            display_name: 'Express shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
    })
    
    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

---

### 4.3 Checkout Page

```typescript
// app/checkout/page.tsx
'use client'

import { loadStripe } from '@stripe/stripe-js'
import { useCart } from '@/components/cart/cart-provider'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { items, total } = useCart()
  const [loading, setLoading] = useState(false)
  
  const handleCheckout = async () => {
    try {
      setLoading(true)
      
      // Create checkout session
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      const { sessionId, error } = await res.json()
      
      if (error) {
        alert(error)
        return
      }
      
      // Redirect to Stripe checkout
      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-serif mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 border">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {items.map(item => (
            <div key={`${item.productId}-${item.selectedSize}`} className="flex justify-between mb-2">
              <span>{item.productId} {item.selectedSize && `(${item.selectedSize})`}</span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}
          <hr className="my-4" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Checkout Button */}
        <div>
          <Button 
            onClick={handleCheckout} 
            disabled={loading || items.length === 0}
            className="w-full"
            size="lg"
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </Button>
          
          <div className="mt-4 text-sm text-gray-600 space-y-2">
            <p>✓ Secure payment via Stripe</p>
            <p>✓ All major credit cards accepted</p>
            <p>✓ Your data is encrypted</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### 4.4 Success Page

```typescript
// app/checkout/success/page.tsx
import { Suspense } from 'react'
import { stripe } from '@/lib/stripe'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

async function OrderConfirmation({ sessionId }: { sessionId: string }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/signin')
  
  // Retrieve session from Stripe
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)
  
  if (checkoutSession.payment_status !== 'paid') {
    return <div>Payment not completed</div>
  }
  
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <div className="mb-6">
        <svg className="w-20 h-20 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-serif mb-4">Order Confirmed!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase. We'll send a confirmation email to{' '}
        <strong>{checkoutSession.customer_email}</strong>
      </p>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <p className="text-sm text-gray-600 mb-2">Order Number</p>
        <p className="text-xl font-mono">{checkoutSession.id}</p>
      </div>
      
      <div className="space-x-4">
        <Button asChild>
          <Link href="/account/orders">View Orders</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  if (!searchParams.session_id) {
    redirect('/cart')
  }
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmation sessionId={searchParams.session_id} />
    </Suspense>
  )
}
```

---

### 4.5 Stripe Webhooks (Critical!)

Webhooks are how Stripe notifies you about payment events.

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { createOrder } from '@/lib/orders'
import { updateUserCart } from '@/lib/cart-storage'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!
  
  let event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      
      // Create order in database
      await createOrder({
        userId: session.metadata?.userId!,
        stripeSessionId: session.id,
        paymentIntentId: session.payment_intent as string,
        amount: session.amount_total! / 100,
        currency: session.currency!,
        status: 'paid',
        customerEmail: session.customer_email!,
        shippingAddress: session.shipping_details?.address,
      })
      
      // Clear user's cart
      await updateUserCart(session.metadata?.userId!, [])
      
      // TODO: Send confirmation email
      // TODO: Update inventory
      
      break
    }
    
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object
      console.error('Payment failed:', paymentIntent.id)
      // TODO: Notify customer
      break
    }
  }
  
  return NextResponse.json({ received: true })
}

// IMPORTANT: Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
}
```

**Setting up webhooks in Stripe Dashboard:**

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events: `checkout.session.completed`, `payment_intent.payment_failed`
5. Copy webhook signing secret to `.env.local`

**For local testing:**

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Phase 5: Order Management

**Goal:** Track and manage customer orders

### 5.1 Orders Database

```typescript
// lib/orders.ts
import fs from 'fs'
import path from 'path'

export interface Order {
  id: string
  userId: string
  stripeSessionId: string
  paymentIntentId: string
  amount: number
  currency: string
  status: 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  customerEmail: string
  shippingAddress?: any
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  size?: string
  imageUrl?: string
}

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json')

export function getAllOrders(): Order[] {
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([]))
    return []
  }
  return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'))
}

export function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
  const orders = getAllOrders()
  
  const order: Order = {
    ...orderData,
    id: `order_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  orders.push(order)
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2))
  
  return order
}

export function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  trackingNumber?: string
): Order | null {
  const orders = getAllOrders()
  const index = orders.findIndex(o => o.id === orderId)
  
  if (index === -1) return null
  
  orders[index].status = status
  if (trackingNumber) {
    orders[index].trackingNumber = trackingNumber
  }
  orders[index].updatedAt = new Date().toISOString()
  
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2))
  
  return orders[index]
}

export function getUserOrders(userId: string): Order[] {
  const orders = getAllOrders()
  return orders.filter(o => o.userId === userId)
}
```

---

### 5.2 Order Management in Admin

Add to admin dashboard:

```typescript
// app/admin/page.tsx - Add Orders tab

{activeTab === 'ORDERS' && (
  <div className="space-y-6">
    <h2 className="text-3xl font-serif text-[#2D2A26]">Orders</h2>
    
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="bg-white border border-[#E5E0D8] p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold">Order #{order.id}</h3>
              <p className="text-sm text-gray-600">{order.customerEmail}</p>
              <p className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">${order.amount}</p>
              <span className={`px-3 py-1 rounded text-sm ${
                order.status === 'paid' ? 'bg-green-100 text-green-800' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.productName} {item.size && `(${item.size})`} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex gap-2">
            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
              className="px-3 py-1 border rounded"
            >
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <input
              type="text"
              placeholder="Tracking number"
              value={order.trackingNumber || ''}
              onChange={(e) => updateTracking(order.id, e.target.value)}
              className="flex-1 px-3 py-1 border rounded"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

---

### 5.3 Customer Order Tracking

```typescript
// app/account/orders/page.tsx
import { auth } from '@/lib/auth'
import { getUserOrders } from '@/lib/orders'
import { redirect } from 'next/navigation'

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin')
  
  const orders = getUserOrders(session.user.id)
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-serif mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders yet</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white border p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.amount}</p>
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              {order.trackingNumber && (
                <div className="bg-blue-50 p-3 rounded mb-4">
                  <p className="text-sm font-medium">Tracking Number</p>
                  <p className="font-mono">{order.trackingNumber}</p>
                </div>
              )}
              
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-cover" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      {item.size && <p className="text-sm text-gray-600">{item.size}</p>}
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## Phase 6: Email Notifications

**Goal:** Automated email confirmations and updates

### 6.1 Email Service Setup (Resend)

**Why Resend?**
- ✅ Modern, developer-friendly
- ✅ 100 emails/day free
- ✅ Beautiful React email templates
- ✅ Excellent deliverability

**Alternative:** SendGrid, Mailgun, AWS SES

```bash
npm install resend react-email @react-email/components
```

**Setup:**

```typescript
// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(order: Order) {
  await resend.emails.send({
    from: 'TSUYA NO UCHI <orders@yourdomain.com>',
    to: order.customerEmail,
    subject: `Order Confirmation #${order.id}`,
    react: OrderConfirmationEmail({ order }),
  })
}

export async function sendShippingNotification(order: Order) {
  await resend.emails.send({
    from: 'TSUYA NO UCHI <orders@yourdomain.com>',
    to: order.customerEmail,
    subject: `Your order has shipped #${order.id}`,
    react: ShippingNotificationEmail({ order }),
  })
}
```

---

### 6.2 Email Templates

```typescript
// emails/order-confirmation.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface OrderConfirmationEmailProps {
  order: Order
}

export default function OrderConfirmationEmail({ order }: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your TSUYA NO UCHI order confirmation</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank you for your order!</Heading>
          
          <Text style={text}>
            Your order #{order.id} has been confirmed and is being processed.
          </Text>
          
          <Section style={orderDetails}>
            <Text style={orderTitle}>Order Details</Text>
            {order.items.map((item, idx) => (
              <div key={idx} style={orderItem}>
                <Text>{item.productName} {item.size && `(${item.size})`}</Text>
                <Text>Qty: {item.quantity} × ${item.price} = ${item.price * item.quantity}</Text>
              </div>
            ))}
            <Text style={total}>Total: ${order.amount}</Text>
          </Section>
          
          <Text style={footer}>
            Questions? Reply to this email or visit our website.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
}

const orderDetails = {
  backgroundColor: '#f4f4f4',
  padding: '20px',
  margin: '20px 0',
}

const orderTitle = {
  fontWeight: 'bold',
  marginBottom: '10px',
}

const orderItem = {
  marginBottom: '10px',
}

const total = {
  fontWeight: 'bold',
  fontSize: '16px',
  marginTop: '10px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
}
```

---

### 6.3 Integrate Emails with Webhooks

Update webhook handler:

```typescript
// In app/api/webhooks/stripe/route.ts
import { sendOrderConfirmation } from '@/lib/email'

case 'checkout.session.completed': {
  // ... existing order creation code
  
  // Send confirmation email
  await sendOrderConfirmation(order)
  
  break
}
```

---

## Phase 7: Advanced Features

### 7.1 Inventory Management

Update product stock after purchase:

```typescript
// lib/product-storage.ts
export function decrementStock(productId: string, quantity: number): void {
  const products = getProducts()
  const product = products.find(p => p.id === productId)
  
  if (product) {
    product.stock = Math.max(0, product.stock - quantity)
    saveProducts(products)
  }
}
```

Call in webhook after successful payment.

---

### 7.2 Discount Codes

```typescript
// lib/discount-codes.ts
export interface DiscountCode {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minPurchase?: number
  expiresAt?: string
  usageLimit?: number
  usageCount: number
}

export function validateDiscountCode(code: string, cartTotal: number): {
  valid: boolean
  discount?: number
  error?: string
} {
  const discounts = getDiscountCodes()
  const discount = discounts.find(d => d.code.toLowerCase() === code.toLowerCase())
  
  if (!discount) {
    return { valid: false, error: 'Invalid code' }
  }
  
  if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
    return { valid: false, error: 'Code expired' }
  }
  
  if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
    return { valid: false, error: 'Code usage limit reached' }
  }
  
  if (discount.minPurchase && cartTotal < discount.minPurchase) {
    return { valid: false, error: `Minimum purchase of $${discount.minPurchase} required` }
  }
  
  const discountAmount = discount.type === 'percentage'
    ? (cartTotal * discount.value) / 100
    : discount.value
  
  return { valid: true, discount: discountAmount }
}
```

---

### 7.3 Product Reviews

```typescript
// lib/reviews.ts
export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: 1 | 2 | 3 | 4 | 5
  title: string
  comment: string
  verified: boolean // Purchased
  createdAt: string
}

// API route to submit review
// API route to get product reviews
// Display on product detail page
```

---

### 7.4 Related Products / Recommendations

```typescript
// lib/recommendations.ts
export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
  const products = getProducts()
  const currentProduct = products.find(p => p.id === productId)
  
  if (!currentProduct) return []
  
  // Simple algorithm: same category, different product
  return products
    .filter(p => p.id !== productId && p.category === currentProduct.category)
    .slice(0, limit)
}
```

---

### 7.5 Search Functionality

```typescript
// app/api/search/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  
  const products = getProducts()
  
  const results = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  )
  
  return NextResponse.json(results)
}
```

---

## Deployment & Production Checklist

### Environment Variables (Production)

```bash
# .env.production
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Auth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-production-google-id
GOOGLE_CLIENT_SECRET=your-production-google-secret

# Stripe
STRIPE_SECRET_KEY=sk_live_your_live_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret

# Email
RESEND_API_KEY=re_your_resend_key

# AI
OPENAI_API_KEY=your_openai_api_key
```

---

### VPS Deployment Setup

**1. Server Requirements:**
- Ubuntu 22.04 LTS
- Node.js 20+
- Nginx
- PM2 for process management
- SSL certificate (Let's Encrypt)

**2. Build and Deploy Script:**

```bash
#!/bin/bash
# deploy.sh

# Pull latest code
git pull origin main

# Install dependencies
npm install --production

# Build Next.js
npm run build

# Restart with PM2
pm2 restart tsuyanouchi

# Reload Nginx
sudo nginx -s reload
```

**3. PM2 Configuration:**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'tsuyanouchi',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

**4. Nginx Configuration:**

```nginx
# /etc/nginx/sites-available/tsuyanouchi
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Serve uploaded images directly
    location /uploads/ {
        alias /var/www/tsuyanouchi/public/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**5. SSL Certificate:**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

### Database Migration (Optional but Recommended)

For production, consider migrating from JSON files to PostgreSQL:

```bash
npm install pg drizzle-orm
```

Benefits:
- ✅ Better performance with large datasets
- ✅ ACID compliance
- ✅ Concurrent access handling
- ✅ Easier backups
- ✅ Query optimization

---

## Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files
- ✅ Use different keys for dev/production
- ✅ Rotate secrets regularly

### 2. Authentication
- ✅ Implement rate limiting on auth routes
- ✅ Use CSRF protection (NextAuth has built-in)
- ✅ Enable 2FA for admin accounts

### 3. Payment Security
- ✅ Never store credit card info
- ✅ Validate webhook signatures
- ✅ Use Stripe's test mode for development
- ✅ Implement fraud detection (Stripe Radar)

### 4. Data Protection
- ✅ Sanitize user inputs
- ✅ Implement CORS properly
- ✅ Use HTTPS everywhere
- ✅ Regular backups of `/data` folder

### 5. Admin Protection
- ✅ Whitelist admin email addresses
- ✅ Add 2FA for admin access
- ✅ Log all admin actions
- ✅ Rate limit sensitive endpoints

---

## Cost Breakdown

### Monthly Operating Costs

| Service | Cost | Notes |
|---------|------|-------|
| **VPS Hosting** | $5-20 | DigitalOcean, Linode, or AWS |
| **Domain** | $1-2 | ~$15/year |
| **SSL Certificate** | $0 | Let's Encrypt (free) |
| **Stripe** | 2.9% + $0.30 | Per transaction |
| **Email (Resend)** | $0-20 | 100/day free, then $20/mo |
| **Google OAuth** | $0 | Free |
| **OpenAI API** | $0-5 | Pay per use, ~$0.00015/call (GPT-4o-mini) |
| **Backups** | $0-5 | VPS snapshots |
| **CDN (Optional)** | $0-10 | Cloudflare (free tier) |

**Total:** $6-65/month depending on traffic

---

## Implementation Timeline

### Week 1: Foundation
- ✅ Admin dashboard (already done)
- ✅ Product management (already done)
- ✅ Image uploads (already done)
- ✅ AI integration (already done)

### Week 2: Authentication
- [ ] NextAuth.js setup (4 hours)
- [ ] Google OAuth (2 hours)
- [ ] Account pages (3 hours)
- [ ] Protected routes (2 hours)

### Week 3: Shopping & Payments
- [ ] Cart system (6 hours)
- [ ] Favorites/wishlist (3 hours)
- [ ] Stripe integration (4 hours)
- [ ] Checkout flow (4 hours)

### Week 4: Orders & Emails
- [ ] Order management (4 hours)
- [ ] Email templates (3 hours)
- [ ] Webhook handling (3 hours)
- [ ] Admin order dashboard (3 hours)

### Week 5: Polish & Deploy
- [ ] Testing (8 hours)
- [ ] VPS setup (4 hours)
- [ ] Domain & SSL (2 hours)
- [ ] Production deployment (2 hours)
- [ ] Monitoring setup (2 hours)

**Total Time:** ~55-60 hours of development

---

## Quick Start Commands

```bash
# 1. Install new dependencies
npm install next-auth@beta @stripe/stripe-js stripe resend react-email papaparse recharts @google/generative-ai

# 2. Install dev dependencies
npm install --save-dev @types/papaparse

# 3. Set up environment variables
cp .env.example .env.local
# Then edit .env.local with your keys

# 4. Create required directories
mkdir -p data public/uploads emails

# 5. Run development server
npm run dev

# 6. Access admin dashboard
# http://localhost:3000/admin

# 7. Test Stripe webhooks locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Support & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Stripe Docs](https://stripe.com/docs)
- [Resend Docs](https://resend.com/docs)

### Helpful Tools
- [Stripe CLI](https://stripe.com/docs/stripe-cli) - Test webhooks locally
- [React Email](https://react.email/) - Beautiful email templates
- [PM2](https://pm2.keymetrics.io/) - Process manager

### Monitoring (Recommended)
- **Uptime:** [UptimeRobot](https://uptimerobot.com/) (free)
- **Errors:** [Sentry](https://sentry.io/) (free tier)
- **Analytics:** [Plausible](https://plausible.io/) or Google Analytics

---

## Next Steps

1. **Immediate:** Set up authentication (Phase 2)
2. **This Week:** Implement shopping cart (Phase 3)
3. **This Month:** Complete Stripe integration (Phase 4)
4. **Ongoing:** Add features from Phase 7 as needed

---

## Conclusion

This roadmap transforms your beautiful TSUYA NO UCHI website into a fully functional e-commerce platform capable of processing real sales. The implementation is prioritized by business impact, with authentication and payments being the critical path to going live.

**Key Achievements:**
- ✅ Admin dashboard with analytics
- ✅ AI-powered product descriptions
- ✅ Simple file-based storage
- 🎯 Complete e-commerce functionality
- 🎯 Production-ready deployment

**Ready to start making sales!** 🚀

---

*Last Updated: November 2025*
*Version: 1.0*


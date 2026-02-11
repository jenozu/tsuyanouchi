
# Koji-Tsuya Integration Plan

This document outlines a comprehensive plan for integrating features from the Koji project into the Tsuya project, aiming for feature parity while preserving Tsuya's existing UI/UX. It includes a detailed parity audit, a phased implementation plan, specific setup instructions for Supabase and Stripe, a file-by-file change list, and a deployment and testing checklist.

# PARITY AUDIT: Koji vs. Tsuya

This section provides a detailed comparison between the Koji and Tsuya projects, highlighting the features present in Koji that need to be integrated into Tsuya, along with the necessary actions.

## Feature Comparison

| Feature | Koji (Reference) | Tsuya (Target) | Status | Action Required |
| :--- | :--- | :--- | :--- | :--- |
| **Backend** | Supabase (Postgres) | File-based (JSON) | ❌ Missing | Migrate to Supabase |
| **Storage** | Supabase Storage | Local File System | ❌ Missing | Migrate to Supabase Storage |
| **Cart** | localStorage + Context | Not implemented | ❌ Missing | Port Koji Cart logic |
| **Favorites** | localStorage + Context | Not implemented | ❌ Missing | Port Koji Favorites logic |
| **Checkout** | Guest Checkout + Stripe | Not implemented | ❌ Missing | Port Koji Checkout flow |
| **Payments** | Stripe PaymentIntents | Not implemented | ❌ Missing | Port Stripe integration |
| **Admin Auth** | Password-based | NextAuth (Google) | ⚠️ Partial | Switch to Password-based for v1 |
| **Admin Dashboard** | Full CRUD + Analytics | Partial CRUD + AI | ⚠️ Partial | Merge Koji features into Tsuya UI |
| **Order Management** | List/Detail/Status | Not implemented | ❌ Missing | Port Order management |
| **Shipping Rates** | DB-driven (Supabase) | Not implemented | ❌ Missing | Port Shipping logic |
| **Email Notifications** | Resend integration | Not implemented | ❌ Missing | Port Resend integration |

## Repository Structure Mapping

This table illustrates how Koji's key files and directories will map to the Tsuya project, indicating new files to be created or existing ones to be modified.

| Koji Path | Tsuya Equivalent | Note |
| :--- | :--- | :--- |
| `lib/supabase-client.ts` | `lib/supabase-client.ts` | New file |
| `lib/supabase-helpers.ts` | `lib/supabase-helpers.ts` | New file (replaces `lib/product-storage.ts`) |
| `lib/cart-context.tsx` | `lib/cart-context.tsx` | New file |
| `lib/favorites-context.tsx` | `lib/favorites-context.tsx` | New file |
| `lib/stripe.ts` | `lib/stripe.ts` | New file |
| `app/cart/page.tsx` | `app/cart/page.tsx` | New file |
| `app/checkout/page.tsx` | `app/checkout/page.tsx` | New file |
| `app/admin/login/page.tsx` | `app/admin/login/page.tsx` | New file |
| `app/admin/dashboard/page.tsx` | `app/admin/page.tsx` | Merge logic into Tsuya's admin page |
| `app/api/webhooks/stripe/route.ts` | `app/api/webhooks/stripe/route.ts` | New file |
| `app/api/payments/...` | `app/api/payments/...` | New files |
| `app/api/admin/...` | `app/api/admin/...` | New files |

## Legacy Dependencies to Remove (Tsuya)

To streamline the project and avoid conflicts, several legacy dependencies and related files from Tsuya will be removed or replaced:

*   `sanity`, `next-sanity`, `@sanity/client`: These dependencies related to Sanity CMS will be removed as the backend transitions to Supabase.
*   `prisma`, `@prisma/client`, `@auth/prisma-adapter`: These Prisma-related dependencies will be replaced by Supabase for database interactions.
*   `next-auth`: The existing `next-auth` implementation will be replaced with a simpler password-based authentication for the admin panel, aligning with Koji's approach for v1.


# IMPLEMENTATION PLAN: Koji Features into Tsuya Project

This section outlines a phased approach to integrate the advanced features and backend infrastructure from the Koji project into the Tsuya project, while preserving Tsuya's existing UI/UX. The plan is structured to ensure a systematic migration, focusing on backend first, then core functionalities, and finally the administrative interface and deployment.

## Overall Goal
To achieve feature parity with Koji in the Tsuya project, leveraging Supabase for backend and storage, Stripe for payments, and implementing a comprehensive admin dashboard, all while maintaining Tsuya's current design and user experience.

## Phases of Implementation

### Phase 1: Backend Infrastructure Migration (Supabase)

This initial phase focuses on transitioning Tsuya's data storage and management to Supabase. The primary objective is to replace the existing file-based product storage with a robust Supabase (Postgres) backend for products, categories, and orders, alongside Supabase Storage for product images.

**Key Tasks:**

1.  **Supabase Project Setup:** A new Supabase project will be created, and the necessary API credentials, specifically `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, will be obtained for integration. These keys are crucial for connecting the Tsuya application to the Supabase services.

2.  **Database Schema Creation:** The database schema will be established by executing SQL migrations. These migrations will create tables for `products`, `categories`, `orders`, `order_items`, and `favorites`, mirroring the structure found in Koji's `SUPABASE_SETUP.md` and `STRIPE_DATABASE_MIGRATION.sql`. Concurrently, Row Level Security (RLS) policies will be implemented to ensure data integrity and access control. This includes public read access for products, admin-only write permissions, allowing order inserts during checkout, and restricting order status updates to administrators.

3.  **Supabase Storage Setup:** A dedicated `product-images` bucket will be created within Supabase Storage. This bucket will be configured with public read policies to allow the application to display product images to users.

4.  **Supabase Client and Helpers Integration:** The Supabase client will be initialized in `lib/supabase-client.ts`. Subsequently, Koji's `lib/supabase-helpers.ts` will be ported to Tsuya, adapting its product, order, and shipping rate functions to interact with the newly configured Supabase client. This step effectively replaces the existing `lib/product-storage.ts`.

5.  **Product Data Migration:** A one-time script will be developed to facilitate the migration of existing product data from Tsuya's `products.json` file to the new Supabase `products` table. This ensures that all current product information is preserved and accessible within the new backend.

6.  **Update Product Data Access:** The `lib/products.ts` file in Tsuya will be modified to retrieve product data directly from Supabase, replacing its reliance on `lib/product-storage.ts`. Following this, the `lib/product-storage.ts` file and any associated file system operations will be removed, completing the backend transition for product data.

**Done Checklist for Phase 1:**

| Item | Status |
| :--- | :--- |
| Supabase project created and API keys obtained. | ☐ |
| All required database tables (`products`, `categories`, `orders`, `order_items`, `favorites`, `shipping_rates`) created in Supabase. | ☐ |
| RLS policies configured for `products` and `orders` tables. | ☐ |
| `product-images` bucket created in Supabase Storage with public read access. | ☐ |
| `lib/supabase-client.ts` and `lib/supabase-helpers.ts` implemented in Tsuya. | ☐ |
| Existing product data successfully migrated to Supabase. | ☐ |
| `lib/products.ts` updated to use Supabase backend. | ☐ |
| `lib/product-storage.ts` removed. | ☐ |

### Phase 2: Core E-commerce Features (Cart, Favorites, Checkout)

This phase focuses on integrating essential e-commerce functionalities such as the shopping cart, favorites list, and the complete checkout process. The goal is to leverage Koji's proven client-side logic and adapt it to Tsuya's UI, ensuring seamless integration with the new Supabase backend.

**Key Tasks:**

1.  **Cart Functionality:** The `lib/cart-context.tsx` from Koji will be ported to Tsuya. This will establish a robust shopping cart system with localStorage persistence, allowing users to maintain their cart contents across sessions. The cart functionality will then be integrated into Tsuya's user interface, specifically updating components like `components/navbar.tsx` to display cart icons and item counts. A dedicated `app/cart/page.tsx` will be created, drawing inspiration from Koji's implementation to provide a comprehensive cart viewing and management experience.

2.  **Favorites Functionality:** Similarly, Koji's `lib/favorites-context.tsx` will be integrated into Tsuya. This will enable users to mark and manage their favorite products, with the list persisting in localStorage. The favorites functionality will be reflected in Tsuya's UI, such as a heart icon in `components/navbar.tsx`. A new `app/favorites/page.tsx` will be developed, based on Koji's design, to allow users to view and manage their favorited items.

3.  **Checkout Flow Implementation:** A complete checkout flow will be implemented by creating `app/checkout/page.tsx`, adapting the UI components to align with Tsuya's existing styling. This implementation will prioritize guest checkout functionality, allowing users to complete purchases without requiring an account. The checkout process will integrate with the new Supabase `orders` table for secure and efficient order creation. Furthermore, shipping rate calculation will be incorporated, utilizing `api/shipping/rates` and the functions within `lib/supabase-helpers.ts` to determine accurate shipping costs.

**Done Checklist for Phase 2:**

| Item | Status |
| :--- | :--- |
| Cart context and UI integrated, with localStorage persistence. | ☐ |
| Favorites context and UI integrated, with localStorage persistence. | ☐ |
| `app/cart/page.tsx` and `app/favorites/page.tsx` created and functional. | ☐ |
| `app/checkout/page.tsx` created, allowing guest checkout. | ☐ |
| Checkout process successfully creates orders in Supabase. | ☐ |
| Shipping rate calculation integrated into checkout. | ☐ |

### Phase 3: Stripe Payment Integration

This phase is dedicated to establishing a secure and functional payment gateway using Stripe. The primary objective is to implement Stripe PaymentIntents for processing transactions and to configure webhooks for real-time updates on order statuses.

**Key Tasks:**

1.  **Stripe API Keys Configuration:** The necessary API keys, including `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET`, will be obtained from the Stripe dashboard. These keys will then be securely configured in Tsuya's `.env.local` file for local development and as environment variables within the Vercel deployment environment.

2.  **Stripe Utilities:** Koji's `lib/stripe.ts` file will be ported to Tsuya. This file contains essential utility functions, such as `createPaymentIntent` for initiating payment processes and `verifyWebhookSignature` for ensuring the authenticity of incoming Stripe webhook events.

3.  **Payment Intent API Endpoints:** New API endpoints will be created at `app/api/payments/create-intent/route.ts` and `app/api/payments/update-intent/route.ts`. These endpoints will be based on Koji's implementation and will handle the creation and subsequent updates of Stripe PaymentIntents, facilitating the payment process.

4.  **Stripe Webhook Handler:** A dedicated webhook handler will be implemented at `app/api/webhooks/stripe/route.ts`. This handler will be responsible for processing Stripe events, particularly `payment_intent.succeeded` and `payment_intent.payment_failed`. Upon successful payment, the webhook will update the corresponding order status in Supabase and trigger the necessary email notifications to both the customer and the admin.

5.  **Integrate Stripe Elements in Checkout:** The `app/checkout/page.tsx` will be modified to incorporate `@stripe/react-stripe-js` and the `PaymentElement`. This integration will enable the secure collection of payment details directly within Tsuya's checkout interface. The implementation will also include logic to handle payment confirmation and redirect the user to a thank-you page upon successful transaction completion.

**Done Checklist for Phase 3:**

| Item | Status |
| :--- | :--- |
| Stripe API keys and webhook secret configured in environment variables. | ☐ |
| `lib/stripe.ts` implemented. | ☐ |
| Stripe payment intent API endpoints created and functional. | ☐ |
| Stripe webhook handler (`app/api/webhooks/stripe/route.ts`) implemented and tested. | ☐ |
| Checkout page successfully processes payments via Stripe PaymentIntents. | ☐ |
| Orders are marked as paid/processing in Supabase upon successful payment. | ☐ |

### Phase 4: Admin Dashboard and Authentication

This phase focuses on integrating Koji's comprehensive admin dashboard features into Tsuya, providing administrators with robust tools for managing products, orders, and analytics. A simple, password-based authentication system will also be implemented for secure access.

**Key Tasks:**

1.  **Admin Authentication:** A new admin login page will be created at `app/admin/login/page.tsx`, along with an API route for authentication at `app/api/admin/auth/route.ts`. This system will utilize a simple password-based authentication mechanism, as outlined in Koji's `GUEST_CHECKOUT_CHANGES.md`. Tsuya's existing `app/admin/page.tsx` will be updated to enforce this new authentication, and any legacy `next-auth` related admin authentication logic will be removed.

2.  **Admin Dashboard UI Integration:** The logic and components from Koji's `app/admin/dashboard/page.tsx` will be merged into Tsuya's `app/admin/page.tsx`. This integration will involve adapting Koji's UI elements to maintain consistency with Tsuya's existing styling and design principles.

3.  **Product Management (CRUD):** Full Create, Read, Update, and Delete (CRUD) functionalities for products will be implemented within the admin dashboard. These operations will leverage the `lib/supabase-helpers.ts` for interacting with the Supabase backend. A key feature will be the integration of image upload capabilities to Supabase Storage directly within the product management interface.

4.  **Order Management:** The admin dashboard will gain comprehensive order management features, including the ability to list all orders, view detailed order information, and update order statuses. These functionalities will also rely on `lib/supabase-helpers.ts` for data interaction.

5.  **Analytics and Reporting:** Koji's analytics features, encompassing sales data, inventory levels, and category performance, will be integrated into Tsuya's admin dashboard. This will involve utilizing `recharts` for data visualization, or adapting to any existing charting libraries present in Tsuya, to provide administrators with insightful reports.

6.  **Shipping Rate Management:** CRUD operations for managing shipping rates will be added to the admin dashboard. This will allow administrators to define and update shipping costs based on various criteria, using the `lib/supabase-helpers.ts` for backend interaction.

**Done Checklist for Phase 4:**

| Item | Status |
| :--- | :--- |
| Admin login page and password authentication implemented. | ☐ |
| Tsuya's admin page protected by the new authentication. | ☐ |
| Koji's admin dashboard features (product CRUD, order management, analytics, shipping rates) integrated into Tsuya's admin page. | ☐ |
| Product image upload to Supabase Storage functional from admin. | ☐ |
| Order status updates functional from admin. | ☐ |
| Analytics charts displaying data (even if mock initially). | ☐ |

### Phase 5: Email Notifications

This phase focuses on implementing automated email notifications to enhance the user experience and administrative efficiency. The objective is to send order confirmations to customers and new order alerts to the administrators using the Resend email platform.

**Key Tasks:**

1.  **Resend API Key Configuration:** The `RESEND_API_KEY` will be obtained from the Resend platform, and the `ORDER_NOTIFICATION_EMAIL` will be configured. These credentials will be added to Tsuya's `.env.local` file and set as environment variables in the Vercel deployment.

2.  **Email Utilities:** Koji's `lib/email.ts` file, which contains the `sendOrderNotificationEmail` and `sendOrderConfirmationEmail` functions, will be ported to Tsuya. These functions are responsible for generating and sending the respective email types.

3.  **Integrate Emails with Webhook:** The `app/api/webhooks/stripe/route.ts` will be modified to integrate the email sending functionality. Upon a successful payment event from Stripe, this webhook will trigger both `sendOrderConfirmationEmail` to the customer and `sendOrderNotificationEmail` to the designated administrator, ensuring timely communication.

**Done Checklist for Phase 5:**

| Item | Status |
| :--- | :--- |
| Resend API key and notification email configured. | ☐ |
| `lib/email.ts` implemented. | ☐ |
| Customer order confirmation emails sent automatically after successful payment. | ☐ |
| Admin new order notification emails sent automatically after successful payment. | ☐ |

### Phase 6: Deployment and Documentation

This final phase ensures that the integrated Tsuya project can be cleanly deployed on Vercel. It also includes updating all necessary documentation and providing a comprehensive launch checklist to guide future deployments and maintenance.

**Key Tasks:**

1.  **Environment Variable Documentation:** The `.env.local.example` file will be thoroughly updated to include all newly introduced environment variables related to Supabase, Stripe, and Resend. This provides a clear reference for developers setting up the project.

2.  **README Updates:** The main `README.md` file will be updated with detailed setup instructions for Supabase, Stripe, and the Vercel deployment process. This ensures that anyone working with the project can easily understand and configure the necessary services.

3.  **Vercel Deployment Configuration:** All environment variables will be verified and correctly configured within the Vercel dashboard for Production, Preview, and Development environments. A crucial step will be to ensure that the `npm run build` command executes successfully, indicating a clean and deployable application.

4.  **Launch Checklist:** A concise comprehensive launch checklist will be created to guide the final verification steps before the project goes live.

**Done Checklist for Phase 6:**

| Item | Status |
| :--- | :--- |
| `.env.local.example` updated with all new environment variables. | ☐ |
| `README.md` updated with Supabase, Stripe, and Vercel setup steps. | ☐ |
| All environment variables configured in Vercel for all environments. | ☐ |
| `npm run build` passes cleanly. | ☐ |
| Comprehensive launch checklist created. | ☐ |

### Phase 7: Final Review and Deliverables

This final phase involves a thorough review of the entire integration, ensuring all requirements are met, and compiling all necessary deliverables for the user.

**Key Tasks:**

1.  **Repo Parity Audit Review:** Review the initial parity audit and confirm all identified missing features have been addressed.
2.  **Code Changes Compilation:** Compile a file-by-file change list, including added, modified, and deleted files. For modified files, provide full updated code or unified diffs. For added files, provide full contents.
3.  **Database and Storage Setup Documentation:** Consolidate all Supabase SQL schema migrations, storage bucket setup instructions, and RLS policies into a clear, actionable document.
4.  **Stripe Integration Documentation:** Document the Stripe setup process, including environment variables, webhook configuration, and dashboard steps.
5.  **Vercel Deployment Documentation:** Provide clear instructions for Vercel deployment, including environment variable setup and build notes.
6.  **Test Checklist:** Finalize the test checklist for manual verification of all integrated features.
7.  **Comprehensive Integration Plan Document:** Compile all sections (Parity Audit, Implementation Plan, File Changes, Supabase Setup, Stripe Setup, Vercel Deployment, Test Checklist) into a single, well-structured Markdown document.

**Done Checklist for Phase 7:**

| Item | Status |
| :--- | :--- |
| Repo parity audit reviewed and confirmed. | ☐ |
| File-by-file change list compiled. | ☐ |
| Database and storage setup documentation completed. | ☐ |
| Stripe integration documentation completed. | ☐ |
| Vercel deployment documentation completed. | ☐ |
| Final test checklist created. | ☐ |
| Comprehensive integration plan document compiled and delivered. | ☐ |


# SUPABASE SETUP INSTRUCTIONS

This section provides detailed instructions for setting up the Supabase backend for the Tsuya project, including database schema migrations, storage bucket configuration, and Row Level Security (RLS) policies.

## 1. Supabase Project Initialization

1.  **Create a Project:** Log in to your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2.  **Obtain API Credentials:** Once the project is provisioned, navigate to **Settings** → **API** and copy the following values:
    *   **Project URL:** Set this as `NEXT_PUBLIC_SUPABASE_URL` in your `.env.local` and Vercel environment variables.
    *   **anon public key:** Set this as `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your `.env.local` and Vercel environment variables.

## 2. Database Schema Migrations

Execute the following SQL commands in the Supabase **SQL Editor** to create the necessary tables and indexes.

### Create Tables

```sql
-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  cost NUMERIC(10, 2),
  category TEXT NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  sizes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  taxes NUMERIC(10, 2) NOT NULL,
  shipping NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipping Rates table
CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(country_code)
);

-- Favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

### Create Indexes

```sql
-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_payment_intent_id ON orders(payment_intent_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_shipping_rates_country ON shipping_rates(country_code);
CREATE INDEX idx_favorites_user_product ON favorites(user_id, product_id);
```

## 3. Row Level Security (RLS) Policies

Enable RLS on all tables and configure the following policies to ensure secure data access.

### Enable RLS

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
```

### Configure Policies

```sql
-- Products Policies
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to products" ON products FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Categories Policies
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to categories" ON categories FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Orders Policies
CREATE POLICY "Allow orders insert for checkout" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin full access to orders" ON orders FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Shipping Rates Policies
CREATE POLICY "Allow public read shipping_rates" ON shipping_rates FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to shipping_rates" ON shipping_rates FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Favorites Policies
CREATE POLICY "Allow user to view their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user to insert their own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user to delete their own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);
```

## 4. Supabase Storage Configuration

1.  **Create Bucket:** In the Supabase Dashboard, navigate to **Storage** and create a new bucket named `product-images`.
2.  **Set Public Access:** Ensure the bucket is marked as **Public**.
3.  **Configure Storage Policies:**
    *   **Select Policy:** Allow public read access to all files in the `product-images` bucket.
    *   **Insert/Update/Delete Policy:** Restrict these operations to authenticated users (administrators) only.

## 5. Environment Variables

Ensure the following variables are correctly set in your `.env.local` and Vercel project settings:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

Replace `your-project-id` and `your-anon-public-key-here` with the actual values from your Supabase project settings.

# FILE-BY-FILE CHANGE LIST

This section details all the file additions, modifications, and deletions required to integrate Koji's features into the Tsuya project.

## Added Files

| File Path | Description |
| :--- | :--- |
| `/lib/supabase-client.ts` | Initializes the Supabase client for database and storage interaction. |
| `/lib/supabase-helpers.ts` | Contains helper functions for Supabase operations (products, orders, shipping). |
| `/lib/cart-context.tsx` | Implements the shopping cart context with localStorage persistence. |
| `/lib/favorites-context.tsx` | Implements the favorites context with localStorage persistence. |
| `/lib/stripe.ts` | Server-side utilities for Stripe PaymentIntents and webhook verification. |
| `/lib/email.ts` | Utilities for sending order confirmation and notification emails via Resend. |
| `/app/cart/page.tsx` | The shopping cart page UI. |
| `/app/favorites/page.tsx` | The favorites page UI. |
| `/app/checkout/page.tsx` | The checkout page UI, including Stripe Elements integration. |
| `/app/admin/login/page.tsx` | Simple password-based admin login page. |
| `/app/api/admin/auth/route.ts` | API route for admin password verification. |
| `/app/api/payments/create-intent/route.ts` | API route to create a Stripe PaymentIntent. |
| `/app/api/payments/update-intent/route.ts` | API route to update a Stripe PaymentIntent with order metadata. |
| `/app/api/webhooks/stripe/route.ts` | Stripe webhook handler for processing payment events. |
| `/app/api/shipping/rates/route.ts` | API route to fetch shipping rates from Supabase. |

## Modified Files

| File Path | Change Description |
| :--- | :--- |
| `/package.json` | Add dependencies: `@supabase/supabase-js`, `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`, `resend`. Remove legacy dependencies. |
| `/lib/products.ts` | Update to fetch product data from Supabase instead of local JSON storage. |
| `/components/navbar.tsx` | Integrate cart and favorites icons/counts; update admin link. |
| `/app/layout.tsx` | Wrap application with `CartProvider` and `FavoritesProvider`. |
| `/app/admin/page.tsx` | Merge Koji's admin dashboard features (CRUD, orders, analytics) and enforce password auth. |
| `/app/api/products/route.ts` | Update to handle product CRUD via Supabase. |
| `/app/api/products/[id]/route.ts` | Update to handle single product operations via Supabase. |
| `/app/api/upload/route.ts` | Update to handle image uploads to Supabase Storage. |
| `/app/thank-you/page.tsx` | Update to display order summary and "Continue Shopping" button. |
| `/components/navbar-wrapper.tsx` | Update to handle the new admin authentication state. |
| `/auth.ts` | Reconfigure or remove legacy `next-auth` logic in favor of simple admin auth. |
| `/.env.local.example` | Add all new environment variables for Supabase, Stripe, and Resend. |
| `/README.md` | Update with new setup and deployment instructions. |

## Deleted Files

| File Path | Reason for Deletion |
| :--- | :--- |
| `/lib/product-storage.ts` | Replaced by Supabase backend and `lib/supabase-helpers.ts`. |
| `/sanity.config.ts` | Sanity CMS is no longer used. |
| `/sanity/` (directory) | Sanity CMS configuration and schemas are no longer used. |
| `/data/products.json` | Data migrated to Supabase database. |

# STRIPE SETUP INSTRUCTIONS

This section provides a step-by-step guide for setting up Stripe payment integration for the Tsuya project.

## 1. Stripe Account Configuration

1.  **Create an Account:** If you don't have one, sign up for a [Stripe account](https://stripe.com).
2.  **Obtain API Keys:** Navigate to the **Developers** → **API keys** section in your Stripe Dashboard.
    *   **Publishable key:** Copy this and set it as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
    *   **Secret key:** Copy this and set it as `STRIPE_SECRET_KEY`.
    *   *Note: Use test keys (`pk_test_...`, `sk_test_...`) for development and live keys for production.*

## 2. Webhook Configuration

Webhooks are essential for receiving real-time notifications from Stripe about payment events.

### Local Development (using Stripe CLI)

1.  **Install Stripe CLI:** Follow the instructions on the [Stripe CLI documentation](https://stripe.com/docs/stripe-cli) to install the CLI for your operating system.
2.  **Login:** Run `stripe login` in your terminal.
3.  **Forward Webhooks:** Run the following command to forward webhooks to your local development server:
    ```bash
    stripe listen --forward-to localhost:3000/api/webhooks/stripe
    ```
4.  **Obtain Webhook Secret:** The command above will output a webhook signing secret (starting with `whsec_`). Copy this and set it as `STRIPE_WEBHOOK_SECRET` in your `.env.local` file.

### Production (Deployed Site)

1.  **Add Endpoint:** In the Stripe Dashboard, navigate to **Developers** → **Webhooks** and click **Add endpoint**.
2.  **Configure URL:** Enter your production webhook URL: `https://yourdomain.com/api/webhooks/stripe`.
3.  **Select Events:** Choose the following events to listen for:
    *   `payment_intent.succeeded`
    *   `payment_intent.payment_failed`
4.  **Obtain Signing Secret:** Once the endpoint is created, click on it to reveal the **Signing secret**. Copy this and set it as `STRIPE_WEBHOOK_SECRET` in your Vercel environment variables.

## 3. Environment Variables

Ensure the following variables are correctly configured in your environment:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 4. Testing the Integration

1.  **Use Test Cards:** When testing in development mode, use Stripe's [test card numbers](https://stripe.com/docs/testing#cards) (e.g., `4242 4242 4242 4242` for a successful payment).
2.  **Verify Webhook Events:** Check the **Developers** → **Webhooks** section in the Stripe Dashboard to monitor incoming events and ensure they are being processed correctly by your server.
3.  **Check Order Status:** After a successful test payment, verify that the order status in your Supabase database has been updated to `processing`.

# DEPLOYMENT AND TEST CHECKLIST

This document provides a comprehensive checklist for deploying the integrated Tsuya project on Vercel and performing final manual verification of all features. The aim is to ensure a smooth transition to production and validate the complete functionality of the integrated system.

## 1. Vercel Deployment Readiness

Before initiating deployment to a production environment, it is crucial to confirm that all prerequisites are met. This section outlines the key areas that require verification to ensure a successful and stable deployment on Vercel.

### Environment Variable Configuration

All necessary environment variables must be accurately configured within the Vercel project settings. These variables are critical for connecting to external services such as Supabase, Stripe, and Resend. The following table lists the essential environment variables that need to be set for the **Production**, **Preview**, and **Development** environments:

| Environment Variable | Description |
| :------------------- | :---------- |
| `NEXT_PUBLIC_SUPABASE_URL` | The URL of your Supabase project. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The anonymous public key for your Supabase project. |
| `ADMIN_PASSWORD` | The secure password for accessing the admin dashboard. |
| `STRIPE_SECRET_KEY` | Your Stripe secret key (use live key for production). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key (use live key for production). |
| `STRIPE_WEBHOOK_SECRET` | The secret for verifying Stripe webhook signatures. |
| `RESEND_API_KEY` | Your API key for the Resend email service. |
| `ORDER_NOTIFICATION_EMAIL` | The email address to receive new order notifications. |

### Build and Dependency Verification

Prior to deployment, a local build verification is essential. Executing `npm run build` locally should complete without any errors, indicating that the application is ready for compilation. Furthermore, a thorough check of the `package.json` file is required to ensure that all newly introduced dependencies, such as `@supabase/supabase-js`, `stripe`, and `resend`, are correctly listed. This prevents deployment failures due to missing packages.

### External Service Configurations

Proper configuration of external services is paramount for the application's functionality. The production webhook endpoint for Stripe must be accurately configured within the Stripe Dashboard, and its corresponding signing secret needs to be updated in Vercel's environment variables. If a custom domain is utilized for email services via Resend, it is imperative to ensure that this domain has been successfully verified within the Resend dashboard.

## 2. Manual Test Checklist

Upon successful deployment, a series of manual tests should be conducted to comprehensively verify the functionality and feature parity of the integrated Tsuya project. This section outlines the key test scenarios across different functional areas.

### Core E-commerce Functionality

**Product Browsing and Display:** It is crucial to confirm that products are being correctly fetched from the Supabase backend and are displayed accurately on the shop page. This includes verifying product details, images, and pricing. 

**Shopping Cart Operations:** Users should be able to add multiple items to the cart, adjust quantities, and remove items without issues. A critical test involves verifying that the contents of the shopping cart persist across different browsing sessions, leveraging the implemented localStorage persistence. The cart item count displayed in the navigation bar should also accurately reflect the number of items in the cart.

**Favorites Management:** The ability to add products to a favorites list and remove them should be tested. Similar to the cart, favorited items must persist across page reloads. The dedicated favorites page should correctly display all saved items.

**Guest Checkout Process:** The entire guest checkout flow needs to be validated. This includes successfully entering shipping address and contact information. Verification should extend to ensuring that shipping rates are accurately calculated and applied during the checkout process.

**Payment Processing:** Utilizing a Stripe test card, a complete purchase transaction should be simulated. The system should successfully process the payment via Stripe PaymentIntents, and the user should be seamlessly redirected to the thank-you page upon completion. 

**Order Creation Verification:** Following a successful test payment, the Supabase `orders` table must be inspected to confirm that a new order record has been created. This record should contain all the correct order details, including the accurate payment status.

### Admin Dashboard Functionality

**Admin Authentication:** Access to the admin dashboard is secured via a dedicated login page at `/admin/login`. The authentication process, using the configured `ADMIN_PASSWORD`, must be thoroughly tested to ensure only authorized personnel can gain access.

**Product Management:** The full suite of Product CRUD (Create, Read, Update, Delete) operations within the admin dashboard requires validation. This includes successfully creating new products, uploading images to Supabase Storage, updating existing product details, and deleting products. All changes made in the admin panel should be immediately reflected on the public-facing shop page.

**Order Management:** Administrators should be able to view a comprehensive list of all orders, access detailed information for each order, and update order statuses (e.g., from 'pending' to 'shipped').

**Analytics and Reporting:** The analytics charts integrated into the admin dashboard, covering sales, inventory, and category performance, should be reviewed to ensure they are displaying data accurately and meaningfully.

**Shipping Rate Management:** The CRUD operations for managing shipping rates within the admin settings need to be tested. This includes adding new shipping rates, modifying existing ones, and deleting obsolete rates, with verification that these changes are correctly applied during the checkout process.

### Email Notifications

**Customer Order Confirmation:** After a successful purchase, a confirmation email should be automatically sent to the customer's provided email address. The content and formatting of this email should be accurate and professional.

**Admin New Order Notification:** Concurrently, a new order notification email should be dispatched to the `ORDER_NOTIFICATION_EMAIL` configured for the administrator. This ensures timely awareness of new transactions.

## 3. Final Launch Steps

This section outlines the critical final steps to be taken before the integrated Tsuya project is officially launched to the public.

**Codebase Clean-up:** All `TODO` comments within the codebase should be addressed, and any `console.log` statements should be either removed or replaced with a more robust logging mechanism suitable for a production environment.

**Production Key Configuration:** A crucial step involves updating all Stripe and Resend API keys to their respective production versions within the Vercel environment variables. This ensures that live transactions and email communications are handled correctly.

**Domain and SSL Verification:** The custom domain for the project must be correctly configured and pointed to Vercel. Furthermore, it is essential to verify that the site is served securely over HTTPS with an active and valid SSL certificate.

**Performance and Monitoring:** Basic performance testing should be conducted to ensure optimal loading times and responsiveness. Additionally, error monitoring tools (e.g., Sentry, Vercel Analytics) should be configured to proactively identify and address any issues that may arise in production.

**Data Backup Strategy:** A robust backup strategy for the Supabase data must be established and verified. This is a critical measure to prevent data loss and ensure business continuity.

**Stakeholder Review:** A final comprehensive review of all integrated features by relevant stakeholders is recommended to ensure that all requirements and expectations have been met before the official launch.

# Deployment Guide for TSUYA NO UCHI

This guide covers various deployment options for the TSUYA NO UCHI e-commerce website.

## Table of Contents

- [Vercel Deployment](#vercel-deployment-recommended)
- [Netlify Deployment](#netlify-deployment)
- [Self-Hosted Deployment](#self-hosted-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Sanity Setup](#sanity-setup)
- [Domain Configuration](#domain-configuration)
- [Performance Optimization](#performance-optimization)

---

## Vercel Deployment (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jenozu/tsuyanouchi)

### Manual Deployment

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add required variables (see [Environment Variables](#environment-variables))

5. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Vercel Configuration

Create `vercel.json` (optional):

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SANITY_PROJECT_ID": "@sanity-project-id",
    "NEXT_PUBLIC_SANITY_DATASET": "@sanity-dataset"
  }
}
```

### Automatic Deployments

Connect your GitHub repository to Vercel for automatic deployments:
- Every push to `main` → Production deployment
- Every PR → Preview deployment

---

## Netlify Deployment

Deploy to Netlify with these steps:

### 1. Build Configuration

Create `netlify.toml`:

```toml
[build]
  command = "pnpm build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--prefix=/dev/null"
  PNPM_FLAGS = "--shamefully-hoist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### 3. Deploy via GitHub

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site"
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `pnpm build`
   - Publish directory: `.next`
5. Add environment variables
6. Deploy

---

## Self-Hosted Deployment

### Prerequisites

- Node.js 20+ installed
- PM2 or similar process manager
- Nginx (for reverse proxy)
- Domain name with DNS configured

### 1. Build the Application

```bash
# Clone and install
git clone https://github.com/jenozu/tsuyanouchi.git
cd tsuyanouchi
pnpm install

# Create environment file
nano .env.local
# Add your environment variables

# Build
pnpm build
```

### 2. Start with PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start pnpm --name "tsuya-no-uchi" -- start

# Configure PM2 to start on boot
pm2 startup
pm2 save
```

### 3. Nginx Configuration

Create `/etc/nginx/sites-available/tsuyanouchi`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/tsuyanouchi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

ENV NODE_ENV=production

# Copy built application
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["pnpm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SANITY_PROJECT_ID=${NEXT_PUBLIC_SANITY_PROJECT_ID}
      - NEXT_PUBLIC_SANITY_DATASET=${NEXT_PUBLIC_SANITY_DATASET}
      - SANITY_API_READ_TOKEN=${SANITY_API_READ_TOKEN}
    restart: unless-stopped
    volumes:
      - ./public:/app/public
```

### Build and Run

```bash
# Build image
docker build -t tsuyanouchi .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SANITY_PROJECT_ID=your_id \
  -e NEXT_PUBLIC_SANITY_DATASET=production \
  tsuyanouchi

# Or use docker-compose
docker-compose up -d
```

---

## Environment Variables

### Required Variables

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz     # Get from sanity.io/manage
NEXT_PUBLIC_SANITY_DATASET=production        # Usually 'production'
```

### Optional Variables

```bash
# Sanity Read Token (for live preview and studio)
SANITY_API_READ_TOKEN=skxxxxxxxxxxxxxx      # Create at sanity.io/manage

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX              # Google Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=xxx         # Vercel Analytics
```

### How to Get Sanity Credentials

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Create a new project or select existing
3. Note your Project ID
4. For tokens: Settings → API → Add API token
   - Name: "Read Token"
   - Permissions: "Viewer"
   - Copy the token immediately

---

## Sanity Setup

### 1. Initialize Sanity (if not done)

```bash
npm install -g @sanity/cli
sanity init
```

### 2. Deploy Sanity Studio

The Sanity Studio is embedded at `/studio`. To deploy standalone:

```bash
cd sanity
sanity deploy
```

### 3. Add CORS Origins

In Sanity dashboard:
1. Go to Settings → API
2. Add your domain to CORS origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
   - `https://www.yourdomain.com` (production with www)

---

## Domain Configuration

### DNS Settings

Point your domain to your hosting:

**Vercel:**
- Add CNAME record: `www` → `cname.vercel-dns.com`
- Add A record: `@` → Vercel IP

**Netlify:**
- Add CNAME record: `www` → `[your-site].netlify.app`
- Add A record: `@` → Netlify Load Balancer IP

**Self-Hosted:**
- Add A record: `@` → Your server IP
- Add A record: `www` → Your server IP

### Custom Domain on Vercel

1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

---

## Performance Optimization

### 1. Image Optimization

Next.js automatically optimizes images. For Sanity images, use:

```typescript
import { urlFor } from '@/sanity/lib/image'

// In component
<Image 
  src={urlFor(product.image).width(800).quality(85).url()} 
  alt={product.title}
/>
```

### 2. Caching Strategy

Configure in `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  // Enable experimental features
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
```

### 3. Sanity CDN

For production, enable CDN in `sanity/lib/client.ts`:

```typescript
export const client = createClient({
  // ...
  useCdn: true, // Enable CDN for production
  apiVersion: '2024-01-01',
  perspective: 'published', // Only published content
})
```

### 4. Analytics

Add to `app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
        env:
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: ${{ secrets.SANITY_DATASET }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Monitoring & Maintenance

### Health Checks

Create `app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString() 
  })
}
```

### Error Monitoring

Consider integrating:
- [Sentry](https://sentry.io/) for error tracking
- [LogRocket](https://logrocket.com/) for session replay
- [Vercel Analytics](https://vercel.com/analytics) for performance

---

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next
pnpm install --force
pnpm build
```

### Environment Variable Issues

Ensure all variables are set in your deployment platform:
- Variables starting with `NEXT_PUBLIC_` must be set at build time
- Other variables can be set at runtime

### Sanity Connection Issues

1. Check CORS origins in Sanity dashboard
2. Verify project ID and dataset name
3. Ensure API token has correct permissions

---

## Security Checklist

- [ ] Environment variables are not committed to git
- [ ] CORS origins are properly configured in Sanity
- [ ] API tokens have minimum required permissions
- [ ] HTTPS is enabled (SSL certificate)
- [ ] Security headers are configured
- [ ] Content Security Policy (CSP) is set
- [ ] Rate limiting is implemented for API routes

---

## Rollback Strategy

### Vercel
- Go to Deployments tab
- Find previous successful deployment
- Click "..." → "Promote to Production"

### Self-Hosted
```bash
# Using PM2
pm2 stop tsuya-no-uchi
git checkout previous-commit-hash
pnpm install
pnpm build
pm2 restart tsuya-no-uchi
```

---

## Support

For deployment issues:
- Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- Consult [Sanity Deployment Guide](https://www.sanity.io/docs/deployment)
- Review platform-specific documentation

---

**Last Updated**: November 2025


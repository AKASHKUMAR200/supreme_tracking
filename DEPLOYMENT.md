# Deployment Guide

Complete guide to deploy your Supreme Temple Jewellery Tracker to production.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest option for Next.js apps with zero configuration.

#### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Code pushed to GitHub repository

#### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings

3. **Add Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

#### Auto-Deploy
Every push to `main` branch automatically deploys to production.

#### Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate auto-configured

---

### Option 2: Netlify

Great alternative with similar features to Vercel.

#### Steps

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

3. **Login to Netlify**
   ```bash
   netlify login
   ```

4. **Initialize Site**
   ```bash
   netlify init
   ```

5. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: (leave empty)

6. **Add Environment Variables**
   ```bash
   netlify env:set NEXT_PUBLIC_SUPABASE_URL "your_url"
   netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your_key"
   ```

7. **Deploy**
   ```bash
   netlify deploy --prod
   ```

#### Netlify.toml Configuration

Create `netlify.toml` in root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

---

### Option 3: Self-Hosted (VPS/Cloud)

Deploy on your own server (AWS, DigitalOcean, etc.)

#### Prerequisites
- Ubuntu 20.04+ server
- Node.js 18+ installed
- Nginx installed
- Domain name pointed to server

#### Steps

1. **SSH into Server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Create Environment File**
   ```bash
   nano .env.local
   ```
   Add your Supabase credentials and save.

6. **Build the App**
   ```bash
   npm run build
   ```

7. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   ```

8. **Start the App**
   ```bash
   pm2 start npm --name "jewellery-tracker" -- start
   pm2 save
   pm2 startup
   ```

9. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/jewellery-tracker
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

10. **Enable Site**
    ```bash
    sudo ln -s /etc/nginx/sites-available/jewellery-tracker /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

11. **Install SSL Certificate**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d yourdomain.com
    ```

---

### Option 4: Docker Deployment

Containerize your application for consistent deployment.

#### Dockerfile

Create `Dockerfile` in root:

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    restart: unless-stopped
```

#### Deploy with Docker

```bash
# Build image
docker build -t jewellery-tracker .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  jewellery-tracker

# Or use docker-compose
docker-compose up -d
```

---

## 🔧 Post-Deployment Configuration

### 1. Update Supabase Settings

In Supabase Dashboard → Authentication → URL Configuration:
- Add your production URL to allowed redirect URLs
- Update site URL to your domain

### 2. Configure CORS

In Supabase Dashboard → Settings → API:
- Add your production domain to allowed origins

### 3. Update Storage Policies

Ensure storage buckets allow public access from your domain.

### 4. Enable Production Mode

Verify `NODE_ENV=production` is set.

### 5. Set Up Monitoring

#### Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🔒 Security Checklist

- [ ] Environment variables not committed to Git
- [ ] HTTPS enabled (SSL certificate)
- [ ] Supabase RLS policies enabled
- [ ] Storage buckets properly configured
- [ ] CORS settings restricted to your domain
- [ ] API keys rotated if exposed
- [ ] Error messages don't expose sensitive data
- [ ] Rate limiting configured
- [ ] Backup strategy in place

---

## 📊 Performance Optimization

### 1. Enable Caching

In `next.config.js`:
```js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Enable SWC minification
  swcMinify: true,
  // Compress responses
  compress: true,
}
```

### 2. Configure CDN

For Vercel/Netlify, CDN is automatic.

For self-hosted, use Cloudflare:
1. Add site to Cloudflare
2. Update nameservers
3. Enable caching rules
4. Enable minification

### 3. Database Optimization

In Supabase:
- Enable connection pooling
- Add database indexes
- Configure query caching
- Monitor slow queries

---

## 🔄 CI/CD Pipeline

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
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📱 Mobile App (Optional)

### Convert to PWA

1. **Add Manifest**

Create `public/manifest.json`:
```json
{
  "name": "Supreme Temple Jewellery Tracker",
  "short_name": "Jewellery Tracker",
  "description": "Track your custom temple jewellery orders",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFF8DC",
  "theme_color": "#D4AF37",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. **Add to Layout**

In `app/layout.tsx`:
```tsx
export const metadata = {
  manifest: '/manifest.json',
  themeColor: '#D4AF37',
};
```

3. **Add Service Worker** (optional for offline support)

---

## 🧪 Testing in Production

### Checklist

- [ ] User login works
- [ ] Admin login works
- [ ] Order creation successful
- [ ] Photo upload works
- [ ] Chat messages send/receive
- [ ] Real-time updates working
- [ ] Mobile responsive
- [ ] All links functional
- [ ] SSL certificate valid
- [ ] Images loading correctly

### Load Testing

Use tools like:
- **Artillery**: `npm install -g artillery`
- **k6**: Load testing tool
- **Apache Bench**: Simple HTTP testing

---

## 🔍 Monitoring & Logging

### Error Tracking

#### Sentry Integration

```bash
npm install @sentry/nextjs
```

Configure in `sentry.client.config.js`:
```js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'your-sentry-dsn',
  tracesSampleRate: 1.0,
});
```

### Uptime Monitoring

Use services like:
- **UptimeRobot** (free)
- **Pingdom**
- **StatusCake**

### Analytics

- **Google Analytics**
- **Vercel Analytics**
- **Plausible** (privacy-friendly)

---

## 🔄 Backup Strategy

### Database Backups

Supabase automatically backs up daily. For manual backups:

```bash
# Export database
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup.sql

# Restore
psql -h db.xxxxx.supabase.co -U postgres -d postgres < backup.sql
```

### Storage Backups

Use Supabase CLI or API to download all files periodically.

---

## 📈 Scaling Considerations

### When to Scale

- More than 1000 concurrent users
- Database queries slowing down
- Storage approaching limits
- High bandwidth usage

### Scaling Options

1. **Upgrade Supabase Plan**: More resources
2. **Add CDN**: Cloudflare, AWS CloudFront
3. **Database Optimization**: Indexes, caching
4. **Load Balancing**: Multiple instances
5. **Caching Layer**: Redis for sessions

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: Build fails on Vercel
**Solution**: Check Node version matches local (18+)

**Issue**: Environment variables not working
**Solution**: Restart deployment after adding variables

**Issue**: Images not loading
**Solution**: Check Supabase storage bucket is public

**Issue**: Real-time not working
**Solution**: Verify WebSocket connections allowed

**Issue**: Slow page loads
**Solution**: Enable caching, optimize images

---

## ✅ Launch Checklist

- [ ] All features tested
- [ ] Mobile responsive verified
- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] Database backed up
- [ ] Monitoring configured
- [ ] Error tracking enabled
- [ ] Analytics installed
- [ ] Documentation updated
- [ ] Team trained on admin panel
- [ ] Customer support ready
- [ ] Backup admin account created

---

## 🎉 You're Live!

Your Supreme Temple Jewellery Tracker is now in production. Monitor performance, gather user feedback, and iterate!

**Need help?** Check logs, monitoring dashboards, and documentation.

---

**Happy Deploying!** 🚀

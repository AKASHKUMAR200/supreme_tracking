# Quick Start Guide

Get your Supreme Temple Jewellery Tracker up and running in 10 minutes!

## ⚡ Fast Setup

### 1. Install Dependencies (2 minutes)

```bash
npm install
```

### 2. Set Up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** and paste all SQL from `SUPABASE_SETUP.md`
4. Go to **Storage** and create 3 buckets:
   - `process-photos` (public)
   - `bills` (public)
   - `attachments` (public)
5. Go to **Database** → **Replication** and enable:
   - orders
   - process_updates
   - messages

### 3. Configure Environment (1 minute)

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from **Project Settings** → **API** in Supabase.

### 4. Run the App (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 First Login

### Admin Login
1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Mobile: `9999999999`
3. Password: `9999999999`

### Create Your First Customer
1. Click **"Add User"** in admin dashboard
2. Fill in customer details
3. Create order

### Customer Login
1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Use the mobile number you created
3. View order tracking

## 🎨 Key Features to Try

### As Admin:
- ✅ Update order stages
- ✅ Upload progress photos
- ✅ Add courier tracking
- ✅ Upload bills
- ✅ Chat with customers
- ✅ Toggle dark mode

### As Customer:
- ✅ View order progress
- ✅ See stage photos
- ✅ Download bills
- ✅ Track courier
- ✅ Chat with admin

## 🚀 Deploy to Production

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard.

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

## 📱 Mobile Testing

The app is fully responsive. Test on:
- Mobile browsers
- Tablet browsers
- Desktop browsers

## 🔧 Common Issues

**Issue**: White screen after login
**Fix**: Check browser console, verify Supabase credentials

**Issue**: Photos not uploading
**Fix**: Check storage buckets are public in Supabase

**Issue**: Chat not working
**Fix**: Enable Realtime in Supabase project settings

## 📚 Next Steps

1. Read full `README.md` for detailed features
2. Check `SUPABASE_SETUP.md` for database details
3. Customize colors in `tailwind.config.js`
4. Add your branding and logo

## 🎉 You're Ready!

Your temple jewellery tracking system is now live. Start adding customers and managing orders!

---

**Need help?** Check the full documentation in README.md

# 🚀 Get Started Now!

Welcome to **Supreme Temple Jewellery Tracker**! Follow these steps to get your application running.

---

## ⚡ Quick Setup (10 Minutes)

### Step 1: Install Dependencies (2 min)

Open your terminal in this directory and run:

```bash
npm install
```

This will install all required packages.

---

### Step 2: Set Up Supabase (5 min)

1. **Create Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for free
   - Create a new project
   - Wait for provisioning (~2 minutes)

2. **Set Up Database**
   - Open your Supabase project
   - Go to **SQL Editor**
   - Copy ALL SQL commands from `SUPABASE_SETUP.md`
   - Paste and run them
   - Verify all tables are created

3. **Create Storage Buckets**
   - Go to **Storage** in Supabase
   - Create 3 public buckets:
     - `process-photos`
     - `bills`
     - `attachments`

4. **Enable Realtime**
   - Go to **Database** → **Replication**
   - Enable for: `orders`, `process_updates`, `messages`

---

### Step 3: Configure Environment (1 min)

1. **Get API Credentials**
   - In Supabase, go to **Settings** → **API**
   - Copy your **Project URL**
   - Copy your **anon public** key

2. **Create Environment File**
   - Rename `.env.local.example` to `.env.local`
   - Or create new file `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values!

---

### Step 4: Run the Application (1 min)

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

---

## 🎯 First Login

### Admin Access

1. Go to: **http://localhost:3000/admin/login**
2. Login with:
   - **Mobile**: `9999999999`
   - **Password**: `9999999999`

### Create Your First Customer

1. In admin dashboard, click **"Add User"**
2. Fill in:
   - Customer Name: `Test Customer`
   - Mobile: `1234567890`
   - Password: `1234567890`
   - Product: `Gold Temple Necklace`
3. Click **"Create User & Order"**

### Customer Login

1. Go to: **http://localhost:3000/login**
2. Login with:
   - **Mobile**: `1234567890`
   - **Password**: `1234567890`
3. View the order dashboard!

---

## 🎨 Try These Features

### As Admin:
1. ✅ Update order to Stage 2
2. ✅ Upload a photo for Stage 1
3. ✅ Add courier tracking details
4. ✅ Upload an advance bill
5. ✅ Send a chat message to customer
6. ✅ Toggle dark mode

### As Customer:
1. ✅ View order progress
2. ✅ See uploaded photos
3. ✅ Download bills
4. ✅ Reply to admin chat
5. ✅ Check courier tracking

---

## 📚 Documentation Guide

### New to the Project?
Start here: **README.md**

### Want Quick Setup?
Read: **QUICK_START.md**

### Setting Up Database?
Follow: **SUPABASE_SETUP.md**

### Deploying to Production?
Check: **DEPLOYMENT.md**

### Want Feature Details?
See: **FEATURES.md**

### Project Overview?
Read: **PROJECT_SUMMARY.md**

---

## 🔧 Troubleshooting

### Issue: npm install fails
**Solution**: 
- Ensure Node.js 18+ is installed
- Run: `node --version` to check
- Update if needed

### Issue: Can't connect to Supabase
**Solution**:
- Check `.env.local` file exists
- Verify credentials are correct
- Restart dev server: `npm run dev`

### Issue: Tables not found
**Solution**:
- Run all SQL from `SUPABASE_SETUP.md`
- Check Supabase SQL Editor for errors
- Verify tables exist in Database section

### Issue: Photos not uploading
**Solution**:
- Check storage buckets are created
- Ensure buckets are set to public
- Verify bucket names match code

### Issue: Real-time not working
**Solution**:
- Enable Realtime in Supabase settings
- Enable replication for tables
- Check browser console for errors

---

## 🎓 Learning Path

### Day 1: Setup & Basics
- [ ] Install and run locally
- [ ] Create admin account
- [ ] Add first customer
- [ ] Test basic features

### Day 2: Explore Features
- [ ] Try all admin features
- [ ] Test customer dashboard
- [ ] Upload photos and bills
- [ ] Use chat functionality

### Day 3: Customization
- [ ] Change color theme
- [ ] Update branding
- [ ] Modify stage names
- [ ] Add custom fields

### Day 4: Deployment
- [ ] Choose hosting platform
- [ ] Set up production database
- [ ] Deploy application
- [ ] Test in production

---

## 🚀 Deployment Options

### Easiest: Vercel (Recommended)
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

**Time**: 5 minutes

### Alternative: Netlify
1. Build project
2. Deploy with Netlify CLI
3. Configure environment
4. Go live!

**Time**: 10 minutes

### Advanced: Self-Hosted
1. Set up VPS
2. Install dependencies
3. Configure Nginx
4. Deploy with PM2

**Time**: 30 minutes

See **DEPLOYMENT.md** for detailed guides.

---

## 📞 Need Help?

### Resources
- **Documentation**: All MD files in this folder
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind Docs**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

### Common Questions

**Q: Can I use a different database?**
A: The app is built for Supabase, but you can adapt it to other PostgreSQL databases.

**Q: Is this production-ready?**
A: Yes! Includes security, optimization, and deployment guides.

**Q: Can I customize the design?**
A: Absolutely! Edit `tailwind.config.js` for colors and `globals.css` for styles.

**Q: How do I add more stages?**
A: Edit `lib/constants.ts` and update the database schema.

**Q: Can I add email notifications?**
A: Yes! Integrate an email service like SendGrid or Resend.

---

## ✅ Checklist

Before you start:
- [ ] Node.js 18+ installed
- [ ] Supabase account created
- [ ] Git installed (for deployment)
- [ ] Code editor ready (VS Code recommended)

After setup:
- [ ] Dependencies installed
- [ ] Supabase configured
- [ ] Environment variables set
- [ ] App running locally
- [ ] Admin login works
- [ ] Customer created
- [ ] Features tested

---

## 🎉 You're All Set!

Your Supreme Temple Jewellery Tracker is ready to use!

### What's Next?

1. **Customize**: Update colors, branding, and text
2. **Add Data**: Create real customers and orders
3. **Test**: Try all features thoroughly
4. **Deploy**: Go live with Vercel or Netlify
5. **Launch**: Start tracking real orders!

---

## 🌟 Pro Tips

1. **Backup Regularly**: Export Supabase data weekly
2. **Monitor Usage**: Check Supabase dashboard for limits
3. **Update Dependencies**: Run `npm update` monthly
4. **Test Mobile**: Always test on real mobile devices
5. **Get Feedback**: Ask users for improvement ideas

---

## 📈 Growth Path

### Phase 1: Launch (Week 1)
- Set up and deploy
- Add first 10 customers
- Gather initial feedback

### Phase 2: Optimize (Week 2-4)
- Fix any issues
- Improve based on feedback
- Add custom features

### Phase 3: Scale (Month 2+)
- Upgrade Supabase plan if needed
- Add analytics
- Implement notifications
- Expand features

---

## 🎯 Success Metrics

Track these to measure success:
- Number of active orders
- Customer satisfaction
- Admin efficiency
- Response time
- Order completion rate

---

**Ready to build something amazing?** 🚀

Start with: `npm install` and follow the steps above!

---

**Questions?** Check the documentation files or create an issue on GitHub.

**Happy Tracking!** ✨

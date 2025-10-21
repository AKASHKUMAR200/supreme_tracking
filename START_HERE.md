# 🚀 START HERE - MongoDB Version

## Welcome to Supreme Temple Jewellery Tracker!

This application has been **fully migrated from Supabase to MongoDB**. Follow these steps to get started.

---

## ⚡ Quick Start (5 Steps)

### **Step 1: Install Dependencies** (2 minutes)
```bash
npm install
```

### **Step 2: Set Up MongoDB** (5 minutes)

**Option A: MongoDB Atlas (Recommended)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Create database user
5. Get connection string

**Option B: Local MongoDB**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### **Step 3: Configure Environment** (1 minute)
Create `.env.local` file:
```env
MONGODB_URI=mongodb://localhost:27017/temple-jewellery
UPLOAD_DIR=./public/uploads
```

### **Step 4: Create Directories** (30 seconds)
```bash
mkdir -p public/uploads/process-photos
mkdir -p public/uploads/bills
mkdir -p public/uploads/attachments
```

### **Step 5: Start App** (30 seconds)
```bash
npm run dev
```

Open: http://localhost:3000

---

## 👤 First Login

### **Create Admin User**

**Using MongoDB Compass (GUI):**
1. Connect to database
2. Select `temple-jewellery` database
3. Insert into `users` collection:
```json
{
  "name": "Admin",
  "mobile_number": "9999999999",
  "password": "9999999999",
  "role": "admin",
  "created_at": {"$date": "2024-01-01T00:00:00.000Z"}
}
```

**Using MongoDB Shell:**
```javascript
use temple-jewellery
db.users.insertOne({
  name: "Admin",
  mobile_number: "9999999999",
  password: "9999999999",
  role: "admin",
  created_at: new Date()
})
```

**Using API (after app starts):**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","mobile_number":"9999999999","password":"9999999999","role":"admin"}'
```

### **Login**
- URL: http://localhost:3000/admin/login
- Mobile: `9999999999`
- Password: `9999999999`

---

## 📚 Documentation Guide

### **For Setup:**
1. **START_HERE.md** ← You are here!
2. **MONGODB_SETUP.md** - Detailed MongoDB setup
3. **QUICK_REFERENCE.md** - Commands and API reference

### **For Understanding:**
1. **README.md** - Project overview
2. **FEATURES.md** - All features explained
3. **COMPLETE_MIGRATION_SUMMARY.md** - Migration details

### **For Deployment:**
1. **DEPLOYMENT.md** - Production deployment
2. **MIGRATION_GUIDE.md** - Technical details

---

## ✅ Verification Steps

After setup, verify everything works:

1. **MongoDB Running**
   ```bash
   # Check connection
   mongosh "mongodb://localhost:27017/temple-jewellery"
   ```

2. **Dependencies Installed**
   ```bash
   # Should show no errors
   npm list
   ```

3. **Environment Configured**
   ```bash
   # Check file exists
   cat .env.local
   ```

4. **Directories Created**
   ```bash
   # Should list 3 directories
   ls -la public/uploads/
   ```

5. **App Starts**
   ```bash
   # Should start on port 3000
   npm run dev
   ```

6. **Admin User Exists**
   ```javascript
   // In MongoDB shell
   db.users.findOne({role: "admin"})
   ```

7. **Login Works**
   - Go to http://localhost:3000/admin/login
   - Enter credentials
   - Should see admin dashboard

---

## 🎯 What's Different from Supabase?

| Feature | Supabase | MongoDB |
|---------|----------|---------|
| **Database** | PostgreSQL | MongoDB |
| **Real-time** | WebSockets | Polling (5s) |
| **Storage** | Cloud buckets | Local files |
| **Queries** | Direct client | API routes |
| **Auth** | Supabase Auth | Custom API |

---

## 🔧 Common Issues & Solutions

### **Issue: npm install fails**
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Issue: MongoDB connection error**
**Solution:**
- Check MongoDB is running
- Verify `MONGODB_URI` in `.env.local`
- For Atlas: Check network access settings

### **Issue: Upload directories not found**
**Solution:**
```bash
# Create all directories
mkdir -p public/uploads/process-photos
mkdir -p public/uploads/bills
mkdir -p public/uploads/attachments
```

### **Issue: TypeScript errors**
**Solution:**
```bash
# Install dependencies
npm install
# Restart IDE/editor
```

### **Issue: Port 3000 in use**
**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

---

## 🎓 Learning Path

### **Day 1: Setup & Basics**
1. Complete quick start above
2. Create admin user
3. Login to admin panel
4. Explore the interface

### **Day 2: Create First Order**
1. Click "Add User" in admin panel
2. Fill in customer details
3. Create order
4. Upload a photo to Stage 1

### **Day 3: Test Features**
1. Update order stage
2. Upload bill
3. Add courier tracking
4. Test chat functionality

### **Day 4: Customize**
1. Change colors in `tailwind.config.js`
2. Update stage names in `lib/constants.ts`
3. Modify UI components

### **Day 5: Deploy**
1. Choose hosting (Vercel/Netlify)
2. Set up production MongoDB
3. Deploy application
4. Test in production

---

## 📊 Project Structure

```
sts/
├── app/                    # Next.js pages
│   ├── api/               # API routes (MongoDB)
│   ├── admin/             # Admin panel
│   ├── dashboard/         # Customer dashboard
│   └── login/             # Login page
├── components/            # React components
├── lib/                   # Utilities
│   ├── mongodb.ts        # MongoDB connection
│   ├── models.ts         # Mongoose schemas
│   ├── auth.ts           # Authentication
│   └── constants.ts      # App constants
├── public/
│   └── uploads/          # File storage
├── .env.local            # Environment variables
└── package.json          # Dependencies
```

---

## 🌟 Key Features

- ✅ Mobile-based authentication
- ✅ 5-stage order tracking
- ✅ Smart photo visibility
- ✅ Real-time chat (polling)
- ✅ Bill management
- ✅ Courier tracking
- ✅ Admin panel
- ✅ Dark mode
- ✅ Responsive design
- ✅ File uploads

---

## 🆘 Need Help?

1. **Check Documentation**
   - README.md for overview
   - MONGODB_SETUP.md for setup
   - QUICK_REFERENCE.md for commands

2. **Check Logs**
   - Browser console for frontend errors
   - Terminal for backend errors
   - MongoDB logs for database issues

3. **Common Commands**
   ```bash
   # Restart app
   npm run dev

   # Check MongoDB
   mongosh

   # View logs
   npm run dev | tee app.log
   ```

---

## ✅ Ready Checklist

Before you start development:
- [ ] Node.js 18+ installed
- [ ] MongoDB installed or Atlas account created
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` configured
- [ ] Upload directories created
- [ ] Admin user created
- [ ] App starts successfully
- [ ] Can login to admin panel

---

## 🎉 You're Ready!

Your Supreme Temple Jewellery Tracker is set up and ready to use!

**Next Steps:**
1. Create your first customer
2. Create an order
3. Test all features
4. Customize as needed
5. Deploy to production

---

## 📞 Quick Links

- **Admin Login**: http://localhost:3000/admin/login
- **Customer Login**: http://localhost:3000/login
- **API Docs**: See QUICK_REFERENCE.md
- **MongoDB Docs**: https://docs.mongodb.com/

---

**Happy Coding!** 🚀

Built with MongoDB, Next.js, and ❤️

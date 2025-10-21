# Quick Reference - MongoDB Version

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Create upload directories
mkdir -p public/uploads/process-photos public/uploads/bills public/uploads/attachments

# 3. Start MongoDB (if local)
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# 4. Start application
npm run dev
```

## 📝 Environment Variables (.env.local)

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/temple-jewellery

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/temple-jewellery?retryWrites=true&w=majority

# Upload directory
UPLOAD_DIR=./public/uploads
```

## 👤 Create Admin User

### MongoDB Shell
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

### API Call
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","mobile_number":"9999999999","password":"9999999999","role":"admin"}'
```

## 🔑 Default Login

**Admin:**
- URL: http://localhost:3000/admin/login
- Mobile: `9999999999`
- Password: `9999999999`

## 📊 MongoDB Collections

- `users` - User accounts
- `orders` - Order tracking
- `processupdates` - Stage progress
- `bills` - Payment receipts
- `messages` - Chat messages

## 🗂️ File Storage Locations

- Process photos: `public/uploads/process-photos/`
- Bills: `public/uploads/bills/`
- Attachments: `public/uploads/attachments/`

## 🔧 Common MongoDB Commands

```javascript
// Show all databases
show dbs

// Switch to database
use temple-jewellery

// Show collections
show collections

// Count documents
db.users.countDocuments()
db.orders.countDocuments()

// Find all users
db.users.find().pretty()

// Find admin users
db.users.find({role: "admin"}).pretty()

// Find orders for a user
db.orders.find({user_id: "USER_ID"}).pretty()

// Delete all data (careful!)
db.users.deleteMany({})
db.orders.deleteMany({})
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - List users
- `GET /api/users?role=admin` - List admins
- `POST /api/users` - Create user

### Orders
- `GET /api/orders` - List all orders
- `GET /api/orders?user_id=ID` - User's orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get single order
- `PUT /api/orders/[id]` - Update order

### Process Updates
- `GET /api/process-updates?order_id=ID` - Get updates
- `POST /api/process-updates` - Create update
- `PUT /api/process-updates` - Update status

### Bills
- `GET /api/bills?order_id=ID` - Get bills
- `POST /api/bills` - Upload bill

### Messages
- `GET /api/messages?sender_id=ID&receiver_id=ID` - Get messages
- `POST /api/messages` - Send message
- `PUT /api/messages` - Mark as read

### File Upload
- `POST /api/upload` - Upload file (multipart/form-data)

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
# Windows
net start MongoDB

# macOS
brew services list

# Linux
sudo systemctl status mongod
```

### Can't Create Upload Directories
```bash
# Windows PowerShell
New-Item -ItemType Directory -Force -Path public/uploads/process-photos
New-Item -ItemType Directory -Force -Path public/uploads/bills
New-Item -ItemType Directory -Force -Path public/uploads/attachments

# Unix/macOS/Linux
mkdir -p public/uploads/{process-photos,bills,attachments}
```

### TypeScript Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or just
npm install
```

### Port 3000 Already in Use
```bash
# Find and kill process
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

## 📚 Documentation Files

- `MONGODB_MIGRATION_SUMMARY.md` - Migration overview
- `MONGODB_SETUP.md` - Detailed setup guide
- `MIGRATION_GUIDE.md` - Technical migration details
- `README.md` - Main documentation
- `QUICK_REFERENCE.md` - This file

## ✅ Health Check

After setup, verify:
- [ ] MongoDB is running
- [ ] `.env.local` exists with MONGODB_URI
- [ ] Upload directories exist
- [ ] `npm install` completed
- [ ] App starts with `npm run dev`
- [ ] Admin user exists in database
- [ ] Can login at /admin/login
- [ ] Can create customer
- [ ] Can create order

## 🎯 Production Checklist

- [ ] Use MongoDB Atlas (not local)
- [ ] Strong database password
- [ ] Restrict network access (IP whitelist)
- [ ] Enable MongoDB authentication
- [ ] Use environment variables (not hardcoded)
- [ ] Set up automated backups
- [ ] Use cloud storage for files (S3, etc.)
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Enable HTTPS
- [ ] Monitor database performance

---

**Quick Reference Complete!** Keep this handy for common tasks.

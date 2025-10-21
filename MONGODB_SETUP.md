# MongoDB Setup Guide

Complete guide to set up MongoDB for the Supreme Temple Jewellery Tracker.

## 📋 Prerequisites

Choose one of these options:

### Option 1: MongoDB Atlas (Cloud - Recommended)
- Free tier available
- No installation needed
- Automatic backups
- Global deployment

### Option 2: Local MongoDB
- Full control
- No internet required for development
- Manual setup required

---

## 🌐 Option 1: MongoDB Atlas Setup (Recommended)

### Step 1: Create Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free"
3. Sign up with email or Google
4. Verify your email

### Step 2: Create Cluster

1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider (AWS/Google Cloud/Azure)
4. Choose a region close to you
5. Name your cluster (e.g., "temple-jewellery")
6. Click "Create"
7. Wait 3-5 minutes for provisioning

### Step 3: Create Database User

1. Go to **Database Access** (left sidebar)
2. Click "Add New Database User"
3. Choose **Password** authentication
4. Username: `admin` (or your choice)
5. Password: Generate secure password (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

### Step 4: Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your server's IP address
5. Click "Confirm"

### Step 5: Get Connection String

1. Go to **Database** (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string:
   ```
   mongodb+srv://admin:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<password>` with your actual password
8. Add database name: `temple-jewellery`
   ```
   mongodb+srv://admin:yourpassword@cluster.mongodb.net/temple-jewellery?retryWrites=true&w=majority
   ```

### Step 6: Configure Environment

Create `.env.local` in your project root:

```env
MONGODB_URI=mongodb+srv://admin:yourpassword@cluster.mongodb.net/temple-jewellery?retryWrites=true&w=majority
UPLOAD_DIR=./public/uploads
```

---

## 💻 Option 2: Local MongoDB Setup

### For Windows

1. **Download MongoDB**
   - Go to [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Select Windows
   - Download MSI installer

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Service: ✅ Yes
   - Install MongoDB Compass: ✅ Yes (GUI tool)

3. **Verify Installation**
   ```bash
   mongod --version
   ```

4. **Start MongoDB**
   - MongoDB should start automatically as a service
   - Or manually: `net start MongoDB`

5. **Configure Environment**
   ```env
   MONGODB_URI=mongodb://localhost:27017/temple-jewellery
   UPLOAD_DIR=./public/uploads
   ```

### For macOS

1. **Install with Homebrew**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community@7.0
   ```

2. **Start MongoDB**
   ```bash
   brew services start mongodb-community@7.0
   ```

3. **Verify Installation**
   ```bash
   mongosh --version
   ```

4. **Configure Environment**
   ```env
   MONGODB_URI=mongodb://localhost:27017/temple-jewellery
   UPLOAD_DIR=./public/uploads
   ```

### For Linux (Ubuntu/Debian)

1. **Import MongoDB GPG Key**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   ```

2. **Add MongoDB Repository**
   ```bash
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

3. **Install MongoDB**
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

4. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

5. **Verify Installation**
   ```bash
   mongosh --version
   ```

6. **Configure Environment**
   ```env
   MONGODB_URI=mongodb://localhost:27017/temple-jewellery
   UPLOAD_DIR=./public/uploads
   ```

---

## 🗄️ Initialize Database

The application will automatically create collections when you first use them. However, you can manually create them:

### Using MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Connect to your database
3. Create database: `temple-jewellery`
4. Collections will be created automatically by the app

### Using MongoDB Shell

```bash
# Connect to MongoDB
mongosh "mongodb://localhost:27017"

# Or for Atlas
mongosh "mongodb+srv://admin:password@cluster.mongodb.net/temple-jewellery"

# Switch to database
use temple-jewellery

# Collections will be created automatically
# But you can verify with:
show collections
```

---

## 👤 Create Admin User

After starting your application, create an admin user:

### Option 1: Using MongoDB Compass

1. Connect to your database
2. Select `temple-jewellery` database
3. Select `users` collection
4. Click "Add Data" → "Insert Document"
5. Paste this JSON:
   ```json
   {
     "name": "Admin",
     "mobile_number": "9999999999",
     "password": "9999999999",
     "role": "admin",
     "created_at": {"$date": "2024-01-01T00:00:00.000Z"}
   }
   ```
6. Click "Insert"

### Option 2: Using MongoDB Shell

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

### Option 3: Using API (after app is running)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "mobile_number": "9999999999",
    "password": "9999999999",
    "role": "admin"
  }'
```

---

## 📁 File Upload Setup

Since we're not using Supabase Storage, files will be stored locally:

### Create Upload Directory

```bash
# In your project root
mkdir -p public/uploads/process-photos
mkdir -p public/uploads/bills
mkdir -p public/uploads/attachments
```

### Update .gitignore

Add to `.gitignore`:
```
# Uploads
public/uploads/*
!public/uploads/.gitkeep
```

Create `.gitkeep` files:
```bash
touch public/uploads/process-photos/.gitkeep
touch public/uploads/bills/.gitkeep
touch public/uploads/attachments/.gitkeep
```

---

## 🔧 Database Indexes (Optional but Recommended)

For better performance, create indexes:

```javascript
use temple-jewellery

// Users indexes
db.users.createIndex({ mobile_number: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// Orders indexes
db.orders.createIndex({ user_id: 1 })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ created_at: -1 })

// Process updates indexes
db.processupdates.createIndex({ order_id: 1, stage_number: 1 }, { unique: true })

// Bills indexes
db.bills.createIndex({ order_id: 1 })

// Messages indexes
db.messages.createIndex({ sender_id: 1, receiver_id: 1 })
db.messages.createIndex({ timestamp: -1 })
db.messages.createIndex({ read: 1 })
```

---

## ✅ Verification Checklist

- [ ] MongoDB installed or Atlas cluster created
- [ ] Database user created (Atlas only)
- [ ] Network access configured (Atlas only)
- [ ] Connection string obtained
- [ ] `.env.local` file created with MONGODB_URI
- [ ] Upload directories created
- [ ] Admin user created
- [ ] Application can connect to database

---

## 🧪 Test Your Setup

### 1. Test MongoDB Connection

Create a test file `test-db.js`:

```javascript
const { MongoClient } = require('mongodb');

const uri = 'your-mongodb-uri-here';
const client = new MongoClient(uri);

async function test() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB!');
    
    const db = client.db('temple-jewellery');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await client.close();
  }
}

test();
```

Run: `node test-db.js`

### 2. Test Application

```bash
npm install
npm run dev
```

Visit: http://localhost:3000/admin/login

Login with:
- Mobile: `9999999999`
- Password: `9999999999`

---

## 🔐 Security Best Practices

### For Production

1. **Use Strong Passwords**
   - Generate complex passwords for database users
   - Never use default passwords

2. **Restrict Network Access**
   - Only allow specific IP addresses
   - Use VPN for remote access

3. **Enable Authentication**
   - Always require username/password
   - Use connection string with credentials

4. **Use Environment Variables**
   - Never commit `.env.local` to Git
   - Use different credentials for dev/prod

5. **Regular Backups**
   - Atlas: Automatic backups enabled
   - Local: Set up mongodump cron jobs

---

## 📊 MongoDB Atlas Features

### Monitoring

1. Go to **Metrics** tab
2. View:
   - Operations per second
   - Network traffic
   - Connections
   - Memory usage

### Backups

1. Go to **Backup** tab
2. Atlas provides:
   - Continuous backups
   - Point-in-time recovery
   - Snapshot downloads

### Performance

1. Go to **Performance Advisor**
2. Get recommendations for:
   - Index creation
   - Query optimization
   - Schema design

---

## 🔄 Migration from Supabase

If you had data in Supabase:

### Export from Supabase

```sql
-- Export users
COPY (SELECT * FROM users) TO '/tmp/users.csv' CSV HEADER;

-- Export orders
COPY (SELECT * FROM orders) TO '/tmp/orders.csv' CSV HEADER;

-- Repeat for other tables
```

### Import to MongoDB

```javascript
// Use a migration script or manually insert data
const data = require('./users.json');

db.users.insertMany(data.map(user => ({
  name: user.name,
  mobile_number: user.mobile_number,
  password: user.password,
  role: user.role,
  created_at: new Date(user.created_at)
})));
```

---

## 🆘 Troubleshooting

### Connection Issues

**Error**: `MongoServerError: bad auth`
**Solution**: Check username and password in connection string

**Error**: `MongoNetworkError: connection timeout`
**Solution**: 
- Check network access settings (Atlas)
- Verify MongoDB is running (local)
- Check firewall settings

**Error**: `ECONNREFUSED`
**Solution**: MongoDB service not running
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Application Issues

**Error**: `Cannot find module 'mongoose'`
**Solution**: Run `npm install`

**Error**: `MONGODB_URI is not defined`
**Solution**: Create `.env.local` file with connection string

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University](https://university.mongodb.com/) - Free courses

---

## 🎉 Setup Complete!

Your MongoDB database is now ready for the Supreme Temple Jewellery Tracker!

**Next Steps:**
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the application
3. Create your first customer and order

---

**Need Help?** Check the troubleshooting section or MongoDB documentation.

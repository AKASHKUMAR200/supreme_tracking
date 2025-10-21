# Create Test Users

## Problem:
Login is failing because MongoDB connection is not working.

## Solutions:

### Option 1: Fix MongoDB Connection

1. **Go to MongoDB Atlas:**
   - Visit: https://cloud.mongodb.com
   - Login to your account

2. **Whitelist Your IP:**
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

3. **Get Your Connection String:**
   - Click "Database" in left sidebar
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

4. **Update .env.local:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jewellery_tracker?retryWrites=true&w=majority
   ```

### Option 2: Create Test Users via MongoDB Atlas

1. **Go to MongoDB Atlas**
2. **Click "Browse Collections"**
3. **Select your database**
4. **Click "users" collection**
5. **Click "Insert Document"**

**Admin User:**
```json
{
  "name": "Admin",
  "mobile_number": "1234567890",
  "password": "admin123",
  "role": "admin",
  "created_at": {"$date": "2025-01-01T00:00:00.000Z"}
}
```

**Customer User:**
```json
{
  "name": "Test Customer",
  "mobile_number": "9876543210",
  "password": "customer123",
  "role": "customer",
  "created_at": {"$date": "2025-01-01T00:00:00.000Z"}
}
```

### Test Credentials:

**Admin Login:**
- Mobile: `1234567890`
- Password: `admin123`

**Customer Login:**
- Mobile: `9876543210`
- Password: `customer123`

---

## Quick Checklist:

- [ ] MongoDB Atlas account is active
- [ ] IP is whitelisted (0.0.0.0/0)
- [ ] .env.local file exists with MONGODB_URI
- [ ] Connection string has correct password
- [ ] Test users are created in database
- [ ] Internet connection is working

---

## Still Not Working?

**Check the server logs:**
The error shows: `ENOTFOUND ac-xaefmqk-shard-00-00.tsr9t0z.mongodb.net`

This means:
1. ❌ MongoDB cluster is not reachable
2. ❌ DNS cannot resolve the hostname
3. ❌ Network/firewall blocking connection

**Solutions:**
1. Restart your MongoDB cluster
2. Check your internet connection
3. Try a different network
4. Contact MongoDB support if cluster is down

---

**After fixing MongoDB connection, restart the dev server:**
```bash
npm run dev
```

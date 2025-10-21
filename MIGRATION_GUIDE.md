# Migration Guide: Supabase to MongoDB

This guide explains the changes made to migrate from Supabase to MongoDB.

## 🔄 What Changed

### 1. Database Layer

**Before (Supabase):**
- PostgreSQL database
- Supabase client SDK
- Real-time subscriptions via WebSockets
- Row Level Security (RLS)

**After (MongoDB):**
- MongoDB database
- Mongoose ODM
- API routes for data operations
- Application-level security

### 2. File Storage

**Before (Supabase Storage):**
- Cloud storage buckets
- Public URLs from Supabase CDN
- Built-in file management

**After (Local Storage):**
- Files stored in `public/uploads/`
- Served via Next.js static files
- Manual file management

### 3. Real-time Features

**Before:**
- Supabase Realtime (WebSocket)
- Automatic updates

**After:**
- Polling mechanism (can be upgraded to Socket.io)
- Manual refresh or polling intervals

---

## 📦 New Dependencies

### Added:
- `mongodb` - MongoDB driver
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing (optional)
- `socket.io` - Real-time (optional)
- `multer` - File uploads (optional)

### Removed:
- `@supabase/supabase-js`

---

## 🗂️ File Structure Changes

### New Files:
```
lib/
  mongodb.ts          # MongoDB connection
  models.ts           # Mongoose schemas
app/api/
  auth/login/route.ts # Authentication
  users/route.ts      # User CRUD
  orders/route.ts     # Order CRUD
  orders/[id]/route.ts # Single order
  process-updates/route.ts # Process updates
  bills/route.ts      # Bills
  messages/route.ts   # Messages
  upload/route.ts     # File upload
```

### Modified Files:
```
lib/
  supabase.ts         # Now contains type definitions and API helpers
  auth.ts             # Updated to use API routes
.env.local.example    # MongoDB connection string
package.json          # Updated dependencies
```

---

## 🔧 API Changes

### Authentication

**Before:**
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('mobile_number', mobileNumber)
  .single();
```

**After:**
```typescript
const response = await api.post('/auth/login', {
  mobile_number: mobileNumber,
  password,
});
```

### Fetching Data

**Before:**
```typescript
const { data } = await supabase
  .from('orders')
  .select('*')
  .eq('user_id', userId);
```

**After:**
```typescript
const response = await api.get(`/orders?user_id=${userId}`);
const orders = response.data;
```

### Creating Data

**Before:**
```typescript
const { data } = await supabase
  .from('orders')
  .insert({ user_id, product_name })
  .select()
  .single();
```

**After:**
```typescript
const response = await api.post('/orders', {
  user_id,
  product_name,
});
const order = response.data;
```

### Updating Data

**Before:**
```typescript
await supabase
  .from('orders')
  .update({ current_stage: 2 })
  .eq('id', orderId);
```

**After:**
```typescript
await api.put(`/orders/${orderId}`, {
  current_stage: 2,
});
```

### File Upload

**Before:**
```typescript
const { data } = await supabase.storage
  .from('process-photos')
  .upload(filePath, file);

const { data: { publicUrl } } = supabase.storage
  .from('process-photos')
  .getPublicUrl(filePath);
```

**After:**
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('type', 'process-photos');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});
const { url } = await response.json();
```

---

## 🔄 Real-time Updates

### Current Implementation (Polling)

Components now need to poll for updates:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    fetchData(); // Refresh data
  }, 5000); // Every 5 seconds

  return () => clearInterval(interval);
}, []);
```

### Optional: Socket.io Implementation

For true real-time, you can implement Socket.io:

1. **Server Setup** (`server.js`):
```javascript
const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
```

2. **Client Setup**:
```typescript
import { io } from 'socket.io-client';

const socket = io();

socket.on('order-updated', (data) => {
  // Update UI
  fetchOrders();
});
```

---

## 🗄️ Database Schema Mapping

### ID Fields

**Supabase:** Uses UUID
```
id: "550e8400-e29b-41d4-a716-446655440000"
```

**MongoDB:** Uses ObjectId
```
_id: ObjectId("507f1f77bcf86cd799439011")
```

**Solution:** API routes convert `_id` to `id` for compatibility.

### Date Fields

**Supabase:** ISO strings
```
created_at: "2024-01-01T00:00:00.000Z"
```

**MongoDB:** Date objects
```
created_at: ISODate("2024-01-01T00:00:00.000Z")
```

**Solution:** API routes convert dates to ISO strings.

---

## 📝 Environment Variables

### Before (.env.local):
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

### After (.env.local):
```env
MONGODB_URI=mongodb://localhost:27017/temple-jewellery
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/temple-jewellery

UPLOAD_DIR=./public/uploads
```

---

## 🚀 Migration Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB
Follow `MONGODB_SETUP.md` to:
- Install MongoDB or create Atlas cluster
- Get connection string
- Create `.env.local`

### 3. Create Upload Directories
```bash
mkdir -p public/uploads/process-photos
mkdir -p public/uploads/bills
mkdir -p public/uploads/attachments
```

### 4. Create Admin User
Use MongoDB Compass or shell to insert admin user.

### 5. Start Application
```bash
npm run dev
```

### 6. Test Features
- Login as admin
- Create a customer
- Create an order
- Upload photos
- Test chat

---

## ⚠️ Breaking Changes

### 1. Real-time Subscriptions Removed

**Impact:** Data doesn't update automatically

**Solution:** 
- Implement polling (already done)
- Or add Socket.io for real-time

### 2. Storage URLs Changed

**Impact:** Old Supabase URLs won't work

**Solution:**
- Re-upload files to local storage
- Update URLs in database

### 3. API Structure Changed

**Impact:** Direct Supabase queries replaced with API calls

**Solution:**
- All components updated to use new API
- No action needed if using provided code

---

## 🔐 Security Considerations

### Supabase Had:
- Row Level Security (RLS)
- Built-in authentication
- Secure storage policies

### MongoDB Requires:
- Application-level security
- Input validation
- Authentication middleware
- File upload validation

### Implemented:
- ✅ API route validation
- ✅ User authentication
- ✅ File type checking
- ⚠️ TODO: Add JWT tokens for API security
- ⚠️ TODO: Add rate limiting
- ⚠️ TODO: Add request validation middleware

---

## 📊 Performance Comparison

### Supabase:
- ✅ Built-in caching
- ✅ CDN for storage
- ✅ Connection pooling
- ✅ Real-time updates

### MongoDB:
- ✅ Flexible schema
- ✅ Fast queries with indexes
- ✅ Local storage (faster for small files)
- ⚠️ Manual caching needed
- ⚠️ Polling overhead for real-time

---

## 🎯 Recommended Improvements

### 1. Add JWT Authentication
```bash
npm install jsonwebtoken
```

### 2. Implement Socket.io
```bash
npm install socket.io socket.io-client
```

### 3. Add Request Validation
```bash
npm install zod
```

### 4. Add Rate Limiting
```bash
npm install express-rate-limit
```

### 5. Use Cloud Storage (Production)
- AWS S3
- Google Cloud Storage
- Cloudinary

---

## 🆘 Troubleshooting

### Issue: Can't connect to MongoDB
**Solution:** Check `MONGODB_URI` in `.env.local`

### Issue: Files not uploading
**Solution:** Ensure `public/uploads/` directories exist

### Issue: Real-time not working
**Solution:** Polling is now used instead of WebSockets

### Issue: TypeScript errors
**Solution:** Run `npm install` to get all dependencies

---

## ✅ Migration Checklist

- [ ] MongoDB installed or Atlas cluster created
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` configured
- [ ] Upload directories created
- [ ] Admin user created in MongoDB
- [ ] Application starts successfully
- [ ] Login works
- [ ] Can create orders
- [ ] File upload works
- [ ] Chat works (with polling)

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Socket.io Documentation](https://socket.io/docs/v4/)

---

**Migration Complete!** 🎉

Your application now uses MongoDB instead of Supabase. All core features remain functional with the new database backend.

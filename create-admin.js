// Run this script to create an admin user
// Usage: node create-admin.js

const mongoose = require('mongoose');
const fs = require('fs');

// Read .env.local file
const envContent = fs.readFileSync('.env.local', 'utf8');
const MONGODB_URI = envContent.match(/MONGODB_URI=(.*)/)?.[1]?.trim();

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile_number: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ mobile_number: '9999999999' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log('📱 Mobile: 9999999999');
      console.log('🔑 Password: 9999999999');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      mobile_number: '9999999999',
      password: '9999999999',
      role: 'admin',
      created_at: new Date(),
    });

    console.log('✅ Admin user created successfully!');
    console.log('📱 Mobile: 9999999999');
    console.log('🔑 Password: 9999999999');
    console.log('🌐 Login at: http://localhost:3000/admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./adminModel');

// MongoDB connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gami-gedara';
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Create single admin account
const createAdmin = async () => {
  try {
    console.log('\n🔐 Creating admin account...');
    
    // Clear existing admins
    console.log('🧹 Clearing existing admin data...');
    const deleteResult = await Admin.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing admin(s)`);
    
    // Hash password
    console.log('🔒 Hashing password...');
    const adminPassword = await bcrypt.hash('Admin123!', 10);

    // Create single admin
    const adminData = {
      email: 'admin@gamigedara.lk',
      displayName: 'Restaurant Admin',
      password: adminPassword,
      role: 'admin',
      permissions: ['all'],
      isActive: true
    };

    console.log('👤 Creating admin account...');
    const newAdmin = new Admin(adminData);
    const savedAdmin = await newAdmin.save();
    
    console.log(`✅ Admin account created successfully!`);
    console.log(`   📧 Email: ${savedAdmin.email}`);
    console.log(`   🎭 Role: ${savedAdmin.role}`);
    console.log(`   🔐 Password Hash: ${savedAdmin.password.substring(0, 20)}...`);

    // Verify creation
    const adminCount = await Admin.countDocuments();
    console.log(`\n📊 Total admins in database: ${adminCount}`);
    
    console.log('\n🎉 Admin account setup completed successfully!');
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('┌─────────────────────────────────────────────────────┐');
    console.log('│  🔑 ADMIN LOGIN:                                   │');
    console.log('│  📧 Email: admin@gamigedara.lk                     │');
    console.log('│  🔐 Password: Admin123!                            │');
    console.log('└─────────────────────────────────────────────────────┘');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    console.error('Full error:', error);
  }
};

// Main seeder function
const runSeeder = async () => {
  try {
    await connectDB();
    await createAdmin();
  } catch (error) {
    console.error('❌ Seeder failed:', error.message);
  } finally {
    console.log('\n🔌 Disconnecting from MongoDB...');
    try {
      await mongoose.disconnect();
      console.log('✅ Disconnected from MongoDB');
    } catch (disconnectError) {
      console.error('❌ Error disconnecting:', disconnectError.message);
    }
    process.exit(0);
  }
};

console.log('🚀 Gami Gedara Single Admin Setup');
console.log('📁 Working Directory:', process.cwd());
console.log('🕒 Started at:', new Date().toLocaleString());
console.log('─'.repeat(60));

runSeeder().catch(error => {
  console.error('❌ Unhandled error in seeder:', error);
  process.exit(1);
});
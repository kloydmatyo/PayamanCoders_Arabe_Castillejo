#!/usr/bin/env node

/**
 * Create Admin User Script
 * Creates an admin user for accessing the admin dashboard
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Use the same schema as the main User model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  googleId: {
    type: String,
    sparse: true,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'hybrid'],
    default: 'local',
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['job_seeker', 'employer', 'mentor', 'admin'],
    default: 'job_seeker',
  },
  hasPassword: {
    type: Boolean,
    default: true,
  },
  profile: {
    bio: String,
    skills: [String],
    location: String,
    experience: String,
    education: String,
    availability: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'internship'],
    },
    remote: {
      type: Boolean,
      default: false,
    },
    profilePicture: String,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema, 'users');

async function createAdmin() {
  try {
    console.log('🔐 Creating Admin User...\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const adminData = {
      email: 'admin@workqit.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      authProvider: 'local',
      emailVerified: true,
      hasPassword: true,
      profile: {
        bio: 'Platform Administrator',
        skills: ['Platform Management', 'User Support', 'Data Analysis'],
        location: 'Remote',
      }
    };

    const plainPassword = 'admin123456';
    const hashedPassword = await bcrypt.hash(plainPassword, 12);
    adminData.password = hashedPassword;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Role:', existingAdmin.role);
      console.log('✅ Email Verified:', existingAdmin.emailVerified);
      
      // Update password if needed
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      existingAdmin.emailVerified = true;
      existingAdmin.hasPassword = true;
      await existingAdmin.save();
      
      console.log('🔄 Admin user updated with new password');
    } else {
      const adminUser = await User.create(adminData);
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email:', adminUser.email);
      console.log('👤 Role:', adminUser.role);
    }

    console.log('\n🎯 ADMIN LOGIN CREDENTIALS:');
    console.log('================================');
    console.log('Email:', adminData.email);
    console.log('Password:', plainPassword);
    console.log('Dashboard URL: http://localhost:3000/admin');
    console.log('================================');

    console.log('\n📋 NEXT STEPS:');
    console.log('1. Start development server: npm run dev');
    console.log('2. Navigate to: http://localhost:3000/auth/login');
    console.log('3. Login with the credentials above');
    console.log('4. Access admin dashboard at: http://localhost:3000/admin');

    await mongoose.disconnect();
    console.log('\n✅ Script completed successfully!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
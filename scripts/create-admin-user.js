const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isAdmin: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
});
const User = mongoose.model('User', userSchema, 'users');

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);

  const email = 'admin@admin.com';
  const password = 'admin123'; // Hash in production!
  const update = {
    password, // In production, hash this!
    role: 'admin',
    isAdmin: true,
    emailVerified: true,
  };

  const result = await User.findOneAndUpdate(
    { email },
    { $set: update },
    { upsert: true, new: true }
  );

  console.log('Admin user:', result);
  await mongoose.disconnect();
}

createAdmin();
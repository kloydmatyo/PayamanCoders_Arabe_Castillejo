const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
  const plainPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  const update = {
    password: hashedPassword,
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
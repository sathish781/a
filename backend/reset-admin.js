const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

// Fix for querySrv ECONNREFUSED on networks where local DNS fails SRV queries
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('Could not set custom DNS servers:', err.message);
}

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function resetAdmin() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected.');

   const adminEmail = process.env.ADMIN_EMAIL;
   const rawPassword = process.env.ADMIN_PASSWORD;

   if (!adminEmail || !rawPassword) {
     throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured in .env');
   }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Found existing admin. Updating password and role...');
      admin.password = hashedPassword;
      admin.role = 'admin';
      await admin.save();
      console.log('Admin account updated successfully.');
    } else {
      console.log('Admin account not found. Creating new one...');
      await User.create({
        name: 'System Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin account created successfully.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin:', error);
    process.exit(1);
  }
}

resetAdmin();
const mongoose = require('mongoose');
const dns = require('dns');

// Fix for querySrv ECONNREFUSED on networks where local ISP DNS fails SRV queries
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  console.warn('Could not set custom DNS servers:', err.message);
}

async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    // Log connection attempt (hiding password)
    const maskedUri = uri.replace(/\/\/.*@/, '//<user>:<password>@');
    console.log(`Attempting to connect to: ${maskedUri}`);

    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      family: 4, // Use IPv4 to avoid Windows IPv6 socket connection timeouts
    });

    console.log(`✓ MongoDB Atlas connected: ${connection.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed!');
    console.error(`Error details: ${error.message}`);

    console.log('\n--- HOW TO FIX THIS ERROR ---');
    console.log('1. Log in to cloud.mongodb.com');
    console.log('2. Go to "Network Access" on the left sidebar');
    console.log('3. Click "+ Add IP Address"');
    console.log('4. Click "ALLOW ACCESS FROM ANYWHERE" and click Confirm');
    console.log('5. Wait 1 minute and restart this server');
    console.log('-----------------------------\n');

    process.exit(1);
  }
}

module.exports = connectDB;

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');
const Book = require('../src/models/Book');
const User = require('../src/models/User');

// Fix for querySrv ECONNREFUSED/ETIMEOUT
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {}

dotenv.config({ path: path.join(__dirname, '../.env') });

async function migrate() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const books = await Book.find({});
    console.log(`Found ${books.length} books to migrate.`);

    for (const book of books) {
      // 1. Set approvalStatus
      book.approvalStatus = 'approved';

      // 2. Set sourceType from role if missing
      if (!book.sourceType && book.role) {
        book.sourceType = book.role;
      } else if (!book.sourceType && !book.role) {
        // Fallback to owner role
        const owner = await User.findById(book.owner);
        if (owner) {
           book.sourceType = owner.role;
           book.role = owner.role;
        } else {
           book.sourceType = 'student';
           book.role = 'student';
        }
      }

      // 3. Ensure locationCoords exists
      if (!book.locationCoords || !book.locationCoords.coordinates) {
        book.locationCoords = {
          type: 'Point',
          coordinates: [-74.0060, 40.7128]
        };
      }

      await book.save();
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
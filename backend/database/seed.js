const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

dotenv.config();

const User = require('../src/models/User');
const Book = require('../src/models/Book');
const Library = require('../src/models/Library');
const LibraryBook = require('../src/models/LibraryBook');
const Shop = require('../src/models/Shop');
const ShopBook = require('../src/models/ShopBook');
const StudentBook = require('../src/models/StudentBook');
const Donation = require('../src/models/Donation');
const Notification = require('../src/models/Notification');
const Exchange = require('../src/models/Exchange');
const Reservation = require('../src/models/Reservation');
const Rating = require('../src/models/Rating');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected for seeding');

    await User.deleteMany();
    await Book.deleteMany();
    await Library.deleteMany();
    await LibraryBook.deleteMany();
    await Shop.deleteMany();
    await ShopBook.deleteMany();
    await StudentBook.deleteMany();
    await Donation.deleteMany();
    await Notification.deleteMany();
    await Exchange.deleteMany();
    await Reservation.deleteMany();
    await Rating.deleteMany();

    const adminPassword = await bcrypt.hash('admin123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);
    const libraryPassword = await bcrypt.hash('library123', 10);
    const shopPassword = await bcrypt.hash('shop123', 10);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@bookconnect.com',
      password: adminPassword,
      role: 'admin',
      phone: '9000000001',
      college: 'BookConnect',
      location: 'Coimbatore'
    });

    const student = await User.create({
      name: 'Student User',
      email: 'student@bookconnect.com',
      password: studentPassword,
      role: 'student',
      phone: '9000000002',
      college: 'ABC College',
      location: 'Coimbatore',
      badgeCount: 1
    });

    const libraryStaff = await User.create({
      name: 'Library Staff',
      email: 'library@bookconnect.com',
      password: libraryPassword,
      role: 'library_staff',
      phone: '9000000003',
      college: 'ABC College',
      location: 'Coimbatore'
    });

    const shopOwner = await User.create({
      name: 'Shop Owner',
      email: 'shop@bookconnect.com',
      password: shopPassword,
      role: 'shop_owner',
      phone: '9000000004',
      college: 'Local Book Shop',
      location: 'Coimbatore'
    });

    const dsa = await Book.create({
      title: 'Data Structures and Algorithms',
      author: 'Narasimha Karumanchi',
      isbn: '9788193245279',
      category: 'Computer Science',
      subject: 'DSA',
      course: 'B.E CSE',
      semester: '3',
      examType: 'Academic',
      description: 'Useful book for DSA and placement preparation.'
    });

    const os = await Book.create({
      title: 'Operating System Concepts',
      author: 'Silberschatz',
      isbn: '9781119800361',
      category: 'Computer Science',
      subject: 'Operating System',
      course: 'B.E CSE',
      semester: '4',
      examType: 'Academic',
      description: 'Operating system concepts book for CSE students.'
    });

    const polity = await Book.create({
      title: 'Indian Polity',
      author: 'M. Laxmikanth',
      isbn: '9789355325344',
      category: 'Competitive Exam',
      subject: 'Polity',
      course: 'UPSC',
      semester: '',
      examType: 'UPSC',
      description: 'Popular book for UPSC and State PSC preparation.'
    });

    const aptitude = await Book.create({
      title: 'Quantitative Aptitude',
      author: 'R.S. Aggarwal',
      isbn: '9789352534022',
      category: 'Aptitude',
      subject: 'Mathematics',
      course: 'Banking',
      semester: '',
      examType: 'Banking',
      description: 'Aptitude preparation book for Banking, SSC, and Railway exams.'
    });

    const neetBio = await Book.create({
      title: 'Objective Biology for NEET',
      author: 'MTG Editorial Board',
      isbn: '9789388893155',
      category: 'Medical Entrance',
      subject: 'Biology',
      course: 'NEET',
      semester: '',
      examType: 'NEET',
      description: 'Biology practice book for NEET aspirants.'
    });

    const collegeLibrary = await Library.create({
      name: 'ABC College Library',
      address: 'ABC College Campus, Coimbatore',
      contact: '0422-123456',
      staff: libraryStaff._id
    });

    const publicLibrary = await Library.create({
      name: 'District Public Library',
      address: 'Gandhipuram, Coimbatore',
      contact: '0422-654321',
      staff: libraryStaff._id
    });

    await LibraryBook.create({
      library: collegeLibrary._id,
      book: dsa._id,
      totalCopies: 5,
      availableCopies: 3,
      shelfNumber: 'CSE-A1'
    });

    await LibraryBook.create({
      library: collegeLibrary._id,
      book: os._id,
      totalCopies: 4,
      availableCopies: 2,
      shelfNumber: 'CSE-A2'
    });

    await LibraryBook.create({
      library: publicLibrary._id,
      book: polity._id,
      totalCopies: 6,
      availableCopies: 5,
      shelfNumber: 'PSC-B1'
    });

    const sriShop = await Shop.create({
      owner: shopOwner._id,
      name: 'Sri Books Store',
      address: 'Peelamedu, Coimbatore',
      contact: '9876543210',
      approved: true
    });

    const examShop = await Shop.create({
      owner: shopOwner._id,
      name: 'Exam Guide Book House',
      address: 'Gandhipuram, Coimbatore',
      contact: '9876500000',
      approved: true
    });

    await ShopBook.create({
      shop: sriShop._id,
      book: dsa._id,
      price: 550,
      stock: 10
    });

    await ShopBook.create({
      shop: sriShop._id,
      book: os._id,
      price: 720,
      stock: 5
    });

    await ShopBook.create({
      shop: examShop._id,
      book: polity._id,
      price: 680,
      stock: 12
    });

    await ShopBook.create({
      shop: examShop._id,
      book: aptitude._id,
      price: 430,
      stock: 8
    });

    await ShopBook.create({
      shop: examShop._id,
      book: neetBio._id,
      price: 850,
      stock: 4
    });

    await StudentBook.create({
      seller: student._id,
      book: dsa._id,
      price: 250,
      condition: 'Good',
      listingType: 'sell',
      status: 'available'
    });

    await StudentBook.create({
      seller: student._id,
      book: os._id,
      price: 0,
      condition: 'Average',
      listingType: 'exchange',
      status: 'available'
    });

    const donatedListing = await StudentBook.create({
      seller: student._id,
      book: aptitude._id,
      price: 0,
      condition: 'Good',
      listingType: 'donate',
      status: 'available'
    });

    await Donation.create({
      donor: student._id,
      listing: donatedListing._id,
      status: 'available'
    });

    await Notification.create({
      user: student._id,
      title: 'Welcome to BookConnect',
      message:
        'Search books from library, local shops, and students in one app.'
    });

    await Notification.create({
      user: admin._id,
      title: 'Admin Dashboard Ready',
      message: 'Your BookConnect admin dashboard is ready to use.'
    });

    console.log('Seed data inserted successfully');
    console.log('Demo Login Details:');
    console.log('Student: student@bookconnect.com / student123');
    console.log('Admin: admin@bookconnect.com / admin123');
    console.log('Library Staff: library@bookconnect.com / library123');
    console.log('Shop Owner: shop@bookconnect.com / shop123');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedData();
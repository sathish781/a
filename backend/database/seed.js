const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Book = require('../src/models/Book');
const Category = require('../src/models/Category');
const Donation = require('../src/models/Donation');

dotenv.config();

const categoriesList = [
  { name: 'Computer Science & IT', description: 'Programming, Data Science, AI, Web Development', icon: 'laptop' },
  { name: 'Engineering & Tech', description: 'Mechanical, Electrical, Civil Engineering', icon: 'cog' },
  { name: 'Medical & Healthcare', description: 'Anatomy, Pharmacy, Medicine, NEET Prep', icon: 'medical' },
  { name: 'Competitive Exams & NEET', description: 'NEET, JEE Main/Advanced, GATE, UPSC, NCERT Guides', icon: 'school' },
  { name: 'Business & Finance', description: 'Management, Economics, Accounting, Investing', icon: 'chart-line' },
  { name: 'Literature & Fiction', description: 'Novels, Bestsellers, Classics, Poetry', icon: 'book-open' },
  { name: 'Science & Maths', description: 'Physics, Chemistry, Biology, Mathematics', icon: 'atom' },
  { name: 'History & Humanities', description: 'World History, Philosophy, Sociology', icon: 'earth' }
];

async function seedData() {
  try {
    await connectDB();
    console.log('🌱 Seeding real dataset for BookConnect...');

    // 1. Seed Categories
    for (const cat of categoriesList) {
      await Category.findOneAndUpdate(
        { name: cat.name },
        cat,
        { upsert: true, new: true }
      );
    }
    console.log('✓ Categories updated');

    // 2. Seed Default Admin User
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured');
    }

    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin = await User.create({
        name: 'System Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        phone: '+1 800 555 0199',
        college: 'Central University',
        department: 'Administration',
        location: 'New York, NY',
        latitude: 40.7128,
        longitude: -74.0060,
        status: 'active',
        approvalStatus: 'approved'
      });
      console.log('✓ Admin created: admin@bookconnect.com');
    }

    // 3. Seed Shops
    const shopsData = [
      {
        email: 'shop@bookconnect.com',
        name: 'Campus Book Store Owner',
        shopName: 'Metro Books & Stationery',
        shopAddress: '12 Circle Avenue, Near Campus Gate 2',
        businessDescription: 'Academic textbooks, NEET/JEE guides, reference guides, and novels.',
        location: 'New York, NY',
        latitude: 40.7138,
        longitude: -74.0070
      },
      {
        email: 'apexbooks@bookconnect.com',
        name: 'Apex Book Stall Manager',
        shopName: 'Apex Academic Booksellers',
        shopAddress: '45 Knowledge Square, University Road',
        businessDescription: 'Specialized stock for Medical NEET prep, Engineering, GATE, and CS textbooks.',
        location: 'Boston, MA',
        latitude: 42.3601,
        longitude: -71.0589
      },
      {
        email: 'royalbooks@bookconnect.com',
        name: 'Royal Books Proprietor',
        shopName: 'Royal Student Book Depot',
        shopAddress: '88 Scholar Plaza, Main Market',
        businessDescription: 'Second-hand and new competitive exam books, NCERT solutions, and fiction bestsellers.',
        location: 'Chicago, IL',
        latitude: 41.8781,
        longitude: -87.6298
      }
    ];

    const seededShops = [];
    for (const shopItem of shopsData) {
      let shopUser = await User.findOne({ email: shopItem.email });
      if (!shopUser) {
        const pass = await bcrypt.hash('Shop@123456', 10);
        shopUser = await User.create({
          name: shopItem.name,
          email: shopItem.email,
          password: pass,
          role: 'shop',
          phone: '+1 555 018 ' + Math.floor(1000 + Math.random() * 9000),
          shopName: shopItem.shopName,
          shopAddress: shopItem.shopAddress,
          businessDescription: shopItem.businessDescription,
          location: shopItem.location,
          latitude: shopItem.latitude,
          longitude: shopItem.longitude,
          status: 'active',
          approvalStatus: 'approved'
        });
      }
      seededShops.push(shopUser);
    }
    console.log(`✓ ${seededShops.length} Shop accounts ready`);

    // 4. Seed Libraries
    const librariesData = [
      {
        email: 'library@bookconnect.com',
        name: 'Head Librarian',
        libraryName: 'Central City Academic Library',
        libraryAddress: '45 Knowledge Boulevard, Block B',
        location: 'New York, NY',
        latitude: 40.7150,
        longitude: -74.0040
      },
      {
        email: 'scilib@bookconnect.com',
        name: 'Chief Science Librarian',
        libraryName: 'National Science & Tech Library',
        libraryAddress: '101 Innovation Complex, Campus West',
        location: 'Boston, MA',
        latitude: 42.3610,
        longitude: -71.0570
      }
    ];

    const seededLibs = [];
    for (const libItem of librariesData) {
      let libUser = await User.findOne({ email: libItem.email });
      if (!libUser) {
        const pass = await bcrypt.hash('Library@123456', 10);
        libUser = await User.create({
          name: libItem.name,
          email: libItem.email,
          password: pass,
          role: 'library',
          phone: '+1 555 019 ' + Math.floor(1000 + Math.random() * 9000),
          libraryName: libItem.libraryName,
          libraryAddress: libItem.libraryAddress,
          location: libItem.location,
          latitude: libItem.latitude,
          longitude: libItem.longitude,
          status: 'active',
          approvalStatus: 'approved'
        });
      }
      seededLibs.push(libUser);
    }
    console.log(`✓ ${seededLibs.length} Library accounts ready`);

    // 5. Seed Students
    const studentsData = [
      {
        email: 'student@bookconnect.com',
        name: 'Alex Johnson',
        college: 'State Engineering College',
        department: 'Computer Science',
        location: 'New York, NY',
        latitude: 40.7115,
        longitude: -74.0055
      },
      {
        email: 'priya@bookconnect.com',
        name: 'Priya Sharma',
        college: 'National Institute of Medical Sciences',
        department: 'MBBS Prep & Medicine',
        location: 'Delhi, IN',
        latitude: 28.6139,
        longitude: 77.2090
      },
      {
        email: 'rahul@bookconnect.com',
        name: 'Rahul Verma',
        college: 'City Tech University',
        department: 'Mechanical Engineering',
        location: 'Chicago, IL',
        latitude: 41.8780,
        longitude: -87.6290
      }
    ];

    const seededStudents = [];
    for (const studItem of studentsData) {
      let studentUser = await User.findOne({ email: studItem.email });
      if (!studentUser) {
        const pass = await bcrypt.hash('Student@123456', 10);
        studentUser = await User.create({
          name: studItem.name,
          email: studItem.email,
          password: pass,
          role: 'student',
          phone: '+1 555 012 ' + Math.floor(1000 + Math.random() * 9000),
          college: studItem.college,
          department: studItem.department,
          isCollegeStudent: true,
          year: '3rd Year',
          location: studItem.location,
          latitude: studItem.latitude,
          longitude: studItem.longitude,
          status: 'active',
          approvalStatus: 'approved'
        });
      }
      seededStudents.push(studentUser);
    }
    console.log(`✓ ${seededStudents.length} Student accounts ready`);

    // 6. Real Books Dataset across Categories & Roles
    const realBooksDataset = [
      // --- COMPETITIVE EXAMS & NEET ---
      {
        title: 'Objective Biology for NEET (Volume 1 & 2)',
        author: 'MTG Editorial Board',
        isbn: '9789389590821',
        publisher: 'MTG Learning Media',
        category: 'Competitive Exams & NEET',
        description: 'Complete NEET preparation guide featuring topic-wise MCQs, past 10 years solved papers, and NCERT-based diagrams for medical entrance aspirants.',
        condition: 'New',
        price: 34.50,
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60',
        owner: seededShops[0]._id,
        role: 'shop',
        location: seededShops[0].shopName,
        latitude: seededShops[0].latitude,
        longitude: seededShops[0].longitude,
        availability: true,
        marketplaceStatus: 'approved'
      },
      {
        title: 'Concepts of Physics for NEET & JEE (Vol 1 & 2)',
        author: 'H.C. Verma',
        isbn: '9788177091877',
        publisher: 'Bharati Bhawan',
        category: 'Competitive Exams & NEET',
        description: 'The golden benchmark physics book for NEET, JEE Main, and Advanced exams. Explains fundamentals clearly with conceptual exercises.',
        condition: 'Like New',
        price: 28.00,
        imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&auto=format&fit=crop&q=60',
        owner: seededShops[1]._id,
        role: 'shop',
        location: seededShops[1].shopName,
        latitude: seededShops[1].latitude,
        longitude: seededShops[1].longitude,
        availability: true,
        marketplaceStatus: 'approved'
      },
      {
        title: 'Elementary Problems in Organic Chemistry for NEET',
        author: 'M.S. Chouhan',
        isbn: '9789386860882',
        publisher: 'Shri Balaji Publications',
        category: 'Competitive Exams & NEET',
        description: 'Targeted organic chemistry reaction mechanisms, practice worksheets, and mock tests specifically structured for NEET candidates.',
        condition: 'Good',
        price: 18.00,
        imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60',
        owner: seededStudents[1]._id,
        role: 'student',
        location: seededStudents[1].college,
        latitude: seededStudents[1].latitude,
        longitude: seededStudents[1].longitude,
        availability: true,
        donationStatus: 'approved'
      },
      {
        title: 'Trueman\'s Elementary Biology for Class 11 & 12 (NEET Edition)',
        author: 'K.N. Bhatia & C.S. Mishra',
        isbn: '9788187223689',
        publisher: 'Trueman Book Company',
        category: 'Competitive Exams & NEET',
        description: 'Standard reference text for NCERT biology syllabus covered in pre-medical entrance tests including NEET UG.',
        condition: 'Good',
        price: 0,
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
        owner: seededLibs[0]._id,
        role: 'library',
        location: seededLibs[0].libraryName,
        latitude: seededLibs[0].latitude,
        longitude: seededLibs[0].longitude,
        availability: true
      },
      {
        title: '40 Days Crash Course for NEET Chemistry',
        author: 'Sudhanshu Thakur',
        isbn: '9789325792100',
        publisher: 'Arihant Publications',
        category: 'Competitive Exams & NEET',
        description: 'Fast-track revision kit covering Physical, Organic, and Inorganic Chemistry with day-wise learning schedules.',
        condition: 'Like New',
        price: 15.00,
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60',
        owner: seededShops[2]._id,
        role: 'shop',
        location: seededShops[2].shopName,
        latitude: seededShops[2].latitude,
        longitude: seededShops[2].longitude,
        availability: true,
        marketplaceStatus: 'approved'
      },

      // --- COMPUTER SCIENCE & IT ---
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        publisher: 'Prentice Hall',
        category: 'Computer Science & IT',
        description: 'Essential guide for software engineers detailing principles, patterns, and refactoring techniques to write clean, maintainable code.',
        condition: 'Like New',
        price: 25.00,
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60',
        owner: seededShops[0]._id,
        role: 'shop',
        location: seededShops[0].shopName,
        latitude: seededShops[0].latitude,
        longitude: seededShops[0].longitude,
        availability: true,
        marketplaceStatus: 'approved'
      },
      {
        title: 'Introduction to Algorithms (4th Edition - CLRS)',
        author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest',
        isbn: '9780262046305',
        publisher: 'MIT Press',
        category: 'Computer Science & IT',
        description: 'The definitive text on computer algorithms covering sorting, graph algorithms, dynamic programming, and data structures.',
        condition: 'Good',
        price: 0,
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
        owner: seededLibs[0]._id,
        role: 'library',
        location: seededLibs[0].libraryName,
        latitude: seededLibs[0].latitude,
        longitude: seededLibs[0].longitude,
        availability: true
      },
      {
        title: 'Database System Concepts (7th Edition)',
        author: 'Abraham Silberschatz, Henry F. Korth',
        isbn: '9780078022159',
        publisher: 'McGraw-Hill',
        category: 'Computer Science & IT',
        description: 'Fundamental textbook covering relational database design, SQL querying, indexing, and transaction management.',
        condition: 'Good',
        price: 15.00,
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60',
        owner: seededStudents[0]._id,
        role: 'student',
        location: seededStudents[0].college,
        latitude: seededStudents[0].latitude,
        longitude: seededStudents[0].longitude,
        availability: true,
        donationStatus: 'approved'
      },
      {
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        isbn: '9781449373320',
        publisher: 'O\'Reilly Media',
        category: 'Computer Science & IT',
        description: 'Deep dive into the architecture of distributed systems, databases, batch processing, and real-time streaming.',
        condition: 'New',
        price: 32.00,
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60',
        owner: seededShops[1]._id,
        role: 'shop',
        location: seededShops[1].shopName,
        latitude: seededShops[1].latitude,
        longitude: seededShops[1].longitude,
        availability: true,
        marketplaceStatus: 'approved'
      },
      {
        title: 'Artificial Intelligence: A Modern Approach (4th Edition)',
        author: 'Stuart Russell & Peter Norvig',
        isbn: '9780134610993',
        publisher: 'Pearson',
        category: 'Computer Science & IT',
        description: 'Comprehensive textbook on artificial intelligence, machine learning, neural networks, and automated decision making.',
        condition: 'Good',
        price: 0,
        imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&auto=format&fit=crop&q=60',
        owner: seededLibs[1]._id,
        role: 'library',
        location: seededLibs[1].libraryName,
        latitude: seededLibs[1].latitude,
        longitude: seededLibs[1].longitude,
        availability: true
      },

      // --- MEDICAL & HEALTHCARE ---
      {
        title: 'BD Chaurasia\'s Human Anatomy (8th Edition)',
        author: 'B.D. Chaurasia',
        isbn: '9789388902724',
        publisher: 'CBS Publishers',
        category: 'Medical & Healthcare',
        description: 'Standard textbook of human anatomy for MBBS, BDS, and pre-med students with colored illustrations.',
        condition: 'Like New',
        price: 30.00,
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=60',
        owner: seededShops[0]._id,
        role: 'shop',
        location: seededShops[0].shopName,
        latitude: seededShops[0].latitude,
        longitude: seededShops[0].longitude,
        availability: true,
        marketplaceStatus: 'approved'
      },
      {
        title: 'Guyton and Hall Textbook of Medical Physiology',
        author: 'John E. Hall',
        isbn: '9780323597128',
        publisher: 'Elsevier',
        category: 'Medical & Healthcare',
        description: 'World-renowned medical physiology guide detailing human bodily functions and clinical applications.',
        condition: 'Good',
        price: 0,
        imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=60',
        owner: seededLibs[0]._id,
        role: 'library',
        location: seededLibs[0].libraryName,
        latitude: seededLibs[0].latitude,
        longitude: seededLibs[0].longitude,
        availability: true
      },

      // --- ENGINEERING & TECH ---
      {
        title: 'Higher Engineering Mathematics (44th Edition)',
        author: 'B.S. Grewal',
        isbn: '9788174091955',
        publisher: 'Khanna Publishers',
        category: 'Engineering & Tech',
        description: 'Essential mathematics textbook for B.Tech/B.E students covering calculus, linear algebra, vector analysis, and differential equations.',
        condition: 'Good',
        price: 19.50,
        imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60',
        owner: seededShops[2]._id,
        role: 'shop',
        location: seededShops[2].shopName,
        latitude: seededShops[2].latitude,
        longitude: seededShops[2].longitude,
        availability: true,
        marketplaceStatus: 'approved'
      },
      {
        title: 'Fundamentals of Electric Circuits (7th Edition)',
        author: 'Charles K. Alexander, Matthew N.O. Sadiku',
        isbn: '9781260570793',
        publisher: 'McGraw-Hill',
        category: 'Engineering & Tech',
        description: 'Comprehensive guide to circuit analysis, Ohm\'s law, AC/DC networks, and operational amplifiers.',
        condition: 'Fair',
        price: 12.00,
        imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500&auto=format&fit=crop&q=60',
        owner: seededStudents[2]._id,
        role: 'student',
        location: seededStudents[2].college,
        latitude: seededStudents[2].latitude,
        longitude: seededStudents[2].longitude,
        availability: true,
        marketplaceStatus: 'approved'
      },

      // --- BUSINESS & FINANCE ---
      {
        title: 'The Intelligent Investor (Revised Edition)',
        author: 'Benjamin Graham',
        isbn: '9780060555665',
        publisher: 'Harper Business',
        category: 'Business & Finance',
        description: 'The definitive book on value investing, risk management, and long-term wealth creation by Warren Buffett\'s mentor.',
        condition: 'New',
        price: 22.00,
        imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=60',
        owner: seededShops[1]._id,
        role: 'shop',
        location: seededShops[1].shopName,
        latitude: seededShops[1].latitude,
        longitude: seededShops[1].longitude,
        availability: true,
        marketplaceStatus: 'approved'
      },
      {
        title: 'Rich Dad Poor Dad',
        author: 'Robert T. Kiyosaki',
        isbn: '9781612680194',
        publisher: 'Plata Publishing',
        category: 'Business & Finance',
        description: 'Personal finance classic on asset building, financial literacy, and mindset shifts for financial independence.',
        condition: 'Like New',
        price: 10.00,
        imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500&auto=format&fit=crop&q=60',
        owner: seededShops[0]._id,
        role: 'shop',
        location: seededShops[0].shopName,
        latitude: seededShops[0].latitude,
        longitude: seededShops[0].longitude,
        availability: true,
        marketplaceStatus: 'approved'
      },

      // --- LITERATURE & BESTSELLERS ---
      {
        title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
        author: 'James Clear',
        isbn: '9780735211292',
        publisher: 'Avery',
        category: 'Literature & Fiction',
        description: 'Transformative self-improvement book focusing on micro-habits, decision making, and daily productivity frameworks.',
        condition: 'New',
        price: 16.99,
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
        owner: seededShops[2]._id,
        role: 'shop',
        location: seededShops[2].shopName,
        latitude: seededShops[2].latitude,
        longitude: seededShops[2].longitude,
        availability: true,
        marketplaceStatus: 'approved'
      },
      {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        isbn: '9780062315007',
        publisher: 'HarperOne',
        category: 'Literature & Fiction',
        description: 'Inspiring fable about following your dreams, listening to your heart, and discovering personal destiny.',
        condition: 'Good',
        price: 0,
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60',
        owner: seededLibs[0]._id,
        role: 'library',
        location: seededLibs[0].libraryName,
        latitude: seededLibs[0].latitude,
        longitude: seededLibs[0].longitude,
        availability: true
      }
    ];

    // Reset and seed books
    await Book.deleteMany({});
    const createdBooks = await Book.insertMany(realBooksDataset);
    console.log(`✓ ${createdBooks.length} real books inserted into MongoDB collection!`);

    // Seed sample approved donations so DonationScreen displays data
    await Donation.deleteMany({});
    const donationEligibleBooks = createdBooks.filter(b => b.donationStatus === 'approved' || b.price === 0);
    for (let i = 0; i < donationEligibleBooks.length; i++) {
      const b = donationEligibleBooks[i];
      await Donation.create({
        book: b._id,
        donor: b.owner,
        adminApprovalStatus: 'approved',
        status: 'available',
        pickupLocation: b.location || 'Campus Library / Student Union',
        notes: 'Generously donated to support medical & tech students in need.'
      });
    }
    console.log(`✓ ${donationEligibleBooks.length} approved donations seeded!`);

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedData();
}

module.exports = seedData;
const Book = require('../models/Book');
const Library = require('../models/Library');
const LibraryBook = require('../models/LibraryBook');
const asyncHandler = require('../utils/asyncHandler');

const getLibraries = asyncHandler(async (req, res) => {
  const libraries = await Library.find()
    .populate('staff', 'name email role')
    .sort({ createdAt: -1 });

  res.json(libraries);
});

const createLibrary = asyncHandler(async (req, res) => {
  const { name, address, contact } = req.body;

  if (!name || !address) {
    res.status(400);
    throw new Error('Library name and address are required.');
  }

  const library = await Library.create({
    name,
    address,
    contact,
    staff: req.user._id
  });

  res.status(201).json({
    message: 'Library created successfully',
    library
  });
});

const addLibraryBook = asyncHandler(async (req, res) => {
  const {
    libraryId,
    title,
    author,
    isbn,
    category,
    subject,
    course,
    semester,
    examType,
    description,
    imageUrl,
    totalCopies,
    availableCopies,
    shelfNumber
  } = req.body;

  if (!libraryId || !title) {
    res.status(400);
    throw new Error('Library ID and book title are required.');
  }

  const library = await Library.findById(libraryId);

  if (!library) {
    res.status(404);
    throw new Error('Library not found.');
  }

  const book = await Book.create({
    title,
    author,
    isbn,
    category,
    subject,
    course,
    semester,
    examType,
    description,
    imageUrl
  });

  const libraryBook = await LibraryBook.create({
    library: libraryId,
    book: book._id,
    totalCopies: Number(totalCopies || 0),
    availableCopies: Number(availableCopies || 0),
    shelfNumber
  });

  res.status(201).json({
    message: 'Library book added successfully',
    libraryBook
  });
});

module.exports = {
  getLibraries,
  createLibrary,
  addLibraryBook
};
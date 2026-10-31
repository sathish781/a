const LibraryRequest = require('../models/LibraryRequest');
const ShopRequest = require('../models/ShopRequest');
const Book = require('../models/Book');
const Notification = require('../models/Notification');
const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');

// --- LIBRARY REQUESTS ---

const createLibraryRequest = asyncHandler(async (req, res) => {
  const { bookId, libraryId, requestedDays } = req.body;
  const request = await LibraryRequest.create({
    studentId: req.user._id,
    bookId,
    libraryId,
    requestedDays
  });

  // Notify Librarian
  await Notification.create({
    user: libraryId,
    title: 'New Borrow Request',
    message: `${req.user.name} wants to borrow a book for ${requestedDays} days.`,
    type: 'request'
  });

  res.status(201).json(request);
});

const acceptLibraryRequest = asyncHandler(async (req, res) => {
  const request = await LibraryRequest.findById(req.params.id);
  if (!request) throw new Error('Request not found');

  const borrowDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(borrowDate.getDate() + request.requestedDays);

  request.status = 'APPROVED';
  request.borrowDate = borrowDate;
  request.dueDate = dueDate;
  await request.save();

  // Reduce book quantity if stock system exists, or mark as unavailable
  // await Book.findByIdAndUpdate(request.bookId, { $inc: { availableCopies: -1 } });

  await Notification.create({
    user: request.studentId,
    title: 'Library Request Approved',
    message: `Your request is approved. Return by ${dueDate.toLocaleDateString()}.`,
    type: 'success'
  });

  res.json(request);
});

// --- SHOP REQUESTS ---

const rejectLibraryRequest = asyncHandler(async (req, res) => {
  const request = await LibraryRequest.findById(req.params.id);
  if (!request) throw new Error('Request not found');

  request.status = 'REJECTED';
  await request.save();

  await Notification.create({
    user: request.studentId,
    title: 'Library Request Rejected',
    message: `Your request for the book was rejected by the library.`,
    type: 'error'
  });

  res.json(request);
});

const returnLibraryBook = asyncHandler(async (req, res) => {
  const request = await LibraryRequest.findById(req.params.id);
  if (!request) throw new Error('Request not found');

  request.status = 'RETURNED';
  request.returnDate = new Date();
  await request.save();

  res.json(request);
});

const getStudentLibraryRequests = asyncHandler(async (req, res) => {
  const requests = await LibraryRequest.find({ studentId: req.user._id })
    .populate('bookId')
    .populate('libraryId', 'name libraryName location');
  res.json(requests);
});

const getLibraryIncomingRequests = asyncHandler(async (req, res) => {
  const requests = await LibraryRequest.find({ libraryId: req.user._id })
    .populate('bookId')
    .populate('studentId', 'name email phone');
  res.json(requests);
});

// --- SHOP REQUESTS ---

const createShopRequest = asyncHandler(async (req, res) => {
  const { bookId, price } = req.body;

  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  // Use the owner from the book document as the shop owner
  const shopId = book.owner;

  const request = await ShopRequest.create({
    studentId: req.user._id,
    bookId,
    shopId,
    price: price || book.price
  });

  console.log(`Created shop request: ${request._id} for shop: ${shopId}`);

  await Notification.create({
    user: shopId,
    title: 'New Purchase Request',
    message: `${req.user.name} wants to buy "${book.title}" for ₹${price || book.price}.`,
    type: 'request',
    isRead: false
  });

  // Also send a Direct Message to open a chat
  await Message.create({
    sender: req.user._id,
    receiver: shopId,
    content: `Hello! I've sent a purchase request for "${book.title}". Please review it.`,
    book: bookId
  });

  res.status(201).json(request);
});

const acceptShopRequest = asyncHandler(async (req, res) => {
  const request = await ShopRequest.findById(req.params.id).populate('bookId');
  if (!request) throw new Error('Request not found');

  const book = request.bookId;

  request.status = 'ACCEPTED';
  request.acceptedDate = new Date();
  await request.save();

  await Notification.create({
    user: request.studentId,
    title: 'Shop Request Accepted',
    message: `Your book request for "${book?.title}" has been accepted. Please collect from shop.`,
    type: 'success',
    isRead: false
  });

  // Also send a Direct Message reply
  await Message.create({
    sender: req.user._id,
    receiver: request.studentId,
    content: `I've accepted your request for "${book?.title}". You can collect it from my shop.`,
    book: book?._id
  });

  res.json(request);
});

const rejectShopRequest = asyncHandler(async (req, res) => {
  const request = await ShopRequest.findById(req.params.id).populate('bookId');
  if (!request) throw new Error('Request not found');

  const book = request.bookId;

  request.status = 'REJECTED';
  await request.save();

  await Notification.create({
    user: request.studentId,
    title: 'Shop Request Rejected',
    message: `Your request for "${book?.title}" was rejected by the shop owner.`,
    type: 'error',
    isRead: false
  });

  // Also send a Direct Message reply
  await Message.create({
    sender: req.user._id,
    receiver: request.studentId,
    content: `I'm sorry, I had to reject your request for "${book?.title}".`,
    book: book?._id
  });

  res.json(request);
});

const completeShopRequest = asyncHandler(async (req, res) => {
  const request = await ShopRequest.findById(req.params.id);
  if (!request) throw new Error('Request not found');

  request.status = 'COMPLETED';
  request.completedDate = new Date();
  await request.save();

  res.json(request);
});

const getStudentShopRequests = asyncHandler(async (req, res) => {
  const requests = await ShopRequest.find({ studentId: req.user._id })
    .populate('bookId')
    .populate('shopId', 'name shopName location phone');
  res.json(requests);
});

const getShopIncomingRequests = asyncHandler(async (req, res) => {
  console.log(`[ShopRequests] Fetching for owner ID: ${req.user._id}`);

  // Find all requests for this shop owner
  const requests = await ShopRequest.find({ shopId: req.user._id })
    .populate({
      path: 'bookId',
      select: 'title author imageUrl price sourceType'
    })
    .populate({
      path: 'studentId',
      select: 'name email phone college'
    })
    .sort({ createdAt: -1 });

  console.log(`[ShopRequests] Found ${requests.length} total requests`);

  // Optional: check if we should return empty or if there are requests for this user but under a different shop ID
  if (requests.length === 0) {
    const checkAny = await ShopRequest.countDocuments({});
    console.log(`[ShopRequests] DB has ${checkAny} total shop requests across all shops.`);
  }

  res.json(requests);
});

module.exports = {
  createLibraryRequest,
  acceptLibraryRequest,
  rejectLibraryRequest,
  returnLibraryBook,
  getStudentLibraryRequests,
  getLibraryIncomingRequests,
  createShopRequest,
  acceptShopRequest,
  rejectShopRequest,
  completeShopRequest,
  getStudentShopRequests,
  getShopIncomingRequests
};
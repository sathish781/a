const Order = require('../models/Order');
const Book = require('../models/Book');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a new order
// @route   POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { bookId } = req.body;
  const book = await Book.findById(bookId);

  if (!book || !book.availability) {
    res.status(400);
    throw new Error('Book not available');
  }

  const order = await Order.create({
    buyer: req.user._id,
    seller: book.owner,
    book: bookId,
    price: book.price
  });

  // Notify Seller
  await Notification.create({
    user: book.owner,
    type: 'order_received',
    title: 'New Order Received',
    message: `A student wants to buy "${book.title}". Please accept or reject the request.`,
    relatedId: order._id
  });

  res.status(201).json(order);
});

// @desc    Get my orders (as buyer)
// @route   GET /api/orders/my-orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate('book')
    .populate('seller', 'name shopName email phone')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get received orders (as seller)
// @route   GET /api/orders/sales
const getReceivedOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ seller: req.user._id })
    .populate('book')
    .populate('buyer', 'name email phone')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status (Accept/Reject/Complete)
// @route   PATCH /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id).populate('book');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only seller can accept/reject
  if (['accepted', 'rejected'].includes(status) && order.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  order.status = status;
  await order.save();

  // If accepted, update book availability
  if (status === 'accepted') {
    await Book.findByIdAndUpdate(order.book._id, { availability: false, marketplaceStatus: 'sold' });
  }

  // Notify Buyer
  await Notification.create({
    user: order.buyer,
    type: 'order_update',
    title: `Order ${status}`,
    message: `Your order for "${order.book.title}" has been ${status}.`,
    relatedId: order._id
  });

  res.json(order);
});

module.exports = { createOrder, getMyOrders, getReceivedOrders, updateOrderStatus };
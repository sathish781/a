const Book = require('../models/Book');
const Shop = require('../models/Shop');
const ShopBook = require('../models/ShopBook');
const asyncHandler = require('../utils/asyncHandler');

const getShops = asyncHandler(async (req, res) => {
  const shops = await Shop.find()
    .populate('owner', 'name email role')
    .sort({ createdAt: -1 });

  res.json(shops);
});

const createShop = asyncHandler(async (req, res) => {
  const { name, address, contact } = req.body;

  if (!name || !address) {
    res.status(400);
    throw new Error('Shop name and address are required.');
  }

  const shop = await Shop.create({
    owner: req.user._id,
    name,
    address,
    contact,
    approved: req.user.role === 'admin'
  });

  res.status(201).json({
    message: 'Shop registered successfully',
    shop
  });
});

const addShopBook = asyncHandler(async (req, res) => {
  const {
    shopId,
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
    price,
    stock
  } = req.body;

  if (!shopId || !title) {
    res.status(400);
    throw new Error('Shop ID and book title are required.');
  }

  const shop = await Shop.findById(shopId);

  if (!shop) {
    res.status(404);
    throw new Error('Shop not found.');
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

  const shopBook = await ShopBook.create({
    shop: shopId,
    book: book._id,
    price: Number(price || 0),
    stock: Number(stock || 0)
  });

  res.status(201).json({
    message: 'Shop book added successfully',
    shopBook
  });
});

const approveShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findByIdAndUpdate(
    req.params.id,
    { approved: true },
    { new: true }
  );

  if (!shop) {
    res.status(404);
    throw new Error('Shop not found.');
  }

  res.json({
    message: 'Shop approved successfully',
    shop
  });
});

module.exports = {
  getShops,
  createShop,
  addShopBook,
  approveShop
};
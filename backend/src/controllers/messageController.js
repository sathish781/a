const Message = require('../models/Message');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Send a message
// @route   POST /api/messages
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, bookId, content, messageType, fileUrl } = req.body;

  if (!receiverId) {
    res.status(400);
    throw new Error('Receiver ID is required');
  }

  if (!content && !fileUrl) {
    res.status(400);
    throw new Error('Message content or file is required');
  }

  const newMessage = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    book: bookId || undefined,
    content: content || '',
    messageType: messageType || 'text',
    fileUrl: fileUrl || ''
  });

  res.status(201).json(newMessage);
});

// @desc    Get conversation list
// @route   GET /api/messages/conversations
const getConversations = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }]
  })
    .populate('sender', 'name profileImage role')
    .populate('receiver', 'name profileImage role')
    .populate('book', 'title imageUrl')
    .sort({ createdAt: -1 });

  // Group by partner
  const contacts = {};
  messages.forEach(msg => {
    const partner = msg.sender._id.toString() === req.user._id.toString() ? msg.receiver : msg.sender;
    if (!contacts[partner._id]) {
      contacts[partner._id] = {
        partner,
        lastMessage: {
          content: msg.content,
          createdAt: msg.createdAt,
          isRead: msg.sender._id.toString() === req.user._id.toString() ? true : msg.read
        },
        book: msg.book,
        unreadCount: !msg.read && msg.receiver._id.toString() === req.user._id.toString() ? 1 : 0
      };
    } else if (!msg.read && msg.receiver._id.toString() === req.user._id.toString()) {
      contacts[partner._id].unreadCount++;
    }
  });

  res.json(Object.values(contacts));
});

// @desc    Get messages with a specific user
// @route   GET /api/messages/:userId
const getChatHistory = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user._id }
    ]
  }).sort({ createdAt: 1 });

  // Mark as read
  await Message.updateMany(
    { sender: req.params.userId, receiver: req.user._id, read: false },
    { read: true }
  );

  res.json(messages);
});

module.exports = { sendMessage, getConversations, getChatHistory };
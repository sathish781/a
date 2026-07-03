const bcrypt = require('bcryptjs');

const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

function cleanUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    college: user.college,
    location: user.location,
    badgeCount: user.badgeCount
  };
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, college, location } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required.');
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error('Email already registered.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'student',
    phone,
    college,
    location
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    message: 'Registration successful',
    token,
    user: cleanUser(user)
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required.');
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(400);
    throw new Error('Invalid email or password.');
  }

  const token = generateToken(user._id, user.role);

  res.json({
    message: 'Login successful',
    token,
    user: cleanUser(user)
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  res.json({
    message:
      'Demo password reset: Please contact admin to reset your password.'
  });
});

const getProfile = asyncHandler(async (req, res) => {
  res.json(cleanUser(req.user));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, college, location } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      phone,
      college,
      location
    },
    {
      new: true
    }
  );

  res.json({
    message: 'Profile updated successfully',
    user: cleanUser(user)
  });
});

module.exports = {
  register,
  login,
  forgotPassword,
  getProfile,
  updateProfile
};
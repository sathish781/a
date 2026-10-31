const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../utils/sendEmail');

function cleanUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    college: user.college,
    department: user.department,
    isCollegeStudent: user.isCollegeStudent,
    year: user.year,
    shopName: user.shopName,
    shopAddress: user.shopAddress,
    businessDescription: user.businessDescription,
    libraryName: user.libraryName,
    libraryAddress: user.libraryAddress,
    profileImage: user.profileImage,
    location: user.location,
    recoveryHint: user.recoveryHint,
    latitude: user.latitude,
    longitude: user.longitude,
    status: user.status,
    approvalStatus: user.approvalStatus,
    badgeCount: user.badgeCount
  };
}

// @desc Register new user (Student, Shop Owner, Library)
// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    college,
    department,
    isCollegeStudent,
    year,
    shopName,
    shopAddress,
    businessDescription,
    libraryName,
    libraryAddress,
    location,
    latitude,
    longitude,
    profileImage,
    recoveryHint
  } = req.body;

  if (!email || !password || !role) {
    res.status(400);
    throw new Error('Email, password, and role are required.');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(400);
    throw new Error('Email already registered.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const assignedRole = role.toLowerCase() === 'admin' ? 'student' : role.toLowerCase();

  const approvalStatus = (assignedRole === 'shop' || assignedRole === 'library') ? 'pending' : 'approved';

  const user = await User.create({
    name: name || shopName || libraryName || 'New User',
    email: email.toLowerCase(),
    password: hashedPassword,
    role: assignedRole,
    phone: phone || '',
    college: college || '',
    department: department || '',
    isCollegeStudent: isCollegeStudent !== undefined ? isCollegeStudent : true,
    year: year || '',
    shopName: shopName || '',
    shopAddress: shopAddress || '',
    businessDescription: businessDescription || '',
    libraryName: libraryName || '',
    libraryAddress: libraryAddress || '',
    location: location || 'Main Campus',
    latitude: latitude || 40.7128,
    longitude: longitude || -74.0060,
    profileImage: profileImage || '',
    recoveryHint: recoveryHint || '',
    approvalStatus: approvalStatus
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    message: assignedRole === 'shop' || assignedRole === 'library'
      ? 'Registration submitted! Awaiting Admin approval.'
      : 'Registration successful!',
    token,
    user: cleanUser(user)
  });
});

// @desc Login user or admin
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required.');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.status(400);
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error('Invalid email or password.');
  }

  if (user.status === 'blocked') {
    res.status(403);
    throw new Error('Your account has been blocked by administrator.');
  }

  if (role && role !== 'admin' && user.role !== role && user.role !== 'admin') {
    // If role requested doesn't match and not admin, return error
    res.status(400);
    throw new Error(`Account is registered as ${user.role}, not ${role}.`);
  }

  const token = generateToken(user._id, user.role);

  res.json({
    message: 'Login successful',
    token,
    user: cleanUser(user)
  });
});

// @desc Forgot Password
// @route POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email ? email.toLowerCase() : '' });

  if (!user) {
    res.status(404);
    throw new Error('No user found with this email address.');
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  // For React Native, it might be better to send a 6-digit code or a link that opens the app
  // For now, let's assume a web-based reset link or a code.
  // Using a link for now.
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    const result = await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });

    if (result && !result.sent) {
      res.json({
        message: 'Dev Mode: Reset link printed in backend console. Set EMAIL_PASS in backend/.env to send real emails to Gmail.',
        resetUrl: result.resetUrl
      });
    } else {
      res.json({
        message: 'Password reset instructions have been sent to your email.'
      });
    }
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error(err.message || 'Email could not be sent');
  }
});

// @desc Reset Password
// @route PUT /api/auth/resetpassword/:resettoken
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  // Set new password
  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({
    message: 'Password reset successful',
    token: generateToken(user._id, user.role),
    user: cleanUser(user)
  });
});

// @desc Reset Password with Hint
// @route POST /api/auth/reset-with-hint
const resetWithHint = asyncHandler(async (req, res) => {
  const { email, recoveryHint, newPassword } = req.body;

  if (!email || !recoveryHint || !newPassword) {
    res.status(400);
    throw new Error('Email, recovery hint, and new password are required.');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.status(404);
    throw new Error('No user found with this email address.');
  }

  if (user.recoveryHint !== recoveryHint) {
    res.status(400);
    throw new Error('Incorrect recovery hint.');
  }

  // Set new password
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({
    message: 'Password reset successful!',
    token: generateToken(user._id, user.role),
    user: cleanUser(user)
  });
});


// @desc Get current profile
// @route GET /api/auth/profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(cleanUser(user));
});

// @desc Update user profile
// @route PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.college = req.body.college || user.college;
  user.department = req.body.department || user.department;
  user.year = req.body.year || user.year;
  user.shopName = req.body.shopName || user.shopName;
  user.shopAddress = req.body.shopAddress || user.shopAddress;
  user.businessDescription = req.body.businessDescription || user.businessDescription;
  user.libraryName = req.body.libraryName || user.libraryName;
  user.libraryAddress = req.body.libraryAddress || user.libraryAddress;
  user.location = req.body.location || user.location;
  user.recoveryHint = req.body.recoveryHint || user.recoveryHint;
  if (req.body.latitude) user.latitude = req.body.latitude;
  if (req.body.longitude) user.longitude = req.body.longitude;
  if (req.body.profileImage) user.profileImage = req.body.profileImage;

  const updatedUser = await user.save();

  res.json({
    message: 'Profile updated successfully',
    user: cleanUser(updatedUser)
  });
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  resetWithHint,
  getProfile,
  updateProfile
};
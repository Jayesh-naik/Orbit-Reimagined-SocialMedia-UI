const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      theme: user.theme,
      notificationPreferences: user.notificationPreferences,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() }).select('+password +refreshToken');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      theme: user.theme,
      notificationPreferences: user.notificationPreferences,
    },
  });
});

// @desc    Refresh the access token using the httpOnly refresh cookie
// @route   POST /api/auth/refresh
// @access  Public (requires valid refresh cookie)
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error('No refresh token provided');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    res.status(401);
    throw new Error('Refresh token invalid or expired');
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    res.status(401);
    throw new Error('Refresh token does not match');
  }

  const accessToken = generateAccessToken(user._id);
  res.json({ success: true, accessToken });
});

// @desc    Logout - clear refresh token
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await User.updateOne({ refreshToken: token }, { $unset: { refreshToken: 1 } });
  }
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
});

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, bio, skills, avatar } = req.body;
  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (skills !== undefined) user.skills = skills;
  if (avatar !== undefined) user.avatar = avatar;

  const updatedUser = await user.save();
  res.json({
    success: true,
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      theme: updatedUser.theme,
      notificationPreferences: updatedUser.notificationPreferences,
    },
  });
});

// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

// @desc    Update user settings
// @route   PUT /api/auth/settings
// @access  Private
const updateSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { theme, notificationPreferences } = req.body;
  if (theme !== undefined) user.theme = theme;
  if (notificationPreferences !== undefined) {
    user.notificationPreferences = {
      ...user.notificationPreferences.toObject(),
      ...notificationPreferences,
    };
  }

  const updatedUser = await user.save();
  res.json({
    success: true,
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      theme: updatedUser.theme,
      notificationPreferences: updatedUser.notificationPreferences,
    },
  });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  updateSettings,
};

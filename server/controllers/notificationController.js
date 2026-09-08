const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get logged-in user's notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ receiver: req.user._id })
    .populate('sender', 'name avatar')
    .sort('-createdAt')
    .limit(50);

  const unreadCount = await Notification.countDocuments({ receiver: req.user._id, read: false });

  res.json({ success: true, notifications, unreadCount });
});

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, receiver: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }
  res.json({ success: true, notification });
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ receiver: req.user._id, read: false }, { read: true });
  res.json({ success: true });
});

module.exports = { getNotifications, markAsRead, markAllAsRead };

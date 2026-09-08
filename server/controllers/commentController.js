const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const { getIO } = require('../socket/socket');

// @desc    Add a comment to a task
// @route   POST /api/tasks/:taskId/comments
// @access  Private (member+)
const addComment = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { message } = req.body;

  if (!message?.trim()) {
    res.status(400);
    throw new Error('Comment message cannot be empty');
  }

  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const project = await Project.findById(task.project);
  const role = project.getRole(req.user._id);
  if (!role) {
    res.status(403);
    throw new Error('You are not a member of this project');
  }

  const comment = await Comment.create({ task: taskId, user: req.user._id, message });
  const populated = await comment.populate('user', 'name avatar');

  task.activityLog.push({ user: req.user._id, action: 'commented on this task' });
  await task.save();

  // Notify assignees + reporter (excluding the commenter)
  const notifyIds = new Set(
    [...task.assignedTo.map(String), task.reporter.toString()].filter((id) => id !== req.user._id.toString())
  );
  if (notifyIds.size) {
    const notifications = [...notifyIds].map((uid) => ({
      receiver: uid,
      sender: req.user._id,
      type: 'comment_added',
      message: `${req.user.name} commented on "${task.title}"`,
      project: task.project,
      task: task._id,
    }));
    const createdNotifications = await Notification.insertMany(notifications);
    for (const notif of createdNotifications) {
      const populatedNotif = await notif.populate('sender', 'name avatar');
      try {
        getIO().to(`user:${notif.receiver}`).emit('notificationReceived', populatedNotif);
      } catch (err) {
        console.error('Error emitting notification via socket:', err);
      }
    }
  }

  getIO().to(`project:${task.project}`).emit('commentAdded', { taskId, comment: populated });

  res.status(201).json({ success: true, comment: populated });
});

// @desc    Get all comments for a task
// @route   GET /api/tasks/:taskId/comments
// @access  Private (member+)
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ task: req.params.taskId })
    .populate('user', 'name avatar')
    .sort('createdAt');

  res.json({ success: true, count: comments.length, comments });
});

// @desc    Delete a comment (author only)
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }
  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only delete your own comments');
  }

  const task = await Task.findById(comment.task);
  await comment.deleteOne();

  getIO().to(`project:${task.project}`).emit('commentDeleted', { taskId: task._id, commentId: comment._id });

  res.json({ success: true, message: 'Comment deleted' });
});

module.exports = { addComment, getComments, deleteComment };

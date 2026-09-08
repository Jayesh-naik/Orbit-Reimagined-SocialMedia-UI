const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const { getIO } = require('../socket/socket');

// Helper: confirm requester is a member of the task's project, return their role
const assertMembership = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    const err = new Error('Project not found');
    err.statusCode = 404;
    throw err;
  }
  const role = project.getRole(userId);
  if (!role) {
    const err = new Error('You are not a member of this project');
    err.statusCode = 403;
    throw err;
  }
  return { project, role };
};

// @desc    Create a task on a project's board
// @route   POST /api/projects/:projectId/tasks
// @access  Private (member+)
const createTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, status, priority, assignedTo, dueDate, labels, estimatedHours } = req.body;

  const { project, role } = await assertMembership(projectId, req.user._id);
  if (role === 'viewer') {
    res.status(403);
    throw new Error('Viewers cannot create tasks');
  }

  const columnStatus = status && project.columns.includes(status) ? status : project.columns[0];

  const lastTask = await Task.findOne({ project: projectId, status: columnStatus }).sort('-order');
  const order = lastTask ? lastTask.order + 1 : 0;

  const task = await Task.create({
    project: projectId,
    title,
    description,
    status: columnStatus,
    priority,
    assignedTo,
    dueDate,
    labels,
    estimatedHours,
    reporter: req.user._id,
    order,
    activityLog: [{ user: req.user._id, action: `created this task` }],
  });

  if (assignedTo?.length) {
    const notifications = assignedTo
      .filter((uid) => uid !== req.user._id.toString())
      .map((uid) => ({
        receiver: uid,
        sender: req.user._id,
        type: 'task_assigned',
        message: `${req.user.name} assigned you a task: "${title}"`,
        project: projectId,
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

  const populated = await task.populate([
    { path: 'assignedTo', select: 'name avatar' },
    { path: 'reporter', select: 'name avatar' },
    { path: 'activityLog.user', select: 'name avatar' },
  ]);

  getIO().to(`project:${projectId}`).emit('taskCreated', populated);

  res.status(201).json({ success: true, task: populated });
});

// @desc    Update a task (title, description, priority, assignees, checklist, etc.)
// @route   PUT /api/tasks/:id
// @access  Private (member+)
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const { role } = await assertMembership(task.project, req.user._id);
  if (role === 'viewer') {
    res.status(403);
    throw new Error('Viewers cannot edit tasks');
  }

  const editableFields = [
    'title', 'description', 'priority', 'assignedTo', 'labels',
    'dueDate', 'checklist', 'estimatedHours', 'actualHours',
  ];
  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  });

  task.activityLog.push({ user: req.user._id, action: 'updated this task' });
  await task.save();

  const populated = await task.populate([
    { path: 'assignedTo', select: 'name avatar' },
    { path: 'reporter', select: 'name avatar' },
    { path: 'activityLog.user', select: 'name avatar' },
  ]);

  getIO().to(`project:${task.project}`).emit('taskUpdated', populated);
  res.json({ success: true, task: populated });
});

// @desc    Move a task to a new column / reorder it (drag & drop)
// @route   PATCH /api/tasks/:id/move
// @access  Private (member+)
const moveTask = asyncHandler(async (req, res) => {
  const { status, order } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const { project, role } = await assertMembership(task.project, req.user._id);
  if (role === 'viewer') {
    res.status(403);
    throw new Error('Viewers cannot move tasks');
  }
  if (status && !project.columns.includes(status)) {
    res.status(400);
    throw new Error('Invalid column status for this project');
  }

  const previousStatus = task.status;
  task.status = status ?? task.status;
  task.order = order ?? task.order;

  if (status && status !== previousStatus) {
    task.activityLog.push({ user: req.user._id, action: `moved task to ${status}` });
    if (status === project.columns[project.columns.length - 1]) {
      // reached the final column -> treat as completed
      task.activityLog.push({ user: req.user._id, action: 'marked task completed' });

      // Notify reporter + any other assignees (excluding the action-taker)
      const notifyUsers = new Set([task.reporter.toString(), ...task.assignedTo.map(String)]);
      notifyUsers.delete(req.user._id.toString());
      if (notifyUsers.size > 0) {
        const notifications = [...notifyUsers].map((uid) => ({
          receiver: uid,
          sender: req.user._id,
          type: 'task_completed',
          message: `${req.user.name} completed the task: "${task.title}"`,
          project: task.project,
          task: task._id,
        }));
        const createdNotifications = await Notification.insertMany(notifications);
        for (const notif of createdNotifications) {
          const populatedNotif = await notif.populate('sender', 'name avatar');
          try {
            getIO().to(`user:${notif.receiver}`).emit('notificationReceived', populatedNotif);
          } catch (err) {
            console.error('Error emitting task completed notification:', err);
          }
        }
      }
    }
  }

  await task.save();

  getIO().to(`project:${task.project}`).emit('taskMoved', {
    taskId: task._id,
    status: task.status,
    order: task.order,
  });

  res.json({ success: true, task });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (owner/admin, or the reporter)
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const { role } = await assertMembership(task.project, req.user._id);
  const isReporter = task.reporter.toString() === req.user._id.toString();
  if (role === 'viewer' || (role === 'member' && !isReporter)) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  await task.deleteOne();
  getIO().to(`project:${task.project}`).emit('taskDeleted', { taskId: task._id });

  res.json({ success: true, message: 'Task deleted' });
});

module.exports = { createTask, updateTask, moveTask, deleteTask };

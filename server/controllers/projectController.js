const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { getIO } = require('../socket/socket');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { name, description, deadline, priority } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Project name is required');
  }

  const project = await Project.create({
    name,
    description,
    deadline,
    priority,
    owner: req.user._id,
    members: [{ user: req.user._id, role: 'owner' }],
  });

  res.status(201).json({ success: true, project });
});

// @desc    Get all projects the logged-in user belongs to
// @route   GET /api/projects
// @access  Private
const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ 'members.user': req.user._id })
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .sort('-createdAt');

  res.json({ success: true, count: projects.length, projects });
});

// @desc    Get a single project by id (includes tasks grouped by column)
// @route   GET /api/projects/:id
// @access  Private (must be a member)
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const role = project.getRole(req.user._id);
  if (!role) {
    res.status(403);
    throw new Error('You are not a member of this project');
  }

  const tasks = await Task.find({ project: project._id })
    .populate('assignedTo', 'name avatar')
    .populate('reporter', 'name avatar')
    .populate('activityLog.user', 'name avatar')
    .sort('order');

  res.json({ success: true, project, tasks, yourRole: role });
});

// @desc    Update project details
// @route   PUT /api/projects/:id
// @access  Private (owner/admin only - see requireRole middleware on route)
const updateProject = asyncHandler(async (req, res) => {
  const { name, description, status, priority, deadline, columns } = req.body;
  const project = req.project; // attached by requireRole middleware

  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;
  if (status !== undefined) project.status = status;
  if (priority !== undefined) project.priority = priority;
  if (deadline !== undefined) project.deadline = deadline;
  if (columns !== undefined) project.columns = columns;

  await project.save();
  res.json({ success: true, project });
});

// @desc    Delete a project (and its tasks)
// @route   DELETE /api/projects/:id
// @access  Private (owner only)
const deleteProject = asyncHandler(async (req, res) => {
  const project = req.project;
  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the project owner can delete this project');
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  res.json({ success: true, message: 'Project and its tasks deleted' });
});

// @desc    Invite / add a member to a project by email
// @route   POST /api/projects/:id/members
// @access  Private (owner/admin)
const addMember = asyncHandler(async (req, res) => {
  const { email, role = 'member' } = req.body;
  const project = req.project;

  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) {
    res.status(404);
    throw new Error('No user found with that email');
  }

  const alreadyMember = project.members.some((m) => m.user.toString() === user._id.toString());
  if (alreadyMember) {
    res.status(400);
    throw new Error('User is already a member of this project');
  }

  project.members.push({ user: user._id, role });
  await project.save();

  const notification = await Notification.create({
    receiver: user._id,
    sender: req.user._id,
    type: 'project_invite',
    message: `${req.user.name} added you to project "${project.name}"`,
    project: project._id,
  });

  const populatedNotification = await notification.populate('sender', 'name avatar');
  try {
    getIO().to(`user:${user._id}`).emit('notificationReceived', populatedNotification);
  } catch (err) {
    console.error('Error emitting notification via socket:', err);
  }

  await project.populate([
    { path: 'owner', select: 'name email avatar' },
    { path: 'members.user', select: 'name email avatar' },
  ]);

  res.json({ success: true, project });
});

// @desc    Remove a member from a project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (owner/admin)
const removeMember = asyncHandler(async (req, res) => {
  const project = req.project;
  const { userId } = req.params;

  if (project.owner.toString() === userId) {
    res.status(400);
    throw new Error('Cannot remove the project owner');
  }

  project.members = project.members.filter((m) => m.user.toString() !== userId);
  await project.save();

  await project.populate([
    { path: 'owner', select: 'name email avatar' },
    { path: 'members.user', select: 'name email avatar' },
  ]);

  res.json({ success: true, project });
});

module.exports = {
  createProject,
  getMyProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};

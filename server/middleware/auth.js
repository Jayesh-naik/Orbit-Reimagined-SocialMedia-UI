const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Project = require('../models/Project');

// Verifies the access token and attaches req.user
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      res.status(401);
      throw new Error('User no longer exists');
    }
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized, token invalid or expired');
  }
});

// Checks the requesting user's role on the :projectId in the route
// Usage: requireRole(['owner', 'admin'])
const requireRole = (allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    const projectId = req.params.projectId || req.body.project || req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const role = project.getRole(req.user._id);
    if (!role || !allowedRoles.includes(role)) {
      res.status(403);
      throw new Error('Not authorized for this action on this project');
    }

    req.project = project;
    req.userRole = role;
    next();
  });

module.exports = { protect, requireRole };

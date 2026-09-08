const express = require('express');
const router = express.Router();
const {
  createProject,
  getMyProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { protect, requireRole } = require('../middleware/auth');
const taskRoutes = require('./taskRoutes');

router.use(protect);

router.route('/').post(createProject).get(getMyProjects);
router.route('/:id').get(getProject).put(requireRole(['owner', 'admin']), updateProject).delete(requireRole(['owner']), deleteProject);

router.post('/:id/members', requireRole(['owner', 'admin']), addMember);
router.delete('/:id/members/:userId', requireRole(['owner', 'admin']), removeMember);

// Nested: /api/projects/:projectId/tasks
router.use('/:projectId/tasks', taskRoutes);

module.exports = router;

const express = require('express');
const router = express.Router({ mergeParams: true });
const { createTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);

// POST /api/projects/:projectId/tasks  (list-by-project is returned via GET /api/projects/:id)
router.post('/', createTask);

module.exports = router;

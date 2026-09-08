const express = require('express');
const router = express.Router();
const { updateTask, moveTask, deleteTask } = require('../controllers/taskController');
const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// All routes here assume /api/tasks as the base path
router.use(protect);

router.put('/:id', updateTask);
router.patch('/:id/move', moveTask);
router.delete('/:id', deleteTask);

router.route('/:taskId/comments').post(addComment).get(getComments);
router.delete('/comments/:id', deleteComment);

module.exports = router;

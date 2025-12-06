const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// POST /api/projects/:projectId/tasks
router.post('/:projectId/tasks', taskController.createTask);

// PUT /api/tasks/:id
router.put('/:id', taskController.updateTask);

// GET /api/projects/:projectId/tasks
router.get('/:projectId/tasks', taskController.getTasksByProject);

module.exports = router;
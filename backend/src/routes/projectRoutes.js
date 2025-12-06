const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// POST /api/projects
router.post('/', projectController.createProject);

// GET /api/projects
router.get('/', projectController.getProjects);

// GET /api/projects/:id
router.get('/:id', projectController.getProjectById);

// PUT /api/projects/:id
router.put('/:id', projectController.updateProject);

// POST /api/projects/:id/invite
router.post('/:id/invite', projectController.inviteUser);

// POST /api/projects/:id/join
router.post('/:id/join', projectController.requestToJoin);

module.exports = router;
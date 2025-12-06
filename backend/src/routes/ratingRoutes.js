const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

// POST /api/projects/:projectId/rate
router.post('/projects/:projectId/rate', ratingController.rateTeammate);

module.exports = router;
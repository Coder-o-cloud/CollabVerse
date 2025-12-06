const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// POST /api/match
router.post('/', matchController.getMatches);

module.exports = router;
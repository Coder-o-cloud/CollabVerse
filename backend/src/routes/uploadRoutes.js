const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// POST /api/uploads
router.post('/', uploadController.upload, uploadController.uploadFile);

module.exports = router;
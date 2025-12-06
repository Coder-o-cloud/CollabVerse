const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users
router.get('/', userController.getUsers);

// GET /api/users/:id
router.get('/:id', userController.getUserById);

// PUT /api/users/:id
router.put('/:id', userController.updateUser);

module.exports = router;
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');

// GET /api/users  (Admin only)
router.get('/', authenticate, authorize(['Admin']), userController.getAllUsers);

// GET /api/users/:id
router.get('/:id', authenticate, userController.getUserById);

// PUT /api/users/:id (Admin only)
router.put('/:id', authenticate, authorize(['Admin']), userController.updateUser);

// DELETE /api/users/:id (Admin only)
router.delete('/:id', authenticate, authorize(['Admin']), userController.deleteUser);

module.exports = router;

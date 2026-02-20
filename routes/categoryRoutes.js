// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middleware/auth');

// GET /api/categories
router.get('/', authenticate, categoryController.getAllCategories);

// GET /api/categories/audit
router.get('/audit', authenticate, categoryController.getAuditCategories);

// GET /api/categories/phases
router.get('/phases', authenticate, categoryController.getAllPhases);

module.exports = router;

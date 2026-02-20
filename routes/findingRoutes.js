// routes/findingRoutes.js
const express = require('express');
const router = express.Router();
const findingController = require('../controllers/findingController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');

// GET /api/findings
router.get('/', authenticate, authorize(['Auditor', 'Admin']), findingController.getAllFindings);

// POST /api/findings
router.post('/', authenticate, authorize(['Auditor', 'Admin']), findingController.createFinding);

// GET /api/findings/:id
router.get('/:id', authenticate, authorize(['Auditor', 'Admin']), findingController.getFindingById);

// PATCH /api/findings/:id/status
router.patch('/:id/status', authenticate, authorize(['Auditor', 'Admin']), findingController.updateFindingStatus);

module.exports = router;


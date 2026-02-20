// routes/checklistRoutes.js
const express = require('express');
const router = express.Router();
const checklistController = require('../controllers/checklistController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');

// GET /api/checklist?phase_id=1
router.get('/', authenticate, checklistController.getChecklistByPhase);

// POST /api/checklist (Admin only)
router.post('/', authenticate, authorize(['Admin']), checklistController.createChecklistItem);

// DELETE /api/checklist/:id (Admin only)
router.delete('/:id', authenticate, authorize(['Admin']), checklistController.deleteChecklistItem);

module.exports = router;

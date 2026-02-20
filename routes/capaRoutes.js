// routes/capaRoutes.js
const express = require('express');
const router = express.Router();
const capaController = require('../controllers/capaController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');

// POST /api/capa
router.post('/', authenticate, authorize(['Auditor', 'Admin']), capaController.createCapaAction);

// GET /api/capa
router.get('/', authenticate, authorize(['Auditor', 'Admin']), capaController.getAllCapaActions);

// PATCH /api/capa/:id/status
router.patch('/:id/status', authenticate, authorize(['Auditor', 'Admin']), capaController.updateCapaStatus);

module.exports = router;

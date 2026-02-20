// routes/auditRoutes.js
const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const auditSubmissionController = require('../controllers/auditSubmissionController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');

// GET /api/audit/sessions - List all sessions
router.get('/sessions', authenticate, auditController.getAllSessions);

// POST /api/audit/start - Start a new audit session
router.post('/start', authenticate, authorize(['Entity', 'Auditor', 'Admin']), auditController.createAuditSession);

// GET /api/audit/session/:id - Get a specific session
router.get('/session/:id', authenticate, auditController.getAuditSession);

// GET /api/audit/session/:id/results - Get all results for a session
router.get('/session/:id/results', authenticate, auditController.getSessionResults);

// POST /api/audit/submit-item - Submit a single checklist item answer
router.post('/submit-item', authenticate, auditSubmissionController.submitAuditItem);

module.exports = router;

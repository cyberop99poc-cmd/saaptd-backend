// controllers/auditController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/audit/start
exports.createAuditSession = async (req, res) => {
    const { entity_id, auditor_id, category_id, audit_date } = req.body;

    try {
        const newSession = await prisma.audit_sessions.create({
            data: {
                entity_id: entity_id ? parseInt(entity_id) : null,
                auditor_id: auditor_id ? parseInt(auditor_id) : null,
                category_id: category_id ? parseInt(category_id) : null,
                audit_date: audit_date ? new Date(audit_date) : null,
                status: 'Draft'
            }
        });
        res.status(201).json(newSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to initialize audit session.' });
    }
};

// GET /api/audit/session/:id
exports.getAuditSession = async (req, res) => {
    const { id } = req.params;
    try {
        const session = await prisma.audit_sessions.findUnique({
            where: { id: parseInt(id) },
            include: { audit_results: true }
        });
        if (!session) return res.status(404).json({ error: 'Session not found.' });
        res.status(200).json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch audit session.' });
    }
};

// GET /api/audit/session/:id/results
exports.getSessionResults = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await prisma.audit_results.findMany({
            where: { session_id: parseInt(id) },
            include: {
                checklist_items: true,
                audit_evidence: true
            },
            orderBy: { id: 'asc' }
        });
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch session results.' });
    }
};

// GET /api/audit/sessions - list all sessions
exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await prisma.audit_sessions.findMany({
            orderBy: { id: 'desc' }
        });
        res.status(200).json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch sessions.' });
    }
};
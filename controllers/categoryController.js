// controllers/categoryController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.categories.findMany({ orderBy: { id: 'asc' } });
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories.' });
    }
};

// GET /api/categories/audit
exports.getAuditCategories = async (req, res) => {
    try {
        const auditCategories = await prisma.audit_categories.findMany({ orderBy: { id: 'asc' } });
        res.status(200).json(auditCategories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch audit categories.' });
    }
};

// GET /api/categories/phases
exports.getAllPhases = async (req, res) => {
    try {
        const phases = await prisma.audit_phases.findMany({ orderBy: { order: 'asc' } });
        res.status(200).json(phases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch audit phases.' });
    }
};

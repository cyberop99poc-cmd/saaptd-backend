// controllers/checklistController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/checklist?phase_id=1
exports.getChecklistByPhase = async (req, res) => {
    const { phase_id } = req.query;
    try {
        const where = phase_id ? { phase_id: parseInt(phase_id) } : {};
        const items = await prisma.checklist_items.findMany({
            where,
            include: { audit_phases: true },
            orderBy: { id: 'asc' }
        });
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch checklist items.' });
    }
};

// POST /api/checklist
exports.createChecklistItem = async (req, res) => {
    const { phase_id, description, weight } = req.body;

    if (!description) return res.status(400).json({ error: 'Description is required.' });

    try {
        const item = await prisma.checklist_items.create({
            data: {
                phase_id: phase_id ? parseInt(phase_id) : null,
                description,
                weight: weight || 1
            }
        });
        res.status(201).json({ message: 'Checklist item created.', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create checklist item.' });
    }
};

// DELETE /api/checklist/:id
exports.deleteChecklistItem = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.checklist_items.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Checklist item deleted.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete checklist item.' });
    }
};

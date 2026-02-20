// controllers/capaController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/capa
exports.createCapaAction = async (req, res) => {
    const { finding_id, root_cause, action_plan, due_date } = req.body;

    if (!finding_id) {
        return res.status(400).json({ error: 'finding_id is required.' });
    }

    try {
        const capa = await prisma.capa_actions.create({
            data: {
                finding_id: parseInt(finding_id),
                root_cause: root_cause || null,
                action_plan: action_plan || null,
                due_date: due_date ? new Date(due_date) : null,
                status: 'Open'
            }
        });
        res.status(201).json({ message: 'CAPA action created.', capa });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create CAPA action.' });
    }
};

// GET /api/capa
exports.getAllCapaActions = async (req, res) => {
    try {
        const capas = await prisma.capa_actions.findMany({
            include: { findings: true },
            orderBy: { id: 'desc' }
        });
        res.status(200).json(capas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch CAPA actions.' });
    }
};

// PATCH /api/capa/:id/status
exports.updateCapaStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'Open' | 'In_Progress' | 'Closed'

    const validStatuses = ['Open', 'In_Progress', 'Closed'];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
    }

    try {
        const capa = await prisma.capa_actions.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.status(200).json({ message: 'CAPA status updated.', capa });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update CAPA status.' });
    }
};

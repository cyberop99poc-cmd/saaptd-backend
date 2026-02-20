// controllers/findingController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/findings
exports.getAllFindings = async (req, res) => {
    try {
        const findings = await prisma.findings.findMany({
            include: {
                categories: true,
                capa_actions: true,
                evidence: true
            },
            orderBy: { created_at: 'desc' }
        });
        res.status(200).json(findings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch findings.' });
    }
};

// POST /api/findings
exports.createFinding = async (req, res) => {
    const { category_id, auditor_id, entity_id, observation, finding_status } = req.body;

    if (!observation || !observation.trim()) {
        return res.status(400).json({ error: 'observation is required.' });
    }

    const validStatuses = ['Kritikal', 'Lazim', 'Berulang'];
    const status = finding_status && validStatuses.includes(finding_status) ? finding_status : 'Lazim';

    try {
        const finding = await prisma.findings.create({
            data: {
                category_id: category_id ? parseInt(category_id) : null,
                auditor_id: auditor_id ? parseInt(auditor_id) : null,
                entity_id: entity_id ? parseInt(entity_id) : null,
                observation: observation.trim(),
                finding_status: status,
            },
            include: { categories: true, capa_actions: true, evidence: true }
        });
        res.status(201).json(finding);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create finding.' });
    }
};


// GET /api/findings/:id
exports.getFindingById = async (req, res) => {
    const { id } = req.params;
    try {
        const finding = await prisma.findings.findUnique({
            where: { id: parseInt(id) },
            include: { capa_actions: true, evidence: true, categories: true }
        });
        if (!finding) return res.status(404).json({ error: 'Finding not found.' });
        res.status(200).json(finding);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch finding.' });
    }
};

// PATCH /api/findings/:id/status
exports.updateFindingStatus = async (req, res) => {
    const { id } = req.params;
    const { finding_status } = req.body; // 'Sesuai' | 'Tidak_Sesuai' | 'Pemerhatian'

    const validStatuses = ['Kritikal', 'Lazim', 'Berulang'];
    if (!finding_status || !validStatuses.includes(finding_status)) {
        return res.status(400).json({ error: `finding_status must be one of: ${validStatuses.join(', ')}` });
    }

    try {
        const finding = await prisma.findings.update({
            where: { id: parseInt(id) },
            data: { finding_status }
        });
        res.status(200).json({ message: 'Finding status updated.', finding });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update finding status.' });
    }
};

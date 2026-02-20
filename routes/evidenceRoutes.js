// routes/evidenceRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { PrismaClient } = require('@prisma/client');
const authenticate = require('../middleware/auth');
const prisma = new PrismaClient();

// POST /api/evidence/upload
router.post('/upload', authenticate, upload.single('evidence'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        // Save to 'evidence' table
        const newEvidence = await prisma.evidence.create({
            data: {
                file_path: `/uploads/evidence/${req.file.filename}`,
                file_type: req.file.mimetype,
                original_name: req.file.originalname,
                created_at: new Date()
            }
        });

        res.status(201).json({
            evidenceId: newEvidence.id,
            url: newEvidence.file_path
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'File record creation failed' });
    }
});

// GET /api/evidence/:id
router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const evidence = await prisma.evidence.findUnique({ where: { id: parseInt(id) } });
        if (!evidence) return res.status(404).json({ error: 'Evidence not found.' });
        res.status(200).json(evidence);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch evidence.' });
    }
});

module.exports = router;
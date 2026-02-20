// controllers/auditSubmissionController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/audit/submit-item
// Submits a single checklist item answer for a session
exports.submitAuditItem = async (req, res) => {
    const { session_id, item_id, score_given, markah_dapat, comment } = req.body;

    if (!session_id || !item_id) {
        return res.status(400).json({ error: 'session_id and item_id are required.' });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Record the individual answer in audit_results
            const auditResult = await tx.audit_results.create({
                data: {
                    session_id: parseInt(session_id),
                    item_id: parseInt(item_id),
                    score_given: score_given !== undefined ? parseInt(score_given) : null,
                    markah_dapat: markah_dapat !== undefined ? parseFloat(markah_dapat) : null,
                    comment: comment || null
                }
            });

            // 2. Also record in audit_scores for tracking
            await tx.audit_scores.create({
                data: {
                    audit_id: parseInt(session_id),
                    item_id: parseInt(item_id),
                    score_selected: score_given !== undefined ? parseInt(score_given) : null,
                    marks_obtained: markah_dapat !== undefined ? parseFloat(markah_dapat) : null,
                    comments: comment || null
                }
            });

            // 3. Auto-create a finding if score is 0 (failure)
            if (score_given === 0 || score_given === '0') {
                await tx.findings.create({
                    data: {
                        entity_id: null, // can be set from session if needed
                        auditor_id: null,
                        observation: `Kegagalan dikesan untuk item ${item_id}: ${comment || 'Tiada komen'}`,
                        finding_status: 'Tidak_Sesuai'
                    }
                });
            }

            return auditResult;
        });

        res.status(200).json({ message: 'Audit item submitted successfully.', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Transaction failed. Data rolled back.' });
    }
};
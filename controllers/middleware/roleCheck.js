// middleware/roleCheck.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authorize = (allowedRoles) => {
    return async (req, res, next) => {
        // 1. Assume req.user was populated by your JWT/Auth middleware
        const userId = req.user.id;

        try {
            // 2. Fetch the user and their associated role from MariaDB
            const user = await prisma.users.findUnique({
                where: { id: userId },
                include: { roles: true } // This joins the 'roles' table
            });

            if (!user || !allowedRoles.includes(user.roles.name)) {
                return res.status(403).json({
                    error: "Access Denied: You do not have the required permissions."
                });
            }

            // 3. If role matches, proceed to the controller
            next();
        } catch (error) {
            res.status(500).json({ error: "Internal server error during authorization." });
        }
    };
};

module.exports = authorize;

const express = require('express');
const router = express.Router();
const authorize = require('../middleware/roleCheck');
const auditController = require('../controllers/auditController');
const findingController = require('../controllers/findingController');

// ANY logged-in user can start an audit session
router.post('/start-audit', authorize(['Entity', 'Auditor', 'Admin']), auditController.createAuditSession);

// ONLY Managers and Admins can view the findings and corrective actions
router.get('/findings', authorize(['Auditor', 'Admin']), findingController.getAllFindings);

// ONLY Admins can delete or modify the main checklist_items
router.delete('/checklist/:id', authorize(['Admin']), auditController.deleteItem);

module.exports = router;
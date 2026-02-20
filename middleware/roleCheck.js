// middleware/roleCheck.js - Role-Based Access Control Middleware
// NOTE: The users table has an inline 'role' enum field (Superadmin, Admin, Auditor, Entity)
// The JWT token carries { id, username, role } so we read directly from req.user

/**
 * authorize(allowedRoles) - checks if the logged-in user's role is in the allowed list.
 * Requires authenticate middleware to run first (req.user must be set).
 * Usage: router.get('/route', authenticate, authorize(['Admin', 'Auditor']), controller)
 */
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user && req.user.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                error: `Access Denied: Required role(s): ${allowedRoles.join(', ')}. Your role: ${userRole || 'none'}`
            });
        }

        next();
    };
};

module.exports = authorize;

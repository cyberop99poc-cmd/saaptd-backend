// controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// POST /api/auth/register
exports.register = async (req, res) => {
    const { username, password, full_name, role, entity_name } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: 'username, password, and role are required.' });
    }

    // Validate role enum
    const validRoles = ['Superadmin', 'Admin', 'Auditor', 'Entity'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: `role must be one of: ${validRoles.join(', ')}` });
    }

    try {
        const existingUser = await prisma.users.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already taken.' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: { username, password_hash, full_name, role, entity_name },
            select: { id: true, username: true, full_name: true, role: true, entity_name: true }
        });

        res.status(201).json({ message: 'User registered successfully.', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed.' });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required.' });
    }

    try {
        const user = await prisma.users.findUnique({ where: { username } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                role: user.role,
                entity_name: user.entity_name
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed.' });
    }
};

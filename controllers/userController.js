// controllers/userController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            select: { id: true, username: true, full_name: true, role: true, entity_name: true }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.users.findUnique({
            where: { id: parseInt(id) },
            select: { id: true, username: true, full_name: true, role: true, entity_name: true }
        });
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user.' });
    }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { full_name, role, entity_name } = req.body;
    try {
        const user = await prisma.users.update({
            where: { id: parseInt(id) },
            data: { full_name, role, entity_name },
            select: { id: true, username: true, full_name: true, role: true, entity_name: true }
        });
        res.status(200).json({ message: 'User updated.', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user.' });
    }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.users.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'User deleted.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user.' });
    }
};

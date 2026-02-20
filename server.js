// server.js - Main Express Entry Point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const auditRoutes = require('./routes/auditRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const findingRoutes = require('./routes/findingRoutes');
const capaRoutes = require('./routes/capaRoutes');
const checklistRoutes = require('./routes/checklistRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/findings', findingRoutes);
app.use('/api/capa', capaRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/categories', categoryRoutes);

// ── Health Check ──────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ message: 'SAAPTD Audit System API is running', status: 'OK' });
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

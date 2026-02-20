// server.js - Main Express Entry Point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: [
    "https://saaptd.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
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

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/audit', auditRoutes);
app.use('/evidence', evidenceRoutes);
app.use('/findings', findingRoutes);
app.use('/capa', capaRoutes);
app.use('/checklist', checklistRoutes);
app.use('/categories', categoryRoutes);

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
    console.log(`✅ Server running on https://railway.com`);
});

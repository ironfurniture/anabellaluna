const express = require('express');
const AuditLog = require('../models/AuditLog');

const router = express.Router();

// List audit logs (simple)
router.get('/', async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('user', 'username').sort({ timestamp: -1 }).limit(200).exec();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

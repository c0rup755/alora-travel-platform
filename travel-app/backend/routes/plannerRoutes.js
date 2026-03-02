const express = require('express');
const router = express.Router();

// GET /api/planner (when mounted at /api/planner)
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [],
    count: 0
  });
});

// POST /api/planner/add
router.post('/add', (req, res) => {
  // Your add logic
  res.json({ success: true, data: req.body });
});

// DELETE /api/planner/:id
router.delete('/:id', (req, res) => {
  // Your delete logic
  res.json({ success: true });
});

// ✅ CRITICAL: This line MUST be at the bottom!
module.exports = router;
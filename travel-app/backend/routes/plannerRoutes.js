const express = require('express');
const router = express.Router();

// Mock planner data (replace with database later)
let plannerItems = [];

// GET /api/planner
router.get('/', (req, res) => {
  res.json({
    success: true,
    plannerItems,
    count: plannerItems.length
  });
});

// POST /api/planner/add
router.post('/add', (req, res) => {
  const newItem = {
    id: Date.now().toString(),
    ...req.body,
    addedAt: new Date().toISOString()
  };
  plannerItems.push(newItem);
  res.json({ success: true, data: newItem });
});

// DELETE /api/planner/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = plannerItems.length;
  plannerItems = plannerItems.filter(item => item.id !== id);
  
  if (plannerItems.length < initialLength) {
    res.json({ success: true, message: 'Item removed' });
  } else {
    res.status(404).json({ success: false, error: 'Item not found' });
  }
});

// PUT /api/planner/clear
router.put('/clear', (req, res) => {
  plannerItems = [];
  res.json({ success: true, message: 'Planner cleared' });
});

// ✅✅✅ THIS LINE GOES HERE - AT THE VERY END ✅✅✅
module.exports = router;
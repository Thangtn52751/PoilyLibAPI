const express = require('express');
const router  = express.Router();
const Notification = require('../models/Notification');
// ─── fetch only this user’s notifications ─────────────────────────────────────
router.get('/user/:userId', async (req, res) => {
  try {
    const notes = await Notification
      .find({ id_customer: req.params.userId })
      .sort({ create_date: -1 })
      .lean();
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load user notifications' });
  }
});

// ─── mark one as read ──────────────────────────────────────────────────────────
router.put('/:id/read', async (req, res) => {
  try {
    const note = await Notification.findByIdAndUpdate(
      req.params.id,
      { status: 1 },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Marked read', note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not mark read' });
  }
});

module.exports = router;
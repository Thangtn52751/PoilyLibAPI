// ─── routes/notificationRoutes.js ────────────────────────────────────────────
const express      = require('express');
const router       = express.Router();
const Notification = require('../models/Notification');

// 📌 Get all notifications (admin)
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('id_customer', 'fullname email phone')
      .populate('id_employee', 'fullname email phone')
      .sort({ create_date: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
});

// 📌 Get notifications for one user (customer)
router.get('/user/:userId', async (req, res) => {
  try {
    const notes = await Notification.find({ id_customer: req.params.userId })
      .populate('id_employee', 'fullname')
      .sort({ create_date: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user notifications', error });
  }
});

// 📌 Get single notification by ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Notification.findById(req.params.id)
      .populate('id_customer', 'fullname email')
      .populate('id_employee', 'fullname email');
    if (!note) return res.status(404).json({ message: 'Not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notification', error });
  }
});

// 📌 Create a new notification
router.post('/', async (req, res) => {
  try {
    const { title, content, id_customer, id_employee, status } = req.body;
    const note = new Notification({ title, content, id_customer, id_employee, status });
    await note.save();
    res.status(201).json({ message: 'Notification created', note });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
});

// 📌 Update notification
router.put('/:id', async (req, res) => {
  try {
    const note = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!note) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Updated', note });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error });
  }
});

// 📌 Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const note = await Notification.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error });
  }
});

module.exports = router;

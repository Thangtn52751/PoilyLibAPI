// routes/cronRoutes.js
const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const Notification = require('../models/Notification');

// POST /api/cron/run-due
// Duyệt qua tất cả Loan, tính ngày còn lại tới return_date,
// nếu 5 ngày, 3 ngày hoặc đã quá hạn thì sinh Notification tương ứng.
router.post('/run-due', async (req, res) => {
  try {
    const loans = await Loan.find().populate('id_customer');
    const now = new Date();

    for (const loan of loans) {
      if (!loan.return_date || !loan.id_customer) continue;

      // số ngày còn lại (dương nếu còn hạn, âm nếu quá hạn)
      const diffMs = loan.return_date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      let title, content;
      if (diffDays === 5) {
        title   = '📢 5 Days Until Due';
        content = `Your loan is due on ${loan.return_date.toLocaleDateString()}. Please return it in 5 days.`;
      } else if (diffDays === 3) {
        title   = '⚠️ 3 Days Left to Return';
        content = `Reminder: Your loan is due on ${loan.return_date.toLocaleDateString()} (3 days left).`;
      } else if (diffDays <= 0) {
        title   = '❗ Overdue Book';
        content = `Your loan was due on ${loan.return_date.toLocaleDateString()}. Please return it immediately.`;
      } else {
        continue;
      }

      // Tạo notification (để demo tạm thời bỏ trùng lặp)
      await Notification.create({
        title,
        content,
        id_customer: loan.id_customer._id,
        id_employee: null 
      });
    }

    res.json({ message: 'Due-check run successfully' });
  } catch (err) {
    console.error('Error in cron run-due:', err);
    res.status(500).json({ message: 'Error running due-check', error: err.message });
  }
});

module.exports = router;

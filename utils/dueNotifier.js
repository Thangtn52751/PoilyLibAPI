const cron = require('node-cron');
const Loan = require('../models/Loan');
const Notification = require('../models/Notification');

/**
 * Sinh các thông báo cho từng phiếu mượn:
 * - 5 ngày trước hạn
 * - 3 ngày trước hạn
 * - Đúng ngày trả
 * - Quá hạn
 */
async function generateNotifications() {
  const now = new Date();
  // làm tròn về 0h
  const today = new Date(now.setHours(0,0,0,0));

  const in3 = new Date(today.getTime() + 3*24*60*60*1000);
  const in5 = new Date(today.getTime() + 5*24*60*60*1000);

  // helper tạo 1 notification
  async function makeNote(loan, title, content) {
    await Notification.create({
      title,
      content,
      id_customer: loan.id_customer,
      id_employee: loan.id_employee || loan.id_customer,
      status: 0,
    });
  }

  // lấy tất cả phiếu đã được set return_date
  const loans = await Loan.find({ return_date: { $exists: true } });

  for (let loan of loans) {
    if (!loan.return_date) continue;

    // reset giờ về 0h
    const rd = new Date(loan.return_date).setHours(0,0,0,0);

    if (rd === today.getTime()) {
      await makeNote(loan, 'Due today', 'Your loan is due today.');
    } else if (rd === in3.getTime()) {
      await makeNote(loan, 'Due in 3 days', 'Your loan is due in 3 days.');
    } else if (rd === in5.getTime()) {
      await makeNote(loan, 'Due in 5 days', 'Your loan is due in 5 days.');
    } else if (rd < today.getTime()) {
      await makeNote(loan, 'Overdue', 'Your loan is overdue!');
    }
  }

  console.log('[dueNotifier] run at', new Date().toISOString());
}

// Đặt cron job chạy mỗi ngày vào 08:00 sáng
cron.schedule('0 8 * * *', () => {
  generateNotifications().catch(err => console.error('[dueNotifier]', err));
});

module.exports = {
  generateNotifications
};

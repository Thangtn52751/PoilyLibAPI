const cron = require('node-cron');
const mongoose = require('mongoose');
const Loan = require('./models/Loan');
const Notification = require('./models/Notification');

// Kết nối trước nếu cron chạy riêng
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Hàm sinh nội dung notify dựa trên ngày
function makeMessage(loan, daysLeft) {
  const bookNames = loan.borrow_book.map(b => b.book_id.book_name).join(', ');
  if (daysLeft > 0) {
    return `Your loan for [${bookNames}] is due in ${daysLeft} day${daysLeft>1?'s':''}.`;
  } else if (daysLeft === 0) {
    return `Your loan for [${bookNames}] is due today.`;
  } else {
    return `Your loan for [${bookNames}] is overdue by ${-daysLeft} day${-daysLeft>1?'s':''}!`;
  }
}

// Job chạy mỗi ngày 9:00
cron.schedule('* * * * 1', async () => {
  console.log('📅 Running due-date notification job…');
  const now = new Date();

  // Lấy tất cả các loan đã được duyệt (status=1)
  const loans = await Loan.find({ status: 1 })
    .populate('borrow_book.book_id', 'book_name')
    .populate('id_customer', '_id');

  for (const loan of loans) {
    const diffMs = loan.return_date - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // Chỉ quan tâm đến -∞ < diffDays <= 5
    const notifyDays = [10,5,3,2,1,0];
    if (notifyDays.includes(diffDays) || diffDays < 0) {
      const content = makeMessage(loan, diffDays);
      await Notification.create({
        title: diffDays < 0 ? 'Overdue Loan' : 'Loan Due Reminder',
        content,
        id_customer: loan.id_customer._id,
        id_employee: null,
        status: 0
      });
      console.log(`  • Notified user ${loan.id_customer._id} (${diffDays} days)`);
    }
  }
});

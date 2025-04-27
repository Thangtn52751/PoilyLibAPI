// routes/loanRoutes.js

const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const Notification = require('../models/Notification');
// 📌 API Lấy danh sách phiếu mượn
router.get('/', async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('id_customer', 'fullname email phone')
      .populate('id_employee', 'fullname email')
      .populate('borrow_book.book_id', 'book_name loan_price');
    res.json(loans);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phiếu mượn:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách phiếu mượn', error: error.message || error });
  }
});

// 📌 API Tạo phiếu mượn sách
router.post('/', async (req, res) => {
  try {
    const { id_customer, id_employee, loan_date, return_date, borrow_book } = req.body;

    if (
      !id_customer ||
      !id_employee ||
      !loan_date ||
      !return_date ||
      !Array.isArray(borrow_book) ||
      borrow_book.length === 0
    ) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
    }

    const newLoan = new Loan({
      id_customer,
      id_employee,
      loan_date: new Date(loan_date),
      return_date: new Date(return_date),
      borrow_book
    });

    await newLoan.save();

    res.status(201).json({ message: 'Tạo phiếu mượn thành công!', loan: newLoan });
  } catch (error) {
    console.error('Lỗi khi tạo phiếu mượn:', error);
    res.status(500).json({ message: 'Lỗi khi tạo phiếu mượn', error: error.message || error });
  }
});

router.get('/user/:customerId', async (req, res) => {
  try {
    const loans = await Loan.find({ id_customer: req.params.customerId })
      .populate('id_customer','fullname')
      .populate('id_employee','fullname')
      .populate('borrow_book.book_id','book_name');
    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch user loans' });
  }
});

// 📌 API Cập nhật status, người duyệt và ngày trả của phiếu mượn
router.put('/:id', async (req, res) => {
  try {
    const { status, id_employee, return_date } = req.body;

    // build our updates object
    const updates = {};
    if (typeof status === 'number') updates.status = status;
    if (id_employee)              updates.id_employee  = id_employee;
    if (return_date)              updates.return_date = new Date(return_date);

    // perform the update + populate
    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )
    .populate('id_customer', 'fullname email')
    .populate('borrow_book.book_id', 'book_name');

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Create a notification for the user
    let title, content;
    if (status === 1) {
      title   = '✅ Your loan has been approved';
      content = `Hi ${loan.id_customer.fullname}, your loan for "${loan.borrow_book.map(b=>b.book_id.book_name).join(', ')}" ` +
                `has been approved. Please return by ${loan.return_date.toLocaleDateString()}.`;
    } else if (status === 2) {
      title   = '⚠️ Your loan is overdue';
      content = `Hi ${loan.id_customer.fullname}, your loan for "${loan.borrow_book.map(b=>b.book_id.book_name).join(', ')}" ` +
                `was due on ${loan.return_date.toLocaleDateString()}. Please return immediately to avoid extra penalties.`;
    }

    if (title && content) {
      await Notification.create({
        title,
        content,
        id_customer: loan.id_customer._id,
        id_employee,
        create_date: new Date(),
        status: 0
      });
    }

    res.json({ message: 'Loan updated', loan });
  } catch (err) {
    console.error('Error updating loan:', err);
    res.status(500).json({ message: 'Error updating loan', error: err.message });
  }
});

// 📌 API Xóa phiếu mượn
router.delete('/:id', async (req, res) => {
  try {
    const deletedLoan = await Loan.findByIdAndDelete(req.params.id);
    if (!deletedLoan) {
      return res.status(404).json({ message: 'Phiếu mượn không tồn tại!' });
    }
    res.json({ message: 'Xóa phiếu mượn thành công!' });
  } catch (error) {
    console.error('Lỗi khi xóa phiếu mượn:', error);
    res.status(500).json({ message: 'Lỗi khi xóa phiếu mượn', error: error.message || error });
  }
});

module.exports = router;

const express = require('express');
const Loan = require('../models/Loan');

const router = express.Router();

// 📌 API Lấy danh sách phiếu mượn
router.get('/', async (req, res) => {
    try {
        const loans = await Loan.find()
            .populate('id_customer', 'fullname email phone')
            .populate('id_employee', 'fullname email')
            .populate('borrow_book.book_id', 'book_name loan_price');
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách phiếu mượn', error });
    }
});

// 📌 API Tạo phiếu mượn sách
router.post('/', async (req, res) => {
    try {
        const { id_customer, id_employee, loan_date, return_date, borrow_book } = req.body;
        const newLoan = new Loan({ id_customer, id_employee, loan_date, return_date, borrow_book });
        await newLoan.save();
        res.status(201).json({ message: 'Tạo phiếu mượn thành công!', loan: newLoan });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo phiếu mượn', error });
    }
});

// 📌 API Cập nhật trạng thái phiếu mượn (trả sách)
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedLoan = await Loan.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json({ message: 'Cập nhật trạng thái thành công!', loan: updatedLoan });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật phiếu mượn', error });
    }
});

// 📌 API Xóa phiếu mượn
router.delete('/:id', async (req, res) => {
    try {
        await Loan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Xóa phiếu mượn thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa phiếu mượn', error });
    }
});

module.exports = router;

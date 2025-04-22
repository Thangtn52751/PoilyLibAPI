const express = require('express');
const Loan = require('../models/Loan');
const User = require('../models/User');
const Book = require('../models/Book');

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
        console.error('Lỗi chi tiết:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách phiếu mượn', error: error.message || error });
    }
});

// 📌 API Tạo phiếu mượn sách
router.post('/', async (req, res) => {
    try {
        const { id_customer, id_employee, loan_date, return_date, borrow_book } = req.body;

        if (!id_customer || !id_employee || !loan_date || !return_date || !borrow_book || !borrow_book.length) {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
        }

        const newLoan = new Loan({ id_customer, id_employee, loan_date, return_date, borrow_book });
        await newLoan.save();

        res.status(201).json({ message: 'Tạo phiếu mượn thành công!', loan: newLoan });
    } catch (error) {
        console.error('Lỗi khi tạo phiếu mượn:', error);
        res.status(500).json({ message: 'Lỗi khi tạo phiếu mượn', error: error.message || error });
    }
});

// 📌 API Cập nhật trạng thái phiếu mượn
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;

        if (typeof status !== 'number') {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ!' });
        }

        const updatedLoan = await Loan.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updatedLoan) {
            return res.status(404).json({ message: 'Phiếu mượn không tồn tại!' });
        }

        res.json({ message: 'Cập nhật trạng thái thành công!', loan: updatedLoan });
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái phiếu mượn:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật phiếu mượn', error: error.message || error });
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

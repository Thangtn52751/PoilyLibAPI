const express = require('express');
const RegBook = require('../models/RegBook');

const router = express.Router();

// 📌 API Lấy danh sách đăng ký mượn sách
router.get('/', async (req, res) => {
    try {
        const regbooks = await RegBook.find()
            .populate('id_customer', 'fullname email phone')
            .populate('id_employee', 'fullname email')
            .populate('loan_bookid.book_id', 'book_name');
        res.json(regbooks);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách đăng ký', error });
    }
});

// 📌 API Đăng ký mượn sách
router.post('/', async (req, res) => {
    try {
        const { id_customer, loan_bookid, note } = req.body;
        const newRegBook = new RegBook({ id_customer, loan_bookid, note });
        await newRegBook.save();
        res.status(201).json({ message: 'Đăng ký mượn sách thành công!', regbook: newRegBook });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi đăng ký mượn sách', error });
    }
});

// 📌 API Duyệt đăng ký mượn sách
router.put('/:id', async (req, res) => {
    try {
        const { id_employee, status } = req.body;
        const updatedRegBook = await RegBook.findByIdAndUpdate(
            req.params.id, 
            { id_employee, status }, 
            { new: true }
        );
        res.json({ message: 'Cập nhật trạng thái thành công!', regbook: updatedRegBook });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái', error });
    }
});

// 📌 API Xóa đăng ký mượn sách
router.delete('/:id', async (req, res) => {
    try {
        await RegBook.findByIdAndDelete(req.params.id);
        res.json({ message: 'Xóa đăng ký mượn sách thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa đăng ký', error });
    }
});

module.exports = router;

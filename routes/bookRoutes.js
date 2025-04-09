const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Book = require('../models/Book');

// Cấu hình Multer để lưu trữ ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/'); // Lưu vào thư mục uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên ảnh để tránh trùng
    }
});

const upload = multer({ storage: storage });

// 📌 Lấy tất cả sách (có book_type và image_url)
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().populate('book_type');
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 📌 Lấy 1 sách theo ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('book_type');
        if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 📌 Thêm sách mới (bao gồm ảnh)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const book = new Book({
            book_name: req.body.book_name,
            book_type: req.body.book_type,
            loan_price: req.body.loan_price,
            auth: req.body.auth,
            publisher: req.body.publisher,
            des: req.body.des,
            quantity: req.body.quantity,
            image_url: req.file ? `/uploads/${req.file.filename}` : null // Lưu URL ảnh
        });

        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 📌 Cập nhật sách (cập nhật ảnh nếu có)
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
            book_name: req.body.book_name,
            book_type: req.body.book_type,
            loan_price: req.body.loan_price,
            auth: req.body.auth,
            publisher: req.body.publisher,
            des: req.body.des,
            quantity: req.body.quantity,
            image_url: req.file ? `/uploads/${req.file.filename}` : req.body.image_url // Nếu có ảnh mới, thì thay đổi
        }, { new: true }).populate('book_type');

        if (!updatedBook) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 📌 Xóa sách
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });

        await book.remove();
        res.json({ message: 'Sách đã được xóa' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

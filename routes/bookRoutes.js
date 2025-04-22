const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Book = require('../models/Book');

// Cấu hình Multer để lưu ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// 📌 Lấy tất cả sách
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
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Thêm sách mới
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
      image_url: req.file ? `/uploads/${req.file.filename}` : null
    });
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 📌 Cập nhật sách
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
      image_url: req.file ? `/uploads/${req.file.filename}` : req.body.image_url
    }, { new: true }).populate('book_type');

    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 📌 Thêm đánh giá
router.post('/:id/add-rating', async (req, res) => {
  try {
    const { userId, username, comment, stars } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book.ratings.push({ userId, username, comment, stars });
    await book.save();
    res.json({ message: 'Rating added successfully', book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Cập nhật đánh giá
router.put('/:bookId/edit-rating/:ratingId', async (req, res) => {
  try {
    const { comment, stars } = req.body;
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const rating = book.ratings.id(req.params.ratingId);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });

    rating.comment = comment;
    rating.stars = stars;
    await book.save();
    res.json({ message: 'Rating updated', book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Xoá đánh giá
router.delete('/:bookId/delete-rating/:ratingId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book.ratings.id(req.params.ratingId).remove();
    await book.save();
    res.json({ message: 'Rating deleted', book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Xoá sách
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    await Book.deleteOne({ _id: req.params.id });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

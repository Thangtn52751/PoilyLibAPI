const express = require('express');
const router = express.Router();
const TypeBook = require('../models/BookType');

// 📌 Lấy tất cả loại sách
router.get('/', async (req, res) => {
    try {
        const typeBooks = await TypeBook.find();
        res.json(typeBooks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 📌 Lấy 1 loại sách theo ID
router.get('/:id', async (req, res) => {
    try {
        const typeBook = await TypeBook.findById(req.params.id);
        if (!typeBook) return res.status(404).json({ message: 'Không tìm thấy loại sách' });
        res.json(typeBook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 📌 Thêm loại sách mới
router.post('/', async (req, res) => {
    try {
        if (!req.body || !req.body.type) {
            return res.status(400).json({ message: 'Body không hợp lệ hoặc thiếu trường type' });
        }

        const { type } = req.body;
        const typeBook = new TypeBook({ type });
        const newTypeBook = await typeBook.save();
        res.status(201).json(newTypeBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 📌 Cập nhật loại sách theo ID
router.put('/:id', async (req, res) => {
    try {
        const updatedTypeBook = await TypeBook.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTypeBook) return res.status(404).json({ message: 'Không tìm thấy loại sách' });
        res.json(updatedTypeBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 📌 Xoá loại sách
router.delete('/:id', async (req, res) => {
    try {
        const deletedTypeBook = await TypeBook.findByIdAndDelete(req.params.id);
        if (!deletedTypeBook) return res.status(404).json({ message: 'Không tìm thấy loại sách' });
        res.json({ message: 'Xoá thành công', deletedTypeBook });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

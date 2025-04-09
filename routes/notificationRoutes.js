const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// 📌 Lấy tất cả thông báo
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find().populate('id_customer','fullname email phone')
        .populate('id_employee','fullname email phone');
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách thông báo', error });
    }
});

// 📌 Lấy thông báo theo ID
router.get('/:id', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id).populate('id_customer id_employee');
        if (!notification) return res.status(404).json({ message: 'Không tìm thấy thông báo' });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông báo', error });
    }
});

// 📌 Thêm thông báo mới
router.post('/', async (req, res) => {
    try {
        const { title, content, id_customer, id_employee, create_date, status } = req.body;
        const newNotification = new Notification({ title, content, id_customer, id_employee, create_date, status });
        await newNotification.save();
        res.status(201).json({ message: 'Thông báo được tạo thành công', newNotification });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo thông báo', error });
    }
});

// 📌 Cập nhật thông báo
router.put('/:id', async (req, res) => {
    try {
        const updatedNotification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedNotification) return res.status(404).json({ message: 'Không tìm thấy thông báo' });
        res.json({ message: 'Cập nhật thành công', updatedNotification });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật thông báo', error });
    }
});

// 📌 Xóa thông báo
router.delete('/:id', async (req, res) => {
    try {
        const deletedNotification = await Notification.findByIdAndDelete(req.params.id);
        if (!deletedNotification) return res.status(404).json({ message: 'Không tìm thấy thông báo' });
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa thông báo', error });
    }
});

module.exports = router;

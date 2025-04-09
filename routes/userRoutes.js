const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 🔑 Secret Key JWT
const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';

// 📌 Đăng ký tài khoản
router.post('/register', async (req, res) => {
    try {
        const { username, fullname, passwd, email, phone, address } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email đã được sử dụng' });

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(passwd, 10);

        const newUser = new User({
            username, fullname, passwd: hashedPassword, email, phone, address
        });

        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công', user: newUser });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { email, passwd } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'Tài khoản không tồn tại' });

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(passwd, user.passwd);
        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu không đúng' });

        // Tạo token
        const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: 'Đăng nhập thành công', token, user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Lấy danh sách người dùng
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Lấy thông tin 1 người dùng theo ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Cập nhật thông tin người dùng
router.put('/:id', async (req, res) => {
    try {
        const { fullname, phone, address, role, status } = req.body;

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            fullname, phone, address, role, status
        }, { new: true });

        if (!updatedUser) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Xóa người dùng
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        res.json({ message: 'Xóa người dùng thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

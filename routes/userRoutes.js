const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// 🔑 JWT Secret Key
const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';

// 📁 Avatar upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/avatars'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// 📌 Register
router.post('/register', async (req, res) => {
  try {
    const { username, fullname, passwd, email, phone, address } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(passwd, 10);
    const newUser = new User({ username, fullname, passwd: hashedPassword, email, phone, address });
    await newUser.save();

     // Create a welcome notification for this user
    await Notification.create({
     title: '🎉 Welcome to PolyLib!',
     content: `Hi ${newUser.fullname}, thanks for registering at PolyLib. Start exploring our collection now!`,
    id_customer: newUser._id,
    id_employee: null,     // system‑generated
    status: 0,
  });

    res.status(201).json({ message: 'Registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo thư mục nếu chưa tồn tại
const avatarDir = './uploads/avatars';
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

// 📌 Login
router.post('/login', async (req, res) => {
  try {
    const { username, passwd } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(passwd, user.passwd);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Update user info (with avatar support)
router.put('/:id', upload.single('avatar'), async (req, res) => {
  try {
    const { fullname, phone, address, role, status } = req.body;

    const updatedFields = { fullname, phone, address, role, status };
    if (req.file) updatedFields.avatar = `/uploads/avatars/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Send code to email
router.post('/forgot-password/send-code', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not found' });

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetCode = code;
    await user.save();

    sendMail(email, 'Verification Code - PolyLib', `IF you don't remember this action! Your code is: ${code}`);
    res.json({ message: 'Code sent to email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Verify code
router.post('/forgot-password/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email, resetCode: code });
    if (!user) return res.status(400).json({ message: 'Incorrect code' });

    res.json({ message: 'Code verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Reset new password
router.put('/forgot-password/reset', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.passwd = hashed;
    user.resetCode = undefined;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

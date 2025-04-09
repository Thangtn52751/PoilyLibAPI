const mongoose = require('mongoose');

const typeBookSchema = new mongoose.Schema({
    type: { type: String, required: true }
});

module.exports = mongoose.model('typebooks', typeBookSchema); // ✅ Đúng tên collection

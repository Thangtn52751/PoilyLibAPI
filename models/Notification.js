const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    id_customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    id_employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    create_date: { type: Date, default: Date.now },
    image_url:{type:String, default:''},
    status: { type: Number, default: 0 }  // 0: Chưa đọc, 1: Đã đọc
});

module.exports = mongoose.model('Notification', NotificationSchema);

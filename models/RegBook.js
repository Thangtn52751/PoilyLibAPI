const mongoose = require('mongoose');

const RegBookSchema = new mongoose.Schema({
    id_customer: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // Người đăng ký
    id_employee: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // Nhân viên duyệt
    loan_bookid: [{ 
        book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'books', required: true }, 
        quantity: { type: Number, default: 1 } // Số lượng mượn
    }],
    note: { type: String }, // Ghi chú
    status: { type: Number, default: 0 } // 0 = Chờ duyệt, 1 = Đã duyệt, 2 = Từ chối
}, { timestamps: true });

module.exports = mongoose.model('regbooks', RegBookSchema);

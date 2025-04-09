const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    id_customer: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // Người mượn
    id_employee: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // Nhân viên
    loan_date: { type: Date, required: true }, // Ngày mượn
    return_date: { type: Date, required: true }, // Ngày trả dự kiến
    borrow_book: [{ 
        book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'books', required: true }, 
        quantity: { type: Number, default: 1 } // Số lượng mượn
    }],
    status: { type: Number, default: 0 } // 0 = Đang mượn, 1 = Đã trả
}, { timestamps: true });

module.exports = mongoose.model('loans', LoanSchema);

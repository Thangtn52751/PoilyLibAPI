const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    id_customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ sửa 'users' -> 'User'
    id_employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ sửa 'users' -> 'User'
    loan_date: { type: Date, required: true },
    return_date: { type: Date, required: true },
    borrow_book: [{
        book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, default: 1 }
    }],
    status: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Loan', LoanSchema); // ✅ Sửa tên model là 'Loan'

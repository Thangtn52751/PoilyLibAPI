const mongoose = require('mongoose');

const ReturnSchema = new mongoose.Schema({
  id_loans: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true }, // ✅ sửa 'Loans' → 'Loan'
  return_date: { type: Date, required: true },
  penalty: { type: Number, default: 0 },
  id_costumer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ sửa 'Users' → 'User'
  id_employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ sửa 'Users' → 'User'
}, { timestamps: true });

// ✅ đổi tên model thành 'Return'
module.exports = mongoose.model('Return', ReturnSchema);

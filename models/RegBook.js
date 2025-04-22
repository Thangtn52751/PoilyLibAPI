const mongoose = require('mongoose');

const RegBookSchema = new mongoose.Schema({
  id_customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ sửa 'Users' → 'User'
  id_employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ✅ sửa 'Users' → 'User'
  loan_bookid: [{
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // ✅ sửa 'Books' → 'Book'
    quantity: { type: Number, default: 1 }
  }],
  note: { type: String },
  status: { type: Number, default: 0 } // 0 = Chờ duyệt, 1 = Đã duyệt, 2 = Từ chối
}, { timestamps: true });

// ✅ Tên model nên là 'RegBook' (PascalCase)
module.exports = mongoose.model('RegBook', RegBookSchema);

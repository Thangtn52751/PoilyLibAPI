const mongoose = require('mongoose');

const ReturnSchema = new mongoose.Schema({
  id_loans: { type: mongoose.Schema.Types.ObjectId, ref: 'loans', required: true },
  return_date: { type: Date, required: true },
  penalty: { type: Number, default: 0 },
  id_costumer: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  id_employee: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
}, { timestamps: true });

module.exports = mongoose.model('returns', ReturnSchema);

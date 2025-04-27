// models/Return.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReturnSchema = new Schema({
  id_loans:    { type: Schema.Types.ObjectId, ref: 'Loan', required: true },
  return_date: { type: Date, required: true },
  penalty:     { type: Number, default: 0 },
  id_costumer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  id_employee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Return', ReturnSchema);

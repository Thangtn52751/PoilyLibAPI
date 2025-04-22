const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  book_name: { type: String, required: true },
  book_type: { type: mongoose.Schema.Types.ObjectId, ref: 'typebooks', required: true },
  loan_price: { type: String, required: true },
  auth: { type: String, required: true },
  publisher: { type: String, required: true },
  des: { type: String },
  quantity: { type: Number, required: true },
  image_url: { type: String },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: String,
      comment: String,
      stars: Number,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);

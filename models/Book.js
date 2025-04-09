const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    book_name: { type: String, required: true },
    book_type: { type: mongoose.Schema.Types.ObjectId, ref: 'typebooks', required: true },
    loan_price: { type: Number, required: true },
    auth: { type: String, required: true },
    publisher: { type: String, required: true },
    des: { type: String },
    quantity: { type: Number, required: true },
    image_url: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);

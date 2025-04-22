const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    avatar:{type: String, default: ''},
    passwd: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    role: { type: Number, default: 0 },  
    status: { type: Number, default: 1 },
    resetCode: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

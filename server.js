require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

// Import Routes
const bookRoutes = require('./routes/bookRoutes');
const bookTypeRoutes = require('./routes/bookTypeRoutes');
const userRoutes = require('./routes/userRoutes');  
const notificationRoutes = require('./routes/notificationRoutes')
const loanRoutes = require('./routes/loanRoutes');
const regBookRoutes = require('./routes/regBookRoutes');
const returnRoutes = require('./routes/returnRoutes');

// Kết nối MongoDB
connectDB()
    .then(() => console.log('✅ Kết nối MongoDB thành công!'))
    .catch((err) => {
        console.error('❌ Lỗi kết nối MongoDB:', err);
        process.exit(1); // Dừng server nếu lỗi
    });

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/bookTypes', bookTypeRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/notifications', notificationRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/regbooks', regBookRoutes);
app.use('/api/returns', returnRoutes);
app.use('/uploads', express.static('uploads')); 


// Test API
app.get('/', (req, res) => res.send('🚀 PolyLib API đang chạy!'));

// Lắng nghe PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));

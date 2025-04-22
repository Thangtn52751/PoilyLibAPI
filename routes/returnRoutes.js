const express = require('express');
const Return = require('../models/Return');

const router = express.Router();

// 📌 Lấy danh sách trả sách
router.get('/', async (req, res) => {
  try {
    const data = await Return.find()
      .populate({ path: 'id_loans' }) // bạn có thể .select() nếu muốn
      .populate({ path: 'id_costumer', select: 'fullname email' })
      .populate({ path: 'id_employee', select: 'fullname email' });

    res.json(data);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách trả sách:', err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách trả sách', error: err.message || err });
  }
});

// 📌 Thêm mới trả sách
router.post('/', async (req, res) => {
  try {
    const { id_loans, return_date, penalty, id_costumer, id_employee } = req.body;

    const newReturn = new Return({
      id_loans,
      return_date,
      penalty,
      id_costumer,
      id_employee
    });

    await newReturn.save();

    res.status(201).json({ message: 'Trả sách thành công!', data: newReturn });
  } catch (err) {
    console.error('Lỗi khi trả sách:', err);
    res.status(500).json({ message: 'Lỗi khi trả sách', error: err.message || err });
  }
});

// 📌 Xoá thông tin trả sách
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Return.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi để xoá' });
    }
    res.json({ message: 'Đã xoá thành công!' });
  } catch (err) {
    console.error('Lỗi khi xoá trả sách:', err);
    res.status(500).json({ message: 'Lỗi khi xoá', error: err.message || err });
  }
});

module.exports = router;

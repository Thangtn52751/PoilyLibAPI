const express = require('express');
const Return = require('../models/Return');

const router = express.Router();

// Lấy danh sách trả sách
router.get('/', async (req, res) => {
  try {
    const data = await Return.find()
      .populate('id_loans')
      .populate('id_costumer', 'fullname email')
      .populate('id_employee', 'fullname email');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách trả sách', error: err });
  }
});

// Thêm mới trả sách
router.post('/', async (req, res) => {
  try {
    const { id_loans, return_date, penalty, id_costumer, id_employee } = req.body;
    const newReturn = new Return({ id_loans, return_date, penalty, id_costumer, id_employee });
    await newReturn.save();
    res.status(201).json({ message: 'Trả sách thành công!', data: newReturn });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi trả sách', error: err });
  }
});

// Xoá thông tin trả sách
router.delete('/:id', async (req, res) => {
  try {
    await Return.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xoá thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xoá', error: err });
  }
});

module.exports = router;

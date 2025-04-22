// routes/regBookRoutes.js
const express = require('express');
const router  = express.Router();
const RegBook = require('../models/RegBook');
const Loan    = require('../models/Loan');

// GET all registration requests
router.get('/', async (req, res) => {
  try {
    const regs = await RegBook.find()
      .populate('id_customer', 'fullname email phone')
      .populate('id_employee', 'fullname email')
      // include both name & image_url
      .populate('loan_bookid.book_id', 'book_name image_url');

    res.json(regs);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Error fetching registrations', error: err.toString() });
  }
});

// POST a new registration request
router.post('/', async (req, res) => {
  try {
    const { id_customer, loan_bookid, note } = req.body;
    if (!id_customer || !Array.isArray(loan_bookid) || loan_bookid.length === 0) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const reg = new RegBook({ id_customer, loan_bookid, note, status: 0 });
    await reg.save();
    res.status(201).json({ message: 'Registration created', regbook: reg });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Error creating registration', error: err.toString() });
  }
});

// PUT – approve or reject a registration
router.put('/:id', async (req, res) => {
  try {
    const { id_employee, status, return_date } = req.body;
    const reg = await RegBook.findByIdAndUpdate(
      req.params.id,
      { id_employee, status },
      { new: true }
    )
      .populate('id_customer', 'fullname email')
      .populate('loan_bookid.book_id', 'book_name image_url');

    if (!reg) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // If approved (status===1), create a Loan doc
    if (status === 1) {
      const loan = new Loan({
        id_customer: reg.id_customer._id,
        id_employee,
        loan_date: new Date(),
        return_date: return_date ? new Date(return_date) : null,
        borrow_book: reg.loan_bookid.map(item => ({
          book_id: item.book_id._id,
          quantity: item.quantity
        }))
      });
      await loan.save();
    }

    res.json({ message: 'Registration updated', regbook: reg });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Error updating registration', error: err.toString() });
  }
});

// DELETE a registration
router.delete('/:id', async (req, res) => {
  try {
    const reg = await RegBook.findByIdAndDelete(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted registration' });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Error deleting registration', error: err.toString() });
  }
});

module.exports = router;

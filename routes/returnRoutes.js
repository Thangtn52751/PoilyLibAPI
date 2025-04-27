// routes/returns.js
const express = require('express');
const router  = express.Router();
const Return  = require('../models/Return');
const Loan    = require('../models/Loan');
const Notification = require('../models/Notification'); 
const DAILY_PENALTY = parseInt(process.env.DAILY_PENALTY_RATE, 10) || 1000;

// ─── GET all return-requests ───────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const list = await Return.find()
      .populate({
        path: 'id_loans',
        select: 'loan_date return_date borrow_book',
        populate: {
          path: 'borrow_book.book_id',
          select: 'book_name auth'
        }
      })
      .populate({ path: 'id_costumer', select: 'fullname email' })
      .populate({ path: 'id_employee', select: 'fullname email' });
    res.json(list);
  } catch (err) {
    console.error('Error fetching returns:', err);
    res.status(500).json({ message: 'Could not load return requests', error: err.message });
  }
});

// ─── POST a new return-request ────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { id_loans, return_date, penalty, id_costumer, id_employee } = req.body;
    // basic validation
    if (!id_loans || !return_date || !id_costumer || !id_employee) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newReturn = new Return({
      id_loans,
      return_date: new Date(return_date),
      penalty:     penalty || 0,
      id_costumer,
      id_employee
    });
    await newReturn.save();
    res.status(201).json({ message: 'Return request created', data: newReturn });
  } catch (err) {
    console.error('Error creating return request:', err);
    res.status(500).json({ message: 'Could not create return request', error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    // 1) load the return request and its loan
    const ret = await Return.findById(req.params.id)
      .populate('id_costumer', 'fullname')
      .populate({
        path: 'id_loans',
        populate: {
          path: 'borrow_book.book_id',
          select: 'book_name'
        }
      })
      .populate('id_employee', 'fullname');

    if (!ret) {
      return res.status(404).json({ message: 'Return request not found' });
    }
    const loan = ret.id_loans;
    if (!loan) {
      return res.status(400).json({ message: 'Underlying loan not found' });
    }

    // 2) compute any late penalty
    const dueDate      = new Date(loan.return_date);
    const actualReturn = new Date(ret.return_date);
    let penalty        = 0;
    if (actualReturn > dueDate) {
      const days = Math.ceil((actualReturn - dueDate) / (1000*60*60*24));
      penalty    = days * DAILY_PENALTY;
    }
    ret.penalty = penalty;
    await ret.save();

    // 3) pick the staff ID: either from the request body (if you posted it)
    //    or from the return record itself (ret.id_employee)
    const staffId = (req.body && req.body.id_employee)
      ? req.body.id_employee
      : ret.id_employee?._id;

    // 4) notify the user
    await Notification.create({
      title:       '✅ Return Approved',
      content:     `Hi ${ret.id_costumer.fullname}, your return was approved. Penalty: ${penalty} VNĐ., please pay ${penalty} VNĐ at the library.`,
      id_customer: ret.id_costumer._id,
      id_employee: staffId || null,
      create_date: new Date(),
      status:      0
    });

    // 5) delete the loan (no longer active)
    await Loan.findByIdAndDelete(loan._id);

    // 6) delete the return-request
    await Return.findByIdAndDelete(ret._id);

    res.json({ message: 'Return approved, loan & return removed, user notified', penalty });
  } catch (err) {
    console.error('Error approving return:', err);
    res.status(500).json({ message: 'Could not approve return', error: err.message });
  }
});


module.exports = router;



const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const Loan    = require('../models/Loan');
const Book    = require('../models/Book');

// GET /api/statistics
router.get('/', async (req, res) => {
  try {
    // 1) total number of loans
    const totalLoans = await Loan.countDocuments();

    // 2) most borrowed book (single)
    const mostBorrowedAgg = await Loan.aggregate([
      { $unwind: '$borrow_book' },
      { $group: {
          _id: '$borrow_book.book_id',
          count: { $sum: '$borrow_book.quantity' }
      }},
      { $sort: { count: -1 } },
      { $limit: 1 },
      { $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book'
      }},
      { $unwind: '$book' },
      { $project: {
          book_id: '$_id',
          count: 1,
          book_name: '$book.book_name',
          image_url: '$book.image_url'
      }}
    ]);
    const mostBorrowed = mostBorrowedAgg[0] || null;

    // 3) monthly loan counts
    const monthlyLoans = await Loan.aggregate([
      { $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$loan_date' }
          },
          count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } },
      { $project: {
          month: '$_id',
          count: 1,
          _id: 0
      }}
    ]);

    // 4) top 5 borrowed books
    const top5 = await Loan.aggregate([
      { $unwind: '$borrow_book' },
      { $group: {
          _id: '$borrow_book.book_id',
          count: { $sum: '$borrow_book.quantity' }
      }},
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book'
      }},
      { $unwind: '$book' },
      { $project: {
          book_id: '$_id',
          count: 1,
          book_name: '$book.book_name'
      }}
    ]);

    res.json({
      totalLoans,
      mostBorrowed,
      monthlyLoans,
      top5Books: top5
    });

  } catch (err) {
    console.error('Error computing statistics:', err);
    res.status(500).json({ message: 'Could not load statistics', error: err.message });
  }
});

module.exports = router;

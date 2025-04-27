const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const Book     = require('../models/Book');
const router   = express.Router();

// Multer
const storage = multer.diskStorage({
  destination: (req,file,cb)=>cb(null,'uploads/'),
  filename:(req,file,cb)=>{
    cb(null, Date.now()+path.extname(file.originalname));
  }
});
const upload = multer({storage});

// helper
function fullUrl(req,rel) {
  return `${req.protocol}://${req.get('host')}${rel}`;
}

// LIST
router.get('/', async (req,res)=>{
  const books = await Book.find().populate('book_type');
  res.json(books);
});

// DETAIL
router.get('/:id', async (req,res)=>{
  const b = await Book.findById(req.params.id).populate('book_type');
  if(!b) return res.status(404).json({message:'Not found'});
  res.json(b);
});

// CREATE
router.post('/', upload.single('image'), async (req,res)=>{
  const { book_name,book_type,loan_price,auth,publisher,des,quantity } = req.body;
  const image_url = req.file ? fullUrl(req,`/uploads/${req.file.filename}`) : null;
  const b = new Book({ book_name,book_type,loan_price,auth,publisher,des,quantity,image_url });
  await b.save();
  await b.populate('book_type').execPopulate();
  res.status(201).json(b);
});

// UPDATE
router.put('/:id', upload.single('image'), async (req,res)=>{
  const upd = { ...req.body };
  if(req.file) upd.image_url = fullUrl(req,`/uploads/${req.file.filename}`);
  const b = await Book.findByIdAndUpdate(req.params.id,upd,{new:true,runValidators:true})
                     .populate('book_type');
  if(!b) return res.status(404).json({message:'Not found'});
  res.json(b);
});

module.exports = router;

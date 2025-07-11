const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Admin-only routes
router.post('/', verifyAdmin, createBlog);
router.put('/:id', verifyAdmin, updateBlog);
router.delete('/:id', verifyAdmin, deleteBlog);

module.exports = router;

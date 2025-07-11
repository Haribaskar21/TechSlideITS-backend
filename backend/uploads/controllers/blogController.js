
const Blog = require('../models/Blog');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single('image');

exports.upload = upload;

exports.createBlog = async (req, res) => {
  const { title, content, category, tags, image } = req.body;

  // tags may come as array or string, adjust accordingly
  const tagsArray = Array.isArray(tags) ? tags : tags ? tags.split(',').map(t => t.trim()) : [];
  const blog = new Blog({ title, content, category, tags: tagsArray, image  });
  await blog.save();
  res.status(201).json(blog);
};

exports.getAllBlogs = async (req, res) => {
 const blogList = await Blog.find();
   const blogWithUrls = blogList.map(blog => {
     const obj = blog.toObject();
     obj.imageUrl = blog.image ? `${req.protocol}://${req.get('host')}/uploads/${blog.image}` : '';
     return obj;
   });
   res.json(blogWithUrls);
 };

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const blogObj = blog.toObject();
    blogObj.imageUrl = blog.image ? `${req.protocol}://${req.get('host')}/uploads/${blog.image}` : '';
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags, image } = req.body;
  const updateData = { title, content, category, tags };

  if (image !== undefined) updateData.image = image; // update image URL if provided
  
  const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
  res.json(blog);
};

exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  await Blog.findByIdAndDelete(id);
  res.json({ message: 'Blog deleted' });
};

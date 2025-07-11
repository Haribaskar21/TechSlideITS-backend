const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

// Routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const uploadRoutes = require('./routes/upload');
const metaRoutes = require('./routes/metaRoutes');

const app = express();

// ✅ CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://techslidits.botgenius.in'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Not Allowed'));
    }
  },
  credentials: true,
}));

// ✅ Middlewares
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/meta', metaRoutes);

// ✅ Test Route (for debug)
app.get('/test', (req, res) => {
  res.send('✅ Server is running and responding');
});

// ✅ Default Admin Creator
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const admin = new User({
        username: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Default admin created');
    } else {
      console.log('ℹ️ Admin already exists');
    }
  } catch (err) {
    console.error('❌ Admin creation error:', err.message);
  }
};

// ✅ Connect MongoDB & Start Server
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await createDefaultAdmin();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// // ✅ Serve Frontend in Production
// if (process.env.NODE_ENV === 'production') {
//   const frontendPath = path.join(__dirname, '../frontend/dist');
//   app.use(express.static(frontendPath));

//   app.get('*', (req, res, next) => {
//     if (req.path.startsWith('/api')) return next();
//     res.sendFile(path.join(frontendPath, 'index.html'));
//   });
// }

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

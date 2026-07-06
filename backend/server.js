const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const messageRoutes = require('./routes/messageRoutes');
const publicRoutes = require('./routes/publicRoutes');

// Connect to Database
connectDB();

// Temporary script to clean fake projects left in database
const clearFakeProjects = async () => {
  try {
    const Project = require('./models/Project');
    const result = await Project.deleteMany({
      $or: [
        { title: { $regex: /fix project/i } },
        { title: { $regex: /debug project/i } },
        { title: { $regex: /e2e project/i } },
        { title: { $regex: /demo/i } },
        { title: { $regex: /test/i } },
        { title: { $regex: /sample/i } }
      ]
    });
    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} fake projects.`);
    }
  } catch (error) {
    console.error('Error cleaning fake projects', error);
  }
};
clearFakeProjects();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/public', publicRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Freelance Marketplace API is running...' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

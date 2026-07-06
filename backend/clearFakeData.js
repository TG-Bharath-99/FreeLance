require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');

const clearFakeProjects = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Connected. Finding and removing fake projects...');
    
    // Using regex to match known fake titles
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
    
    console.log(`Successfully deleted ${result.deletedCount} fake projects from the database.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error clearing data:', error);
    process.exit(1);
  }
};

clearFakeProjects();

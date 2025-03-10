const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://trantuan1172003:Y8idsNIozKS6nPHQ@mma-project.4amkq.mongodb.net/?retryWrites=true&w=majority&appName=MMA-Project', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
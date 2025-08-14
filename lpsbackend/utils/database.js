const mongoose = require('mongoose');

let isConnected = false; // track the connection

const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  console.log("Connecting to MongoDB:", process.env.MONGODB_URI);

  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    // Connect to MongoDB (no deprecated options needed)
    await mongoose.connect(process.env.MONGODB_URI); 
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

module.exports = connectToDB;

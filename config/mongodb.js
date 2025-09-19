import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log("Database Connected"));
    mongoose.connection.on('error', (err) => console.error("MongoDB connection error:", err));

    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/MediCare';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'MediCare'
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;

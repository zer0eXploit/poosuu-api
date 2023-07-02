import mongoose from "mongoose";

// @desc    Connects to mongodb and logs hostname
const connectDB = async () => {
  mongoose.set("strictQuery", false);
  const conn = await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.white.bgGreen);
};

export default connectDB;

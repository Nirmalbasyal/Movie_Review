import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db";
import User from "../models/User";

dotenv.config();

const seedAdmin = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ userEmail: "admin@movie.com" });
  if (existingAdmin) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await User.create({
    userName: "Admin",
    userEmail: "admin@movie.com",
    userPassword: hashedPassword,
    role: "admin",
  });

  console.log("Admin user seeded successfully");
  process.exit(0);
};

seedAdmin();

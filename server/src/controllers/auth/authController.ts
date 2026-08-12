import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { userName, userEmail, userPassword } = req.body;

    // validate input
    if (!userName || !userEmail || !userPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

       if (!userName || userName.trim().length < 3) {
         return res.status(400).json({ message: "Username must be at least 3 characters" });
       }

       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!userEmail || !emailRegex.test(userEmail.trim())) {
         return res.status(400).json({ message: "Enter a valid email address" });
       }

       if (!userPassword || userPassword.length < 6) {
         return res.status(400).json({ message: "Password must be at least 6 characters" });
       }

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const newUser = await User.create({
      userName,
      userEmail,
      userPassword: hashedPassword,
      role: "user", // always "user", admin is seeded manually
    });

    res.status(201).json({
      message: "User registered successfully",
      data: { id: newUser._id, userName: newUser.userName, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { userEmail, userPassword } = req.body;

    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(userPassword, user.userPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "30d" });

    res.status(200).json({
      message: "Login successful",
      token,
      data: { id: user._id, userName: user.userName, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

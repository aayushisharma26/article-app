import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, categories } = req.body;
    
    if (!categories || categories.length === 0) {
      return res.status(400).json({ message: "Categories are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, categories });

    res.status(201).json({ message: "User registered successfully", token: generateToken(user._id) });
  } catch (error) {
    console.error("Registration Error:", error); 
    res.status(500).json({ message: "Registration failed", error });
  }
};





export const register = async (req, res) => {
  try {
    const { name, email, password, categories } = req.body;

    if (!categories || categories.length === 0) {
      return res.status(400).json({ message: "Categories are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      categories: Array.isArray(categories) ? categories : categories.split(",") 
    });

    res.status(201).json({ message: "User registered successfully" }); // ✅ Token removed
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { name: user.name, email: user.email, categories: user.categories } });
  } catch (error) {
    res.status(400).json({ message: "Login failed", error });
  }
};

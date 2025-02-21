import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import "./utils/fetchArticlesJob.js"; // ✅ Cron Job Import 

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));





// PORT=5000
// MONGO_URI=mongodb+srv://aayushisharma1:Navgurukul123@cluster0.jfztl.mongodb.net/article-app
// JWT_SECRET=yourjwtsecret
// SERPER_API_KEY= 77f0017f4f1f940de7cb25e0242222fe44c3f1ad


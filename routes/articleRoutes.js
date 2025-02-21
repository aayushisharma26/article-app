import express from "express";
import { fetchArticles, getUserArticles, getArticleById } from "../controllers/articleController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/fetch", authMiddleware, fetchArticles);

router.get("/", authMiddleware, getUserArticles);

router.get("/:id", authMiddleware, getArticleById);

export default router;

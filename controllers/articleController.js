import axios from "axios";
import Article from "../models/articleModel.js";


export const fetchArticles = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const response = await axios.post(
      "https://google.serper.dev/search",
      { q: category, num: 5 },
      { headers: { "X-API-KEY": process.env.SERPER_API_KEY } }
    );

    if (!response.data.organic) {
      return res.status(500).json({ message: "Invalid API Response" });
    }

    const articles = response.data.organic.map(item => ({
      title: item.title,
      content: item.snippet,
      author: item.source || "Unknown",
      url: item.link,
      category
    }));

    await Article.insertMany(articles);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
};


export const getUserArticles = async (req, res) => {
  try {
    console.log("User Data:", req.user);  // 🔍 Debugging Log

    if (!req.user || !req.user.categories || req.user.categories.length === 0) {
      return res.status(400).json({ message: "User has no selected categories" });
    }

    const articles = await Article.find({ category: { $in: req.user.categories } }).sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
};



export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Error fetching article", error });
  }
};

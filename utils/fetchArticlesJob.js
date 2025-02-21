import cron from "node-cron";
import axios from "axios";
import Article from "../models/articleModel.js";
import User from "../models/userModel.js";

cron.schedule("0 * * * *", async () => {
  console.log("⏳ Fetching latest articles...");
  try {
    const users = await User.find().select("categories");

    for (const user of users) {
      for (const category of user.categories) {
        const response = await axios.post(
          "https://google.serper.dev/search",
          { q: category, num: 5 },
          { headers: { "X-API-KEY": process.env.SERPER_API_KEY } }
        );

        if (response.data.organic) {
          const articles = response.data.organic.map(item => ({
            title: item.title,
            content: item.snippet,
            author: item.source || "Unknown",
            url: item.link,
            category
          }));
          await Article.insertMany(articles);
        }
      }
    }
    console.log("✅ Articles updated successfully!");
  } catch (error) {
    console.error("❌ Error fetching articles:", error);
  }
});

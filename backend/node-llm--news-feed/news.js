import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔹 Fetch news from GNews
async function fetchNews() {
  try {
    const url = `https://gnews.io/api/v4/search?q=nifty OR stock market OR RBI OR inflation&country=in&max=5&apikey=${process.env.GNEWS_API_KEY}`;

    const res = await axios.get(url);

    return res.data.articles.map(a => ({
      title: a.title,
      description: a.description,
      content: a.content,
      url: a.url,
    }));
  } catch (err) {
    console.error("GNews error:", err.message);
    return [];
  }
}

// 🔹 Analyze with OpenAI
async function analyzeNews(news) {
  try {
    const input = news
      .map(n => `Title: ${n.title}\nDesc: ${n.description}`)
      .join("\n\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `
You are a professional Indian stock market analyst.

For the given news:
1. Give short summary (5 bullet points)
2. Classify overall sentiment: Bullish / Bearish / Neutral
3. Mention sectors impacted
4. Give trading bias for Nifty (LONG / SHORT / SIDEWAYS)
          `
        },
        {
          role: "user",
          content: input
        }
      ]
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI error:", err.message);
    return "Error analyzing news";
  }
}

// 🔹 API route
app.get("/ai-news", async (req, res) => {
  const news = await fetchNews();
  const analysis = await analyzeNews(news);

  res.json({
    news,
    analysis,
  });
});

// 🔹 Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
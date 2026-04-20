import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Groq (OpenAI-compatible)
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// 🔹 Fetch news from GNews
async function fetchNews() {
  try {
    const url = `https://gnews.io/api/v4/search?q=nifty&country=in&max=5&apikey=${process.env.GNEWS_API_KEY}`;

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
function extractJSON(text) {
  try {
    // Remove markdown ```json ```
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Extract first {...} block
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found");

    return JSON.parse(match[0]);
  } catch (err) {
    console.error("JSON parse failed:", text);
    return { error: "Invalid JSON from LLM" };
  }
}
// 🔹 Analyze with FREE LLM (Groq)
async function analyzeNews(news) {
  try {
    const input = news
      .map(n => `Title: ${n.title}\nDesc: ${n.description}`)
      .join("\n\n");

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile", // free model
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `You are an Indian stock market analyst.

                Return ONLY valid JSON.
                - No explanation
                - No markdown
                - No extra text

                Strict format:
                {
                "summary": ["point1","point2"],
                "sentiment": "Bullish | Bearish | Neutral",
                "sectors": ["Banking","IT"],
                "nifty_bias": "LONG | SHORT | SIDEWAYS"
                }`
        },
        {
          role: "user",
          content: input
        }
      ],
    });
    
    const raw = completion.choices[0].message.content;

    const parsed = extractJSON(raw);

    if (parsed.error) {
        return {
            summary: [],
            sentiment: "Neutral",
            sectors: [],
            nifty_bias: "SIDEWAYS",
        }; 
}

return parsed;
  } catch (err) {
    console.error("LLM error:", err.message);
    return { error: "AI analysis failed" };
  }
}

// 🔹 API route
app.get("/ai-news", async (req, res) => {
  const news = await fetchNews();
  const analysis = await analyzeNews(news);

  res.json({
    news__:news,
    analysis,
  });
});

// 🔹 Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
import express from "express";
import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to fetch weather
async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`;

  const res = await axios.get(url);
  return {
    city: res.data.name,
    temp: res.data.main.temp,
    description: res.data.weather[0].description,
  };
}

// Endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Step 1: Ask LLM if weather is needed
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are a helpful assistant.
If the user asks about weather, extract the city and respond in JSON:
{ "intent": "weather", "city": "city_name" }
Otherwise respond normally.
          `,
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply = completion.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(reply);
    } catch {
      return res.json({ reply }); // normal response
    }

    // Step 2: If weather intent
    if (parsed.intent === "weather") {
      const weather = await getWeather(parsed.city);

      // Step 3: Ask LLM to format answer
      const finalResponse = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "Explain weather in a friendly, concise way.",
          },
          {
            role: "user",
            content: `Weather data: ${JSON.stringify(weather)}`,
          },
        ],
      });

      return res.json({
        reply: finalResponse.choices[0].message.content,
      });
    }

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
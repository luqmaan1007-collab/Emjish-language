import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/translate", async (req, res) => {
  try {
    const { text, from, to } = req.body;

    const prompt = `
You are a translation engine.

Translate this text from ${from} to ${to}.
If language is "emjish", convert words into emojis where possible.

Text:
${text}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a precise translator." },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      result: response.data.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({ error: "Translation failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

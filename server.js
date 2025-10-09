import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ AI Route
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || "Hello";
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are SoulSync, an empathetic AI therapist." },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API error:", err);
      return res.json({ reply: "I’m here with you." }); // fallback
    }

    const data = await response.json();
    const aiReply = data.choices[0]?.message?.content || "I’m here with you.";
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Error:", error);
    res.json({ reply: "I’m here with you." });
  }
});

// ✅ Voice route (optional)
app.post("/speak", async (req, res) => {
  try {
    const text = req.body.text || "Hello from SoulSync";
    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("ElevenLabs error:", err);
      return res.status(400).send(err);
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    res.set({ "Content-Type": "audio/mpeg" });
    res.send(audioBuffer);
  } catch (error) {
    console.error("Voice error:", error);
    res.status(500).send("Error generating voice");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ SoulSync server live on port ${PORT}`));

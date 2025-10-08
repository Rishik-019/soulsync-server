import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 🟢 Test
app.get("/", (req, res) => {
  res.send("✅ SoulSync server is running...");
});

// 🟢 Chat route using Groq (AI reply)
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are SoulSync, an empathetic AI therapist. Speak warmly, human-like, short but thoughtful." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content || "I'm here with you.";

    res.json({ reply });
  } catch (err) {
    console.error("Groq error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

// 🟢 ElevenLabs TTS
app.post("/speak", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text required" });

    const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel voice

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({ text, model_id: "eleven_multilingual_v2" }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(400).json({ error: errorData });
    }

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'inline; filename="speech.mp3"',
    });

    response.body.pipe(res);
  } catch (error) {
    console.error("Speak error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟢 Start
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Rachel (free-tier safe)

app.post("/speak", async (req, res) => {
  try {
    const text = req.body.text || "Hello from SoulSync";

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("❌ ElevenLabs error:", err);
      return res.status(400).send(err);
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
    });
    res.send(audioBuffer);
  } catch (err) {
    console.error("💥 Error in /speak:", err);
    res.status(500).send("Error generating speech");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Voice server live on ${PORT}`));

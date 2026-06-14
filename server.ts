import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini API:", err);
  }
} else {
  console.log("No GEMINI_API_KEY environment variable found. Sensei Chat will operate in local wisdom mode.");
}

// Wise warrior proverbs fallback cache for local fallback
const PROVERBS = [
  "Choose pain of discipline today, or carry the pain of regret tomorrow. Both are heavy; only one makes you a weapon.",
  "Your mind is like water, warrior. When turbulent, it absorbs nothing. When tranquil, it reflects the heavens.",
  "True focus is not strength alone — it is the absolute alignment of the iron body with the unyielding spirit.",
  "Steel is forged in the furnace of exhaustion. Do not fear sweat; it is the moisture of raw advancement.",
  "A sword unused is but a heavy piece of iron. Train with purpose, or dissolve into mediocrity.",
  "He who conquers others is strong; he who conquers himself is mighty.",
  "The Dojo is not a temple of comfort. It is an anvil of self-evolution.",
  "A cracked shield can still absorb the blow, but only if the hand holding it does not tremble.",
  "The mountain does not yield to the wind. Stand deep, breathe flat, and conquer the horizon.",
  "A single drop of water can wear down stone if it repeats its path without fail. Consistency is your blade."
];

const QUICK_RESPONSES: Record<string, string> = {
  inspire: "Within you lies a reservoir of untamed fury. Focus it. Do not let your fire smoke — make it burn bright and consume the challenge.",
  form: "Pull your shoulders back, engage your core like code running on metal, and keep your movements deliberate. Slashing blindly with the sword breeds vulnerability. Precision is strength.",
  diet: "Your body is a combustion engine. Avoid synthetic sugars that clog the valves of your veins. Consume heavy proteins, clean fats, and complex fuels to sustain the long march.",
  lore: "KAGE means shade — the unseen warriors of ancient times. We do not fight for applause. We fight to master the dark corners of our own limitations in absolute secrecy.",
  meditate: "Close your eyelids. Inhale deep into your lower belly for 4 seconds, retain the air for 4, release slowly for 4, and hold empty. In this void, your real resolve takes form.",
  random: "The ultimate weapon is a resilient body directed by an uncompromising soul. Turn off the noise around you. Build your armor in the shadow."
};

/**
 * Sensei chat endpoint proxying to Gemini (when available)
 */
app.post("/api/chat", async (req, res) => {
  const { message, quickAction, history } = req.body;

  if (quickAction && QUICK_RESPONSES[quickAction]) {
    return res.json({
      text: QUICK_RESPONSES[quickAction],
      proverb: true
    });
  }

  const userMsg = message || "Greetings, Sensei.";

  if (ai) {
    try {
      // Build conversation contents from history if available
      const contents = (history && Array.isArray(history) && history.length > 0)
        ? [
            ...history.map((h: any) => ({
              role: h.role === 'model' ? 'model' : 'user',
              parts: [{ text: h.text }]
            })),
            { role: 'user', parts: [{ text: userMsg }] }
          ]
        : userMsg;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction: "You are the Holographic Sensei inside the KAGE fitness app. You are a legendary, wise, cybernetic samurai mentor. Express severe, punchy, unyielding but supportive martial arts wisdom. Keep responses concise (under 2-3 short paragraphs), highly styled with analogies related to forge, swords, shadows, and dojos. Never break character.",
          temperature: 0.8,
        }
      });
      
      const reply = response.text || PROVERBS[Math.floor(Math.random() * PROVERBS.length)];
      return res.json({ text: reply, proverb: false });
    } catch (err: any) {
      console.error("Gemini call failed, falling back to local wisdom:", err);
      // Fallback
      const fallbackReply = PROVERBS[Math.floor(Math.random() * PROVERBS.length)];
      return res.json({ text: `[Hologram flicker] Sensei is in deep meditation... Here is ancient shadow counsel: "${fallbackReply}"`, proverb: true, error: true });
    }
  } else {
    // Return a smart response based on text content, or random proverb
    let customFallback = "";
    const lowercaseMsg = userMsg.toLowerCase();
    
    if (lowercaseMsg.includes("hello") || lowercaseMsg.includes("hi") || lowercaseMsg.includes("greetings")) {
      customFallback = "The shadow stretches across the dojo master. I am your hologram guide. What aspects of your training shall we sharpen today?";
    } else if (lowercaseMsg.includes("workout") || lowercaseMsg.includes("train") || lowercaseMsg.includes("pushup") || lowercaseMsg.includes("muscle")) {
      customFallback = "Every repetition is a strike against your weaker self. Do not count the reps that are easy; only start counting when the muscle screams for mercy.";
    } else if (lowercaseMsg.includes("water") || lowercaseMsg.includes("drink")) {
      customFallback = "Water is fluid and formless. It takes the shape of the vase, yet can crack the diamond. Stay hydrated, keep your vessel clean and ready.";
    } else if (lowercaseMsg.includes("sleep") || lowercaseMsg.includes("tired")) {
      customFallback = "Even the sharpest katana must rest in its scabbard. Sleep is when the steel of your tissues recovers from the anvil. Rest well, wake with wrath.";
    } else {
      customFallback = PROVERBS[Math.floor(Math.random() * PROVERBS.length)];
    }

    return res.json({
      text: customFallback,
      proverb: true
    });
  }
});

// Setup Vite Dev Server / Static Ingress
async function init() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KAGE Premium V2 Server running securely on http://localhost:${PORT}`);
  });
}

init();

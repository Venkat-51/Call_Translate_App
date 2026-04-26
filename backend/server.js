const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const FRONTEND_ORIGINS = process.env.FRONTEND_ORIGINS || "";
const LIBRETRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL || "https://translate.argosopentech.com/translate";
const LIBRETRANSLATE_API_KEY = process.env.LIBRETRANSLATE_API_KEY || "";
const GOOGLE_TRANSLATE_URL =
  process.env.GOOGLE_TRANSLATE_URL ||
  "https://translate.googleapis.com/translate_a/single";

const defaultAllowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
const envAllowedOrigins = FRONTEND_ORIGINS
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(
  new Set([...defaultAllowedOrigins, FRONTEND_ORIGIN, ...envAllowedOrigins])
);

app.use(
  cors({
    origin(origin, callback) {
      // Allow tools like curl/Postman or same-origin requests with no Origin header.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    }
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Call Translator backend is running. Use POST /translate."
  });
});

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

async function translateWithLibreTranslate(text, sourceLang, targetLang) {
  const payload = {
    q: text,
    source: sourceLang,
    target: targetLang,
    format: "text"
  };

  if (LIBRETRANSLATE_API_KEY) {
    payload.api_key = LIBRETRANSLATE_API_KEY;
  }

  const apiResponse = await axios.post(LIBRETRANSLATE_URL, payload, {
    headers: {
      "Content-Type": "application/json"
    },
    timeout: 15000
  });

  return apiResponse.data?.translatedText || "";
}

async function translateWithGoogle(text, sourceLang, targetLang) {
  const apiResponse = await axios.get(GOOGLE_TRANSLATE_URL, {
    params: {
      client: "gtx",
      sl: sourceLang,
      tl: targetLang,
      dt: "t",
      q: text
    },
    timeout: 15000
  });

  const chunks = apiResponse.data?.[0];
  if (!Array.isArray(chunks)) {
    return "";
  }

  return chunks
    .map((chunk) => (Array.isArray(chunk) ? chunk[0] : ""))
    .join("")
    .trim();
}

app.post("/translate", async (req, res) => {
  const providerErrors = [];

  const { text, sourceLang, targetLang } = req.body;

  if (!text || !sourceLang || !targetLang) {
    return res.status(400).json({
      error: "text, sourceLang and targetLang are required"
    });
  }

  const cleanedText = String(text).trim();
  if (!cleanedText) {
    return res.status(400).json({
      error: "text cannot be empty"
    });
  }

  try {
    const translatedText = await translateWithLibreTranslate(
      cleanedText,
      sourceLang,
      targetLang
    );

    if (translatedText) {
      return res.json({ translatedText, provider: "libretranslate" });
    }

    providerErrors.push("LibreTranslate returned empty text");
  } catch (error) {
    providerErrors.push(
      error.response?.data?.error || error.message || "LibreTranslate failed"
    );
  }

  try {
    const translatedText = await translateWithGoogle(
      cleanedText,
      sourceLang,
      targetLang
    );

    if (translatedText) {
      return res.json({ translatedText, provider: "google" });
    }

    providerErrors.push("Google fallback returned empty text");
  } catch (error) {
    providerErrors.push(error.message || "Google fallback failed");
  }

  return res.status(502).json({
    error: "Translation failed on all providers",
    details: providerErrors
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

# Call Translator (React + Express)

A beginner-friendly full-stack web app that captures speech, translates text, and speaks the translated output.

## Features

- Speech-to-Text using browser Web Speech API (no external speech API)
- Translation through backend REST API
- LibreTranslate first, with automatic Google fallback when unavailable
- Text-to-Speech using browser SpeechSynthesis API
- Tamil and English translation direction toggle
- Start and Stop microphone controls
- Manual text input, retry request, and recent translation history
- Frontend and backend error handling

## Folder Structure

~~~text
Call-T/
  frontend/
    src/
      App.jsx
      App.css
      main.jsx
    .env.example
    index.html
    package.json
  backend/
    .env.example
    package.json
    server.js
  .gitignore
  README.md
~~~

## Prerequisites

- Node.js 18 or newer
- npm
- Google Chrome (recommended for SpeechRecognition support)

## Setup (Windows)

### 1. Go to project root

~~~powershell
cd C:\Users\venkat\Desktop\Call-T
~~~

### 2. Install dependencies

~~~powershell
npm --prefix .\backend install
npm --prefix .\frontend install
~~~

### 3. Create environment files

~~~powershell
Copy-Item .\backend\.env.example .\backend\.env
Copy-Item .\frontend\.env.example .\frontend\.env
~~~

### 4. Start backend

~~~powershell
npm --prefix .\backend run dev
~~~

Backend runs on http://localhost:5000.

### 5. Start frontend in a second terminal

~~~powershell
npm --prefix .\frontend run dev
~~~

Frontend usually runs on http://localhost:5173. If port 5173 is busy, Vite may use http://localhost:5174.

## How It Works

1. User speaks into microphone or types text manually.
2. Browser converts speech to text using Web Speech API.
3. Frontend sends text, source language, and target language to backend.
4. Backend translates using LibreTranslate, then Google fallback if needed.
5. Frontend displays translated text.
6. Browser plays translated speech with SpeechSynthesis API.

## API

### GET /

Returns backend status message.

### GET /health

Returns health status.

### POST /translate

Request body:

~~~json
{
  "text": "who are you?",
  "sourceLang": "en",
  "targetLang": "ta"
}
~~~

Success response:

~~~json
{
  "translatedText": "நீங்கள் யார்?",
  "provider": "google"
}
~~~

Error response:

~~~json
{
  "error": "Translation failed on all providers",
  "details": ["..."]
}
~~~

## Environment Variables

Backend values in backend/.env:

- PORT (default 5000)
- FRONTEND_ORIGIN (single allowed origin)
- FRONTEND_ORIGINS (comma-separated additional allowed origins)
- LIBRETRANSLATE_URL
- LIBRETRANSLATE_API_KEY (optional)
- GOOGLE_TRANSLATE_URL

Frontend values in frontend/.env:

- VITE_API_BASE_URL (default http://localhost:5000)

## Troubleshooting

- CORS error from localhost:5174:
  - Ensure backend is restarted after env or server CORS changes.
- Microphone error audio-capture:
  - Check Chrome site permission and Windows Input device.
- Port already in use:
  - Close old node or vite terminals and restart.

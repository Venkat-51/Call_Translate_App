# Call Translator (React + Express)

A beginner-friendly full-stack web app that listens to speech, translates it, and speaks the translated result.

## Features

- Speech-to-Text using browser Web Speech API (no external speech API)
- Translation using backend API with LibreTranslate-compatible service
- Automatic fallback to Google translation endpoint if LibreTranslate is unavailable
- Text-to-Speech using browser SpeechSynthesis API
- Language direction toggle:
  - Tamil to English
  - English to Tamil
- Start/Stop microphone controls
- Error handling in frontend and backend

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
- Google Chrome (recommended for Web Speech API)

## Setup Instructions (Windows)

### 1. Open terminal in project root

~~~powershell
cd C:\Users\venkat\Desktop\Call-T
~~~

### 2. Setup backend

~~~powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
~~~

Backend runs on: http://localhost:5000

### 3. Setup frontend (open a second terminal)

~~~powershell
cd C:\Users\venkat\Desktop\Call-T\frontend
npm install
Copy-Item .env.example .env
npm run dev
~~~

Frontend runs on: http://localhost:5173

## How It Works

1. Click Start Microphone.
2. Speak in the selected source language.
3. Browser converts speech to text.
4. Frontend sends text to backend POST /translate.
5. Backend calls translation API and returns translated text.
6. Frontend displays and speaks translated text.

## API

### POST /translate

Request body:

~~~json
{
  "text": "vanakkam",
  "sourceLang": "ta",
  "targetLang": "en"
}
~~~

Response:

~~~json
{
  "translatedText": "hello"
}
~~~

## Notes

- If translation endpoint rate-limits, change LIBRETRANSLATE_URL in backend/.env.
- Backend first tries LibreTranslate and then automatically falls back to Google if needed.
- If microphone does not start, allow microphone permission in browser.
- For best speech recognition support, use Chrome.

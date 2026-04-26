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
=======
This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

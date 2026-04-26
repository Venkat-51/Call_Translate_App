import React, { useEffect, useRef, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function App() {
  const [direction, setDirection] = useState("ta-to-en");
  const [isListening, setIsListening] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [manualText, setManualText] = useState("");
  const [history, setHistory] = useState([]);
  const [provider, setProvider] = useState("");
  const [lastRequest, setLastRequest] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);

  const sourceLang = direction === "ta-to-en" ? "ta" : "en";
  const targetLang = direction === "ta-to-en" ? "en" : "ta";
  const recognitionLang = sourceLang === "ta" ? "ta-IN" : "en-US";
  const speechLang = targetLang === "ta" ? "ta-IN" : "en-US";

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech Recognition is not supported in this browser. Use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = recognitionLang;

    recognition.onresult = async (event) => {
      const lastResult = event.results[event.results.length - 1];
      const spokenText = lastResult[0].transcript.trim();

      if (!spokenText) return;

      setOriginalText(spokenText);
      await translateText(spokenText);
    };

    recognition.onerror = (event) => {
      const errorMap = {
        "audio-capture":
          "Microphone not detected. Connect/enable a microphone in Windows Sound settings.",
        "not-allowed":
          "Microphone permission denied. Allow microphone access for this site in browser settings.",
        "service-not-allowed":
          "Speech service is blocked by browser settings. Please allow speech recognition.",
        "network": "Network issue while recognizing speech. Please check your internet connection.",
        "no-speech": "No speech detected. Please speak clearly and try again.",
        "aborted": "Microphone was stopped before speech capture completed."
      };

      setError(errorMap[event.error] || `Microphone error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      // In React StrictMode dev, cleanup can run before recognition starts.
      try {
        recognition.stop();
      } catch (e) {
        // Ignore "recognition has not started" cleanup errors.
      }
      if (window.speechSynthesis && typeof window.speechSynthesis.cancel === "function") {
        window.speechSynthesis.cancel();
      }
    };
    // Recreate recognizer when source language changes.
  }, [recognitionLang]);

  const startListening = () => {
    setError("");
    setOriginalText("");
    setTranslatedText("");
    setProvider("");

    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.lang = recognitionLang;

    const beginRecognition = async () => {
      try {
        // Pre-check microphone permission/device before SpeechRecognition starts.
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("This browser does not support microphone access APIs.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());

        recognition.start();
        setIsListening(true);
      } catch (e) {
        const name = e?.name || "";
        if (name === "NotAllowedError") {
          setError("Microphone permission blocked. Click the lock icon in address bar and allow microphone.");
          return;
        }
        if (name === "NotFoundError") {
          setError("No microphone device found. Plug in or enable a microphone and retry.");
          return;
        }
        if (name === "NotReadableError") {
          setError("Microphone is being used by another app. Close other apps and try again.");
          return;
        }
        setError("Could not start microphone. If already running, stop and try again.");
      }
    };

    beginRecognition();
  };

  const stopListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    try {
      recognition.stop();
    } catch (e) {
      // Ignore stop errors when recognition was not fully started.
    }
    setIsListening(false);
  };

  const translateText = async (text) => {
    const cleanedText = String(text || "").trim();
    if (!cleanedText) {
      setError("Please provide some text to translate.");
      return;
    }

    try {
      setIsTranslating(true);
      setError("");
      setProvider("");
      setLastRequest({
        text: cleanedText,
        sourceLang,
        targetLang
      });

      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: cleanedText,
          sourceLang,
          targetLang
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Translation request failed.");
      }

      const data = await response.json();
      const translated = data.translatedText || "";
      const activeProvider = data.provider || "unknown";

      setTranslatedText(translated);
      setProvider(activeProvider);

      const historyItem = {
        id: Date.now(),
        sourceText: cleanedText,
        translatedText: translated,
        sourceLang,
        targetLang,
        provider: activeProvider,
        createdAt: new Date().toLocaleTimeString()
      };

      setHistory((prev) => [historyItem, ...prev].slice(0, 10));
      speakText(translated);
    } catch (err) {
      setError(err.message || "Something went wrong during translation.");
    } finally {
      setIsTranslating(false);
    }
  };

  const speakText = (text) => {
    if (!text) return;
    if (!window.speechSynthesis) {
      setError("Speech Synthesis is not supported in this browser.");
      return;
    }

    // Stop any previous speech before speaking new text.
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLang;
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  const handleManualTranslate = async () => {
    setOriginalText(manualText.trim());
    await translateText(manualText);
  };

  const handleRetry = async () => {
    if (!lastRequest) {
      setError("No previous request to retry.");
      return;
    }

    setDirection(
      lastRequest.sourceLang === "ta" && lastRequest.targetLang === "en"
        ? "ta-to-en"
        : "en-to-ta"
    );
    setOriginalText(lastRequest.text);
    await translateText(lastRequest.text);
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Call Translator</h1>
        <p className="sub">Speak in Tamil or English and hear the translated output.</p>

        <div className="row">
          <label htmlFor="direction">Translation Direction</label>
          <select
            id="direction"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            disabled={isListening || isTranslating}
          >
            <option value="ta-to-en">Tamil to English</option>
            <option value="en-to-ta">English to Tamil</option>
          </select>
        </div>

        <div className="btn-row">
          <button onClick={startListening} disabled={isListening || isTranslating}>
            Start Microphone
          </button>
          <button onClick={stopListening} disabled={!isListening} className="secondary">
            Stop Microphone
          </button>
        </div>

        <div className="row">
          <label htmlFor="manualText">Or type text manually</label>
          <textarea
            id="manualText"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Type Tamil or English text here"
            rows={3}
            disabled={isTranslating}
          />
          <div className="btn-row">
            <button onClick={handleManualTranslate} disabled={isTranslating || !manualText.trim()}>
              Translate Text
            </button>
            <button onClick={handleRetry} className="secondary" disabled={isTranslating || !lastRequest}>
              Retry Last Request
            </button>
          </div>
        </div>

        <div className="status">
          {isListening ? "Listening... speak now" : "Microphone is idle"}
        </div>

        {isTranslating && <div className="status">Translating...</div>}
        {error && <div className="error">{error}</div>}

        <div className="output-box">
          <h3>Original Text</h3>
          <p>{originalText || "No speech captured yet."}</p>
        </div>

        <div className="output-box">
          <h3>Translated Text</h3>
          <p>{translatedText || "No translation yet."}</p>
          {provider && <small className="provider">Provider: {provider}</small>}
        </div>

        <div className="output-box">
          <h3>Recent Translations</h3>
          {history.length === 0 && <p>No history yet.</p>}
          {history.length > 0 && (
            <ul className="history-list">
              {history.map((item) => (
                <li key={item.id}>
                  <strong>{item.sourceLang} to {item.targetLang}</strong> at {item.createdAt}
                  <div>{item.sourceText}</div>
                  <div>{item.translatedText}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

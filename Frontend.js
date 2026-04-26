import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Voice from 'react-native-voice';
import axios from 'axios';
import Sound from 'react-native-sound';

const App = () => {
  const [recording, setRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  // Speech-to-Text (STT)
  const startRecording = async () => {
    setRecording(true);
    Voice.start('en-US');
    Voice.onSpeechResults = (event) => {
      setTranscribedText(event.value[0]);
      setRecording(false);
    };
  };

  const stopRecording = async () => {
    setRecording(false);
    Voice.stop();
  };

  // Translate Text
  const translateText = async () => {
    const response = await axios.post('https://your-translation-api-endpoint', {
      text: transcribedText,
      target_lang: 'es' // Translate to Spanish
    }, {
      headers: { 'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY' }
    });
    setTranslatedText(response.data.translated_text);
  };

  // Text-to-Speech (TTS)
  const convertTextToSpeech = async () => {
    const response = await axios.post('https://your-tts-api-endpoint', {
      text: translatedText,
      lang: 'es'
    }, {
      headers: { 'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY' }
    });
    setAudioUrl(response.data.audio_url);
    playAudio(response.data.audio_url);
  };

  // Play Translated Audio
  const playAudio = (url) => {
    const sound = new Sound(url, null, (error) => {
      if (!error) sound.play();
    });
  };

  return (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <TextInput
        style={{ borderWidth: 1, width: '80%', padding: 10 }}
        placeholder="Manual input"
        onChangeText={setTranscribedText}
        value={transcribedText}
      />

      <TouchableOpacity onPress={recording ? stopRecording : startRecording} style={{ marginVertical: 10, padding: 10, backgroundColor: 'blue' }}>
        <Text style={{ color: 'white' }}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={translateText} style={{ marginVertical: 10, padding: 10, backgroundColor: 'green' }}>
        <Text style={{ color: 'white' }}>Translate</Text>
      </TouchableOpacity>

      <Text>Translated Text: {translatedText}</Text>

      <TouchableOpacity onPress={convertTextToSpeech} style={{ marginVertical: 10, padding: 10, backgroundColor: 'purple' }}>
        <Text style={{ color: 'white' }}>Play Translated Audio</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;

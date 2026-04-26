import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Voice from 'react-native-voice';
import axios from 'axios';

const App = () => {
  const [recording, setRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');

  // Start Recording Voice
  const startRecording = async () => {
    try {
      setRecording(true);
      Voice.start('en-US'); // Language: English (Change to 'es-ES' for Spanish, etc.)

      Voice.onSpeechResults = (event) => {
        setTranscribedText(event.value[0]); // Capture the first result
        setRecording(false);
      };
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setRecording(false);
    }
  };

  // Stop Recording
  const stopRecording = async () => {
    setRecording(false);
    Voice.stop();
  };

  // Send Speech Text to API for More Accurate STT
  const convertSpeechToTextAPI = async () => {
    try {
      const response = await axios.post(
        'https://rapidapi.com/rphrp1985/api/open-ai21/playground/apiendpoint_05b05798-6c49-49ad-8fea-6b347be6d8aa',  // Replace with your STT API endpoint from RapidAPI
        { audio: transcribedText }, // Replace with actual audio data if required
        {
          headers: {
            'X-RapidAPI-Key': 'a19eb48a92mshdb0804f9e1cbe04p1752e0jsnb2a6dac9237f',  // Replace with your actual API key
            'Content-Type': 'application/json',
          },
        }
      );
      setTranscribedText(response.data.text);
    } catch (error) {
      console.error('Error in STT API:', error);
      Alert.alert('STT API Error', 'Check API Key and Endpoint');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Speech-to-Text Output:</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{transcribedText}</Text>

      <TouchableOpacity onPress={recording ? stopRecording : startRecording} style={{ marginVertical: 10, padding: 10, backgroundColor: 'blue' }}>
        <Text style={{ color: 'white' }}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={convertSpeechToTextAPI} style={{ marginVertical: 10, padding: 10, backgroundColor: 'green' }}>
        <Text style={{ color: 'white' }}>Send to API for Better Accuracy</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;

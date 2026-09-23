import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom React hook for browser Speech Recognition (Web Speech API)
 *
 * Features:
 * - Start/stop speech recognition
 * - Live transcript updates
 * - Browser support detection
 * - Auto-stop after silence timeout
 */
export default function useSpeechRecognition({ lang = 'en-US', continuous = false } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  // Check if speech recognition is supported
  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Initialize recognition instance
  const getRecognition = useCallback(() => {
    if (recognitionRef.current) return recognitionRef.current;
    if (!isSupported) return null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = continuous;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event) => {
      // 'no-speech' and 'aborted' are not real errors — just user idle or manual stop
      if (event.error === 'no-speech' || event.error === 'aborted') {
        setIsListening(false);
        return;
      }
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return recognition;
  }, [isSupported, lang, continuous]);

  const startListening = useCallback(() => {
    setError('');
    setTranscript('');
    const recognition = getRecognition();
    if (!recognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      // If already started, stop and restart
      if (err.name === 'InvalidStateError') {
        recognition.stop();
        setTimeout(() => {
          recognition.start();
          setIsListening(true);
        }, 100);
      } else {
        setError(`Failed to start speech recognition: ${err.message}`);
      }
    }
  }, [getRecognition]);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError('');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}

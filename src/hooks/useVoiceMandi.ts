import { useState, useRef, useCallback, useEffect } from 'react';
import { parseVoiceMandiQuery, MandiRateResult, getMandiRateByCropId } from '@/services/voiceMandiService';
import { askGeminiVoiceAssistant, VoiceAssistantResponse } from '@/services/geminiService';

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionResultItem;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: { error: string }) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function useVoiceMandi(language: 'en' | 'hi' = 'hi') {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<MandiRateResult | null>(null);
  const [aiResponse, setAiResponse] = useState<VoiceAssistantResponse | null>(null);
  const [hasSupport] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(15);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const shouldListenRef = useRef(false);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const accumulatedTranscriptRef = useRef<string>('');
  const baseTranscriptRef = useRef<string>('');
  const restartAttemptsRef = useRef(0);

  // Audio Playback via SpeechSynthesis
  const speakResponse = useCallback(
    (textToSpeak: string) => {
      if (!('speechSynthesis' in window)) return;

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.rate = 0.92; // Clear, comfortable tempo for rural farmers
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('TTS playback error:', err);
        setIsSpeaking(false);
      }
    },
    [language]
  );

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const handleQueryText = useCallback(
    async (queryText: string) => {
      const cleanText = queryText.trim();
      if (!cleanText) return;

      setTranscript(cleanText);
      setIsGenerating(true);
      stopSpeaking();

      // Entity matching for mandi data
      const matched = parseVoiceMandiQuery(cleanText);
      setResult(matched);

      try {
        const response = await askGeminiVoiceAssistant(cleanText, language, matched);
        setAiResponse(response);
        setIsGenerating(false);
        speakResponse(response.spokenText);
      } catch (err) {
        console.error('Gemini Voice query error:', err);
        setIsGenerating(false);
        const fallbackSpoken = language === 'hi' ? matched.spokenResponseHi : matched.spokenResponseEn;
        speakResponse(fallbackSpoken);
      }
    },
    [language, speakResponse, stopSpeaking]
  );

  const cleanupTimers = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const finalizeQuery = useCallback(() => {
    cleanupTimers();
    shouldListenRef.current = false;
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // already stopped
      }
      recognitionRef.current = null;
    }

    const text = accumulatedTranscriptRef.current.trim();
    if (text) {
      handleQueryText(text);
    } else {
      setErrorMessage(
        language === 'hi'
          ? 'माइक में कोई स्पष्ट आवाज़ नहीं आई। नीचे दिए गए स्टेप्स देखें या फसल पर टैप करें।'
          : 'Could not detect clear speech. Please check microphone steps or tap a crop below.'
      );
    }
  }, [cleanupTimers, handleQueryText, language]);

  const stopListening = useCallback(() => {
    finalizeQuery();
  }, [finalizeQuery]);

  const startListening = useCallback(() => {
    stopSpeaking();
    cleanupTimers();
    setErrorMessage(null);
    setTranscript('');
    accumulatedTranscriptRef.current = '';
    baseTranscriptRef.current = '';
    restartAttemptsRef.current = 0;
    shouldListenRef.current = true;
    setIsListening(true);
    setSecondsRemaining(15);

    const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechClass) {
      shouldListenRef.current = false;
      setIsListening(false);
      setErrorMessage(
        language === 'hi'
          ? 'इस ब्राउज़र में वॉइस सपोर्ट उपलब्ध नहीं है (HTTPS/Chrome अनुशंसित)। कृपया नीचे से फसल चुनें।'
          : 'Voice speech is not available in this browser context (Chrome/HTTPS recommended). Please select a crop below.'
      );
      handleQueryText('wheat');
      return;
    }

    // Live 15-second countdown timer for patient listening
    let timeLeft = 15;
    countdownIntervalRef.current = setInterval(() => {
      timeLeft -= 1;
      setSecondsRemaining(Math.max(0, timeLeft));
      if (timeLeft <= 0) {
        finalizeQuery();
      }
    }, 1000);

    const setupRecognitionInstance = () => {
      if (!shouldListenRef.current) return;

      try {
        const recognition = new SpeechClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let currentText = '';
          for (let i = 0; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript + ' ';
          }

          const base = baseTranscriptRef.current ? baseTranscriptRef.current + ' ' : '';
          const full = (base + currentText).trim();

          if (full) {
            accumulatedTranscriptRef.current = full;
            setTranscript(full);

            // Generous 2.8s pause after speech before finalizing
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
            }
            silenceTimerRef.current = setTimeout(() => {
              finalizeQuery();
            }, 2800);
          }
        };

        recognition.onerror = (event: { error: string }) => {
          console.warn('Speech recognition event warning:', event.error);
          if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            shouldListenRef.current = false;
            setIsListening(false);
            cleanupTimers();
            setErrorMessage(
              language === 'hi'
                ? 'माइक्रोफ़ोन अनुमति ब्लॉक है। कृपया ब्राउज़र URL बार में माइक आइकॉन पर क्लिक करके "Allow" करें।'
                : 'Microphone permission blocked. Please click the mic/lock icon in your browser address bar and select "Allow".'
            );
          } else if (event.error === 'audio-capture') {
            shouldListenRef.current = false;
            setIsListening(false);
            cleanupTimers();
            setErrorMessage(
              language === 'hi'
                ? 'माइक्रोफ़ोन हार्डवेयर नहीं मिला। कृपया चेक करें कि माइक कनेक्टेड और अनम्यूट है।'
                : 'No microphone input detected. Please verify that your mic is plugged in and unmuted in Windows Settings.'
            );
          } else if (event.error === 'network') {
            shouldListenRef.current = false;
            setIsListening(false);
            cleanupTimers();
            setErrorMessage(
              language === 'hi'
                ? 'ब्राउज़र वॉइस क्लाउड नेटवर्क (वाई-फ़ाई/फ़ायरवॉल) से कनेक्ट नहीं हो सका। आप नीचे सवाल टाइप कर सकते हैं या तुरंत फसल पर टैप करके AI उत्तर पा सकते हैं!'
                : 'Browser cloud speech stream was blocked by local Wi-Fi/firewall. You can type your question below or tap any crop for instant Gemini AI rates and advice!'
            );
          }
        };

        recognition.onend = () => {
          // If session is no longer active, exit
          if (!shouldListenRef.current) return;

          // If still within 15s window, seamlessly preserve speech history and continue listening
          if (restartAttemptsRef.current < 6) {
            restartAttemptsRef.current += 1;
            baseTranscriptRef.current = accumulatedTranscriptRef.current;
            setTimeout(() => {
              if (shouldListenRef.current) {
                setupRecognitionInstance();
              }
            }, 100);
            return;
          }

          if (accumulatedTranscriptRef.current.trim()) {
            finalizeQuery();
          } else {
            setIsListening(false);
            shouldListenRef.current = false;
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        shouldListenRef.current = false;
        setIsListening(false);
        cleanupTimers();
        setErrorMessage(
          language === 'hi'
            ? 'माइक शुरू नहीं हो सका। कृपया नीचे दी गई फसलों में से चुनें या टेक्स्ट सर्च करें।'
            : 'Microphone failed to start. Please select a crop below or type to search.'
        );
      }
    };

    setupRecognitionInstance();
  }, [stopSpeaking, cleanupTimers, language, finalizeQuery, handleQueryText]);

  const selectQuickCrop = useCallback(
    async (cropId: string) => {
      shouldListenRef.current = false;
      cleanupTimers();
      setIsListening(false);
      stopSpeaking();

      const matched = getMandiRateByCropId(cropId);
      const prompt =
        language === 'hi' ? `${matched.cropNameHi} का ताज़ा मंडी भाव` : `${matched.cropNameEn} wholesale price`;
      setTranscript(prompt);
      setResult(matched);
      setIsGenerating(true);

      try {
        const response = await askGeminiVoiceAssistant(prompt, language, matched);
        setAiResponse(response);
        setIsGenerating(false);
        speakResponse(response.spokenText);
      } catch {
        setIsGenerating(false);
        const spoken = language === 'hi' ? matched.spokenResponseHi : matched.spokenResponseEn;
        speakResponse(spoken);
      }
    },
    [language, cleanupTimers, stopSpeaking, speakResponse]
  );

  const reset = useCallback(() => {
    shouldListenRef.current = false;
    cleanupTimers();
    setIsListening(false);
    stopSpeaking();
    setTranscript('');
    setResult(null);
    setAiResponse(null);
    setIsGenerating(false);
    setErrorMessage(null);
    accumulatedTranscriptRef.current = '';
    baseTranscriptRef.current = '';
    setSecondsRemaining(15);
  }, [cleanupTimers, stopSpeaking]);

  useEffect(() => {
    return () => {
      cleanupTimers();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [cleanupTimers]);

  return {
    isListening,
    isSpeaking,
    isGenerating,
    transcript,
    result,
    aiResponse,
    hasSupport,
    errorMessage,
    secondsRemaining,
    startListening,
    stopListening,
    finalizeQuery,
    handleQueryText,
    speakResponse,
    stopSpeaking,
    selectQuickCrop,
    reset,
  };
}

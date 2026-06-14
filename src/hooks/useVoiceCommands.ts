import { useState, useCallback, useEffect, useRef } from 'react';

interface VoiceCommandHandlers {
  onNextExercise: () => void;
  onPrevExercise: () => void;
  onLogSet: () => void;
  onSkipSet: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onStartRestTimer: () => void;
}

export function useVoiceCommands(handlers: VoiceCommandHandlers) {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isListeningRef = useRef(false);

  // Keep isListeningRef in sync so the onend closure has fresh value
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    const SpeechRecognitionCtor =
      (window as unknown as { SpeechRecognition: typeof SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognitionCtor);

    if (SpeechRecognitionCtor) {
      const rec = new SpeechRecognitionCtor();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        console.log('[Voice Command]', transcript);

        // Match commands
        if (transcript.includes('next exercise') || transcript.includes('next') || transcript.includes('go forward')) {
          handlers.onNextExercise();
          setLastCommand('next exercise');
        } else if (transcript.includes('previous exercise') || transcript.includes('previous') || transcript.includes('go back')) {
          handlers.onPrevExercise();
          setLastCommand('previous exercise');
        } else if (transcript.includes('log set') || transcript.includes('log') || transcript.includes('record set') || transcript.includes('add set')) {
          handlers.onLogSet();
          setLastCommand('log set');
        } else if (transcript.includes('skip') || transcript.includes('skip set') || transcript.includes('pass')) {
          handlers.onSkipSet();
          setLastCommand('skipped');
        } else if (transcript.includes('pause') || transcript.includes('stop')) {
          handlers.onPause();
          setLastCommand('pause');
        } else if (transcript.includes('resume') || transcript.includes('start') || transcript.includes('continue')) {
          handlers.onResume();
          setLastCommand('resume');
        } else if (transcript.includes('finish') || transcript.includes('complete') || transcript.includes('end workout') || transcript.includes('done')) {
          handlers.onFinish();
          setLastCommand('finish');
        } else if (transcript.includes('rest') || transcript.includes('timer') || transcript.includes('break')) {
          handlers.onStartRestTimer();
          setLastCommand('rest timer');
        }

        // Clear command display after 3 seconds
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setLastCommand(null), 3000);
      };

      rec.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('[Voice Command] Error:', event.error);
        if (event.error === 'not-allowed') {
          setIsListening(false);
        }
      };

      rec.onend = () => {
        // Auto-restart if we're still supposed to be listening
        if (isListeningRef.current) {
          try { rec.start(); } catch (error) { console.warn('[Voice] command error:', error); }
        }
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (error) { console.warn('[Voice] command error:', error); }
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try { recognitionRef.current.stop(); } catch (error) { console.warn('[Voice] command error:', error); }
      setIsListening(false);
    } else {
      try { recognitionRef.current.start(); } catch (error) { console.warn('[Voice] command error:', error); }
      setIsListening(true);
    }
  }, [isListening]);

  return { isListening, toggleListening, lastCommand, isSupported };
}

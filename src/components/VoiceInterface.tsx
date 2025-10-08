import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Mic, MicOff, Volume2, VolumeX, MessageSquare } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface VoiceInterfaceProps {
  isActive: boolean;
  onToggle: () => void;
}

export function VoiceInterface({ isActive, onToggle }: VoiceInterfaceProps) {
  const { currentLanguage, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [showTextFallback, setShowTextFallback] = useState(false);
  const [textCommand, setTextCommand] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if speech recognition is supported
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setIsSupported(false);
        console.warn('Speech Recognition API is not supported in this browser');
        return;
      }

      setIsSupported(true);

      try {
        // Initialize Speech Recognition
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = currentLanguage === 'te' ? 'te-IN' : 'en-IN';
        
        recognitionInstance.onstart = () => {
          setIsListening(true);
        };
        
        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          handleVoiceCommand(transcript);
        };
        
        recognitionInstance.onerror = (event) => {
          console.log('Speech recognition error:', event.error);
          setIsListening(false);
          
          // Handle specific error types gracefully
          switch (event.error) {
            case 'not-allowed':
              // Silently fall back to text mode
              console.log('Microphone permission denied, falling back to text mode');
              break;
            case 'no-speech':
              toast.info(currentLanguage === 'te' 
                ? 'ఏమీ వినిపించలేదు. మళ్లీ ప్రయత్నించండి' 
                : 'No speech detected. Please try again');
              break;
            case 'network':
              toast.error(currentLanguage === 'te' 
                ? 'నెట్వర్క్ లోపం. ఇంటర్నెట్ కనెక్షన్ చెక్ చేయండి' 
                : 'Network error. Please check your internet connection');
              break;
            case 'service-not-allowed':
            case 'audio-capture':
              setIsSupported(false);
              console.log('Voice recognition service unavailable');
              break;
            default:
              console.log('Speech recognition error:', event.error);
          }
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        
        setRecognition(recognitionInstance);
      } catch (error) {
        console.error('Failed to initialize speech recognition:', error);
        setIsSupported(false);
      }

      // Initialize Speech Synthesis
      if (window.speechSynthesis) {
        setSynthesis(window.speechSynthesis);
      }
    }
  }, [currentLanguage, t]);

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Basic voice commands
    const responses = {
      greeting: {
        te: 'నమస్కారం! లోన్ ట్రాకర్‌కు స్వాగతం',
        en: 'Hello! Welcome to Loan Tracker'
      },
      help: {
        te: 'నేను మీకు లోన్ లెక్కలు, ట్రాకింగ్ మరియు చెల్లింపుల విషయంలో సహాయం చేయగలను',
        en: 'I can help you with loan calculations, tracking, and payments'
      },
      calculate: {
        te: 'లోన్ కాలిక్యులేటర్ తెరవబడుతోంది',
        en: 'Opening loan calculator'
      },
      balance: {
        te: 'మీ మొత్తం మిగిలిన బ్యాలెన్స్ ఒక లక్ష ఎనభై రెండు వేలు రూపాయలు',
        en: 'Your total remaining balance is one lakh eighty-two thousand rupees'
      }
    };

    let responseKey = 'help';
    
    if (lowerCommand.includes('hello') || lowerCommand.includes('hi') || lowerCommand.includes('నమస్కారం')) {
      responseKey = 'greeting';
    } else if (lowerCommand.includes('calculate') || lowerCommand.includes('కాలిక్యులేట్')) {
      responseKey = 'calculate';
    } else if (lowerCommand.includes('balance') || lowerCommand.includes('బ్యాలెన్స్')) {
      responseKey = 'balance';
    }

    const response = responses[responseKey as keyof typeof responses];
    const message = currentLanguage === 'te' ? response.te : response.en;
    
    speak(message);
    toast.success(message);
  };

  const speak = (text: string) => {
    if (synthesis && !isSpeaking) {
      try {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage === 'te' ? 'te-IN' : 'en-IN';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        utterance.onend = () => {
          setIsSpeaking(false);
        };
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsSpeaking(false);
        };
        
        synthesis.speak(utterance);
      } catch (error) {
        console.error('Failed to speak:', error);
        setIsSpeaking(false);
        // Fallback: just show the text as toast
        toast.info(text);
      }
    } else if (!synthesis) {
      // Fallback: show text as toast when synthesis is not available
      toast.info(text);
    }
  };

  const startListening = () => {
    if (!isSupported) {
      toast.info(currentLanguage === 'te' 
        ? 'వాయిస్ రికగ్నిషన్ అందుబాటులో లేదు. టెక్స్ట్ మోడ్ ఉపయోగించండి' 
        : 'Voice recognition unavailable. Please use text mode');
      setShowTextFallback(true);
      return;
    }

    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast.info(currentLanguage === 'te' 
          ? 'వాయిస్ రికగ్నిషన్ సమస్య. టెక్స్ట్ మోడ్ ఉపయోగించండి' 
          : 'Voice recognition issue. Please use text mode');
        setShowTextFallback(true);
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const stopSpeaking = () => {
    if (synthesis && isSpeaking) {
      synthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleTextCommand = () => {
    if (textCommand.trim()) {
      handleVoiceCommand(textCommand);
      setTextCommand('');
      setShowTextFallback(false);
    }
  };

  if (!isActive) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="text-white hover:bg-white/20 h-9 w-9 p-0"
        title={t('enableVoice')}
      >
        <MicOff className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Speaking indicator */}
      {isSpeaking && (
        <Button
          variant="ghost"
          size="sm"
          onClick={stopSpeaking}
          className="text-white hover:bg-white/20 h-9 w-9 p-0 animate-pulse"
          title={t('stopSpeaking')}
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      )}

      {/* Voice input button or text fallback */}
      {isSupported ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={isListening ? stopListening : startListening}
          className={`text-white hover:bg-white/20 h-9 w-9 p-0 ${
            isListening ? 'animate-pulse bg-white/20' : ''
          }`}
          title={isListening ? t('stopListening') : t('voiceCommand')}
          disabled={isSpeaking}
        >
          {isListening ? (
            <Mic className="h-4 w-4 text-red-300" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      ) : (
        <Dialog open={showTextFallback} onOpenChange={setShowTextFallback}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-9 w-9 p-0"
              title={currentLanguage === 'te' ? 'టెక్స్ట్ కమాండ్' : 'Text Command'}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {currentLanguage === 'te' ? 'వాయిస్ కమాండ్ టైప్ చేయండి' : 'Type Voice Command'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={textCommand}
                onChange={(e) => setTextCommand(e.target.value)}
                placeholder={currentLanguage === 'te' ? 'కమాండ్ టైప్ చేయండి...' : 'Type command...'}
                onKeyPress={(e) => e.key === 'Enter' && handleTextCommand()}
              />
              <div className="flex space-x-2">
                <Button onClick={handleTextCommand} className="flex-1">
                  {currentLanguage === 'te' ? 'పంపండి' : 'Send'}
                </Button>
                <Button variant="outline" onClick={() => setShowTextFallback(false)}>
                  {currentLanguage === 'te' ? 'రద్దు' : 'Cancel'}
                </Button>
              </div>
              <div className="text-xs text-gray-500">
                <p>{currentLanguage === 'te' ? 'ఉదాహరణలు:' : 'Examples:'}</p>
                <p>• {currentLanguage === 'te' ? 'నమస్కారం' : 'Hello'}</p>
                <p>• {currentLanguage === 'te' ? 'బ్యాలెన్స్' : 'Balance'}</p>
                <p>• {currentLanguage === 'te' ? 'కాలిక్యులేట్' : 'Calculate'}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Close voice interface */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="text-white hover:bg-white/20 h-9 w-9 p-0"
        title={t('disableVoice')}
      >
        <VolumeX className="h-4 w-4" />
      </Button>
    </div>
  );
}
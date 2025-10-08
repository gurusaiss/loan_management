import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX, Bot, User, Globe } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ChatbotProps {
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

export function Chatbot({ onBack }: ChatbotProps) {
  const { currentLanguage, toggleLanguage, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = currentLanguage === 'te' ? 'te-IN' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error(currentLanguage === 'te' ? 'వాయిస్ గుర్తింపు లోపం' : 'Voice recognition error');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: currentLanguage === 'te' 
        ? 'నమస్కారం! నేను మీ లోన్ అసిస్టెంట్. లోన్లు, వడ్డీ రేట్లు, EMI గణనలు మరియు మరిన్ని విషయాలపై మీకు సహాయం చేయగలను. మీకు ఏమైనా ప్రశ్నలు ఉన్నాయా?'
        : 'Hello! I\'m your loan assistant. I can help you with loans, interest rates, EMI calculations, and more. Do you have any questions?',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [currentLanguage]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const predefinedResponses = {
    te: {
      'emi': 'EMI (ఈక్వేటెడ్ మంత్లీ ఇన్‌స్టాల్మెంట్) అంటే ప్రతి నెలా చెల్లించాల్సిన సమాన మొత్తం. EMI = [P x R x (1+R)^N] / [(1+R)^N-1]. ఇక్కడ P=ప్రిన్సిపల్, R=మంత్లీ రేట్, N=నెలల సంఖ్య.',
      'వడ్డీ': 'వడ్డీ రేట్లు రుణ రకం మరియు బ్యాంక్ ఆధారంగా మారుతాయి. వ్యక్తిగత లోన్లకు 10-24%, గృహ లోన్లకు 6.5-9%, కార్ లోన్లకు 7-12% వరకు ఉంటుంది.',
      'లోన్': 'లోన్ రకాలు: వ్యక్తిగత లోన్, గృహ లోన్, కార్ లోన్, బిజినెస్ లోన్, ఎడ్యుకేషన్ లోన్. ప్రతి లోన్‌కి వేర్వేరు అర్హత మరియు డాక్యుమెంట్స్ అవసరం.',
      'cibil': 'CIBIL స్కోర్ 300-900 మధ్య ఉంటుంది. 750+ మంచి స్కోర్. స్కోర్ మెరుగుపరచడానికి: సమయానికి EMI చెల్లించండి, క్రెడిట్ యూటిలైజేషన్ తక్కువగా ఉంచండి.',
      'రుణమాఫీ': 'ప్రభుత్వ రుణమాఫీ పథకాలు రైతులు మరియు చిన్న వ్యాపారుల కోసం ఉంటాయి. అర్హత మరియు వివరాలు సరకారీ వెబ్‌సైట్‌లో చూడండి.',
      'default': 'నేను లోన్లు, EMI, వడ్డీ రేట్లు, CIBIL స్కోర్, రుణమాఫీ పథకాలు గురించి సహాయం చేయగలను. మరే ప్రశ్న అడగండి!'
    },
    en: {
      'emi': 'EMI (Equated Monthly Installment) is a fixed payment amount. Formula: EMI = [P x R x (1+R)^N] / [(1+R)^N-1]. Where P=Principal, R=Monthly rate, N=Number of months.',
      'interest': 'Interest rates vary by loan type: Personal loans 10-24%, Home loans 6.5-9%, Car loans 7-12%. Rates depend on your credit score and lender policies.',
      'loan': 'Loan types: Personal loan, Home loan, Car loan, Business loan, Education loan. Each has different eligibility criteria and documentation requirements.',
      'cibil': 'CIBIL score ranges from 300-900. 750+ is good. To improve: Pay EMIs on time, keep credit utilization low, maintain credit history length.',
      'waiver': 'Government loan waiver schemes are available for farmers and small businesses. Check official government websites for eligibility and details.',
      'default': 'I can help with loans, EMI calculations, interest rates, CIBIL scores, loan waiver schemes. What would you like to know?'
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    const responses = predefinedResponses[currentLanguage];

    // Check for keywords
    if (message.includes('emi') || message.includes('ఈఎంఐ')) {
      return responses.emi || responses.default;
    }
    if (message.includes('interest') || message.includes('వడ్డీ')) {
      return responses.interest || responses['వడ్డీ'] || responses.default;
    }
    if (message.includes('loan') || message.includes('లోన్')) {
      return responses.loan || responses['లోన్'] || responses.default;
    }
    if (message.includes('cibil') || message.includes('సిబిల్') || message.includes('credit score')) {
      return responses.cibil || responses.default;
    }
    if (message.includes('waiver') || message.includes('మాఫీ') || message.includes('రుణమాఫీ')) {
      return responses.waiver || responses['రుణమాఫీ'] || responses.default;
    }

    return responses.default;
  };

  const addMessage = (content: string, type: 'user' | 'bot', isVoice = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      isVoice
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, 'user');
    setInputMessage('');
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage);
      addMessage(botResponse, 'bot');
      setIsTyping(false);

      // Auto-speak bot response if synthesis is available
      if (synthRef.current && !isSpeaking) {
        speakText(botResponse);
      }
    }, 1000);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.lang = currentLanguage === 'te' ? 'te-IN' : 'en-US';
      recognitionRef.current.start();
    } else {
      toast.error(currentLanguage === 'te' ? 'వాయిస్ గుర్తింపు అందుబాటులో లేదు' : 'Voice recognition not available');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (synthRef.current && !isSpeaking) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'te' ? 'te-IN' : 'en-US';
      utterance.rate = 0.9;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const quickQuestions = currentLanguage === 'te' ? [
    'EMI ఎలా లెక్కించాలి?',
    'వడ్డీ రేట్లు ఎంత?',
    'CIBIL స్కోర్ ఎలా మెరుగుపరచాలి?',
    'లోన్ రకాలు ఏమిటి?'
  ] : [
    'How to calculate EMI?',
    'What are interest rates?',
    'How to improve CIBIL score?',
    'What are loan types?'
  ];

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('chatbot')}</h2>
            <p className="text-sm text-gray-600">
              {currentLanguage === 'te' ? 'రుణ సహాయకుడు' : 'Loan Assistant'}
            </p>
          </div>
        </div>
        
        {/* Language Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="h-9 w-9 p-0"
        >
          <div className="flex flex-col items-center">
            <Globe className="h-3 w-3 mb-0.5" />
            <span className="text-xs font-medium">
              {currentLanguage === 'te' ? 'EN' : 'TE'}
            </span>
          </div>
        </Button>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col border-0 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Bot className="h-5 w-5 mr-2 text-blue-600" />
              {currentLanguage === 'te' ? 'లోన্ బট్' : 'Loan Bot'}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {currentLanguage === 'te' ? 'ఆన్‌లైన్' : 'Online'}
              </Badge>
              {isSpeaking && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopSpeaking}
                  className="h-8 w-8 p-0"
                >
                  <VolumeX className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-4">
          {/* Messages */}
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.type === 'bot' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakText(message.content)}
                            className="h-6 w-6 p-0 ml-2"
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      {message.isVoice && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {currentLanguage === 'te' ? 'వాయిస్' : 'Voice'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Questions */}
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">
              {currentLanguage === 'te' ? 'త్వరిత ప్రశ్నలు:' : 'Quick Questions:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputMessage(question);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('typeMessage')}
                className="pr-12"
              />
              {isListening && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={isListening ? stopListening : startListening}
              className={`h-10 w-10 p-0 ${isListening ? 'bg-red-100 border-red-300' : ''}`}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-red-500" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="h-10 w-10 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
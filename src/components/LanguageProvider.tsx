import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'te' | 'en';

interface Translations {
  [key: string]: {
    te: string;
    en: string;
  };
}

const translations: Translations = {
  // App Title
  appTitle: { te: 'ప్రొఫైల్', en: 'Profile' },
  appSubtitle: { te: 'స్మార్ట్ లోన్ మేనేజర్', en: 'Smart Loan Manager' },
  
  // Navigation
  home: { te: 'హోం', en: 'Home' },
  dashboard: { te: 'డాష్‌బోర్డ్', en: 'Dashboard' },
  calculator: { te: 'కాలిక్యులేటర్', en: 'Calculator' },
  tracker: { te: 'ట్రాకర్', en: 'Tracker' },
  history: { te: 'చరిత్ర', en: 'History' },
  comparison: { te: 'పోలిక', en: 'Compare' },
  alerts: { te: 'అలర్ట్స్', en: 'Alerts' },
  banking: { te: 'ప్రభుత్వ పథకాలు', en: 'Govt. Schemes' },
  repaymentHistory: { te: 'తిరిగిచెల్లింపు చరిత్ర', en: 'Repayment History' },
  
  // Dashboard
  welcome: { te: 'నమస్తే రాము! 🙏', en: 'Namaste Ram! 🙏' },
  welcomeSubtext: { te: 'మీ లోన్ పోర్ట్‌ఫోలియోను మేనేజ్ చేయండి', en: 'Manage your loan portfolio efficiently' },
  totalLoans: { te: 'మొత్తం రుణం', en: 'Total Loans' },
  monthlyEMI: { te: 'నెలవారీ EMI', en: 'Monthly EMI' },
  remaining: { te: 'మిగిలిన మొత్తం', en: 'Remaining' },
  totalLoanAmount: { te: 'మొత్తం రుణం', en: 'Total Loan Amount' },
  amountPaid: { te: 'చెల్లించిన మొత్తం', en: 'Amount Paid' },
  remainingBalance: { te: 'మిగిలిన మొత్తం', en: 'Remaining Balance' },
  quickActions: { te: 'త్వరిత చర్యలు', en: 'Quick Actions' },
  viewAll: { te: 'అన్నీ చూడండి', en: 'View All' },
  activeLoans: { te: 'క్రియాశీల లోన్లు', en: 'Active Loans' },
  financialInsight: { te: 'మాలీ సలహా', en: 'Financial Insight' },
  learnMore: { te: 'వివరాలు చూడండి', en: 'Learn More' },
  
  // Quick Actions
  calculateInterest: { te: 'వడ్డీ లెక్కలు', en: 'Calculate Interest' },
  calculateInterestSubtext: { te: 'కొత్త లోన్ కాలిక్యులేట్ చేయండి', en: 'Calculate new loan' },
  trackLoans: { te: 'లోన్ ట్రాకింగ్', en: 'Track Loans' },
  trackLoansSubtext: { te: 'మీ లోన్లను ట్రాక్ చేయండి', en: 'Monitor your loans' },
  compareLoans: { te: 'లోన్ పోలిక', en: 'Compare Loans' },
  compareLoansSubtext: { te: 'వివిధ లోన్లను పోల్చండి', en: 'Compare different offers' },
  governmentSchemes: { te: 'ప్రభుత్వ పథకాలు', en: 'Government Schemes' },
  governmentSchemesSubtext: { te: 'అధికారిక లోన్ పథకాలు చూడండి', en: 'Explore official loan schemes' },
  
  // Loan Details
  homeLoan: { te: 'హోం లోన్', en: 'Home Loan' },
  carLoan: { te: 'కార్ లోన్', en: 'Car Loan' },
  active: { te: 'క్రియాశీలం', en: 'Active' },
  progress: { te: 'పురోగతి', en: 'Progress' },
  nextPayment: { te: 'తదుపరి చెల్లింపు:', en: 'Next payment:' },
  payNow: { te: 'చెల్లించండి', en: 'Pay Now' },
  
  // Calculator
  interestCalculator: { te: 'వడ్డీ కాలిక్యులేటర్', en: 'Interest Calculator' },
  calculatorSubtext: { te: 'సింపుల్ మరియు కంపౌండ్ వడ్డీని లెక్కించండి', en: 'Calculate simple and compound interest easily' },
  simpleInterest: { te: 'సింపుల్ వడ్డీ', en: 'Simple Interest' },
  compoundInterest: { te: 'కంపౌండ్ వడ్డీ', en: 'Compound Interest' },
  loanDetails: { te: 'లోన్ వివరాలు', en: 'Loan Details' },
  principalAmount: { te: 'అసలు మొత్తం (₹)', en: 'Principal Amount (₹)' },
  interestRate: { te: 'వడ్డీ రేటు (% వార్షికం)', en: 'Interest Rate (% per annum)' },
  timePeriod: { te: 'కాలవధి (సంవత్సరాలు)', en: 'Time Period (Years)' },
  compoundingFrequency: { te: 'కంపౌండింగ్ ఫ్రీక్వెన్సీ', en: 'Compounding Frequency' },
  totalInterest: { te: 'మొత్తం వడ్డీ', en: 'Total Interest' },
  totalAmount: { te: 'మొత్తం చెల్లించవలసిన మొత్తం', en: 'Total Amount' },
  breakdown: { te: 'విభజన', en: 'Breakdown' },
  schedule: { te: 'షెడ్యూల్', en: 'Schedule' },
  amountBreakdown: { te: 'మొత్తం విభజన', en: 'Amount Breakdown' },
  monthlyBreakdown: { te: 'నెలవారీ విభజన', en: 'Monthly Breakdown' },
  trackLoan: { te: 'లోన్ ట్రాక్ చేయండి', en: 'Track Loan' },
  saveResult: { te: 'సేవ్ చేయండి', en: 'Save Result' },
  
  // Frequency options
  annually: { te: 'వార్షికం', en: 'Annually' },
  semiAnnually: { te: 'అర్ధ వార్షికం', en: 'Semi-annually' },
  quarterly: { te: 'త్రైమాసికం', en: 'Quarterly' },
  monthly: { te: 'నెలవారీ', en: 'Monthly' },
  
  // Common terms
  amount: { te: 'మొత్తం', en: 'Amount' },
  interest: { te: 'వడ్డీ', en: 'Interest' },
  principal: { te: 'అసలు మొత్తం', en: 'Principal' },
  rate: { te: 'రేట్', en: 'Rate' },
  time: { te: 'సమయం', en: 'Time' },
  years: { te: 'సంవత్సరాలు', en: 'Years' },
  months: { te: 'నెలలు', en: 'Months' },
  calculate: { te: 'లెక్కించు', en: 'Calculate' },
  result: { te: 'ఫలితం', en: 'Result' },
  save: { te: 'సేవ్', en: 'Save' },
  cancel: { te: 'రద్దు', en: 'Cancel' },
  
  // Loan terms
  loan: { te: 'రుణం', en: 'Loan' },
  payment: { te: 'చెల్లింపు', en: 'Payment' },
  balance: { te: 'మిగులు', en: 'Balance' },
  dueDate: { te: 'చెల్లించవలసిన తేదీ', en: 'Due Date' },
  emi: { te: 'EMI', en: 'EMI' },
  
  // Voice interface
  voiceMode: { te: 'వాయిస్ మోడ్', en: 'Voice Mode' },
  listening: { te: 'వింటున్నాను...', en: 'Listening...' },
  speak: { te: 'మాట్లాడండి', en: 'Speak' },
  enableVoice: { te: 'వాయిస్ ఇంటర్‌ఫేస్ ఆన్ చేయండి', en: 'Enable Voice Interface' },
  disableVoice: { te: 'వాయిస్ ఇంటర్‌ఫేస్ ఆఫ్ చేయండి', en: 'Disable Voice Interface' },
  stopListening: { te: 'వినడం ఆపండి', en: 'Stop Listening' },
  voiceCommand: { te: 'వాయిస్ కమాండ్ చెప్పండి', en: 'Voice Command' },
  stopSpeaking: { te: 'స్పీకింగ్ ఆపండి', en: 'Stop Speaking' },
  
  // Error messages
  voiceRecognitionError: { te: 'వాయిస్ రికగ్నిషన్ లోపం', en: 'Voice recognition error' },
  
  // Lending
  lendMoney: { te: 'డబ్బు రుణం ఇవ్వండి', en: 'Lend Money' },
  borrowMoney: { te: 'డబ్బు రుణం తీసుకోండి', en: 'Borrow Money' },
  receiverMobile: { te: 'రిసీవర్ మొబైల్ నంబర్', en: 'Receiver Mobile Number' },
  interestType: { te: 'వడ్డీ రకం', en: 'Interest Type' },
  term: { te: 'వ్యవధి', en: 'Term' },
  signContract: { te: 'ఒప్పందం సంతకం చేయండి', en: 'Sign E-Contract' },
  lendingDetails: { te: 'రుణ వివరాలు', en: 'Lending Details' },
  contractSigned: { te: 'ఒప్పందం సంతకం చేయబడింది', en: 'Contract Signed' },
  
  // Login/Signup
  welcomeToApp: { te: 'ప్రొఫైల్‌కు స్వాగతం', en: 'Welcome to Profile' },
  smartLoanManager: { te: 'స్మార్ట్ లోన్ మేనేజర్', en: 'Smart Loan Manager' },
  phoneNumber: { te: 'మొబైల్ నంబర్', en: 'Phone Number' },
  enterPhoneNumber: { te: 'మీ మొబైల్ నంబర్ నమోదు చేయండి', en: 'Enter your phone number' },
  sendOTP: { te: 'OTP పంపించు', en: 'Send OTP' },
  verifyOTP: { te: 'OTP వెరిఫై చేయండి', en: 'Verify OTP' },
  enterOTP: { te: 'OTP నమోదు చేయండి', en: 'Enter OTP' },
  otpSent: { te: 'OTP పంపబడింది', en: 'OTP sent to' },
  resendOTP: { te: 'OTP మళ్లీ పంపించు', en: 'Resend OTP' },
  verifyAndContinue: { te: 'వెరిఫై చేసి కొనసాగించు', en: 'Verify & Continue' },
  orSignInWith: { te: 'లేదా దీనితో సైన్ ఇన్ చేయండి', en: 'Or sign in with' },
  signInWithGoogle: { te: 'Google తో సైన్ ఇన్', en: 'Sign in with Google' },
  invalidOTP: { te: 'చెల్లని OTP', en: 'Invalid OTP' },
  otpVerified: { te: 'OTP వెరిఫై అయింది', en: 'OTP Verified' },
  
  // Onboarding
  appIntroduction: { te: 'యాప్ ప��ిచయం', en: 'App Introduction' },
  continueButton: { te: 'కొనసాగించు', en: 'Continue' },
  scanAadhar: { te: 'ఆధార్ స్కాన్ చేయండి', en: 'Scan Aadhar' },
  aadharNumber: { te: 'ఆధార్ నంబర్', en: 'Aadhar Number' },
  detected: { te: 'గుర్తించబడింది', en: 'Detected' },
  getStarted: { te: 'ప్రారంభించండి', en: 'Get Started' },
  featuresOverview: { te: 'ఫీచర్స్ వివరణ', en: 'Features Overview' },
  playVideo: { te: 'వీడియో ప్లే చేయండి', en: 'Play Video' },
  videoPlaying: { te: 'వీడియో ప్లే అవుతోంది', en: 'Video Playing' },
  subtitles: { te: 'సబ్‌టైటిల్స్', en: 'Subtitles' },
  
  // Aadhaar Verification
  aadhaarVerification: { te: 'ఆధార్ వెరిఫికేషన్', en: 'Aadhaar Verification' },
  uploadAadhaar: { te: 'ఆధార్ అప్‌లోడ్ చేయండి', en: 'Upload Aadhaar' },
  uploadDocument: { te: 'డాక్యుమెంట్ అప్‌లోడ్ చేయండి', en: 'Upload Document' },
  selectFile: { te: 'ఫైల్ ఎంచుకోండి', en: 'Select File' },
  uploadFromDevice: { te: 'డివైస్ నుండి అప్‌లోడ్', en: 'Upload from Device' },
  takePicture: { te: 'ఫోటో తీయండి', en: 'Take Picture' },
  extractingDetails: { te: 'వివరాలు సేకరిస్తోంది...', en: 'Extracting details...' },
  aadhaarExtracted: { te: 'ఆధార్ వివరాలు సేకరించబడ్డాయి', en: 'Aadhaar details extracted' },
  confirmDetails: { te: 'వివరాలను నిర్ధారించండి', en: 'Confirm Details' },
  saveToProfile: { te: 'ప్రొఫైల్‌లో సేవ్ చేయండి', en: 'Save to Profile' },
  fullName: { te: 'పూర్తి పేరు', en: 'Full Name' },
  dateOfBirth: { te: 'పుట్టిన తేదీ', en: 'Date of Birth' },
  gender: { te: 'లింగం', en: 'Gender' },
  address: { te: 'చిరునామా', en: 'Address' },
  male: { te: 'పురుషుడు', en: 'Male' },
  female: { te: 'స్త్రీ', en: 'Female' },
  other: { te: 'ఇతర', en: 'Other' },
  
  // Profile
  profile: { te: 'ప్రొఫైల్', en: 'Profile' },
  editProfile: { te: 'ప్రొఫైల్ ఎడిట్ చేయండి', en: 'Edit Profile' },
  personalDetails: { te: 'వ్యక్తిగత వివరాలు', en: 'Personal Details' },
  saveChanges: { te: 'మార్పులు సేవ్ చేయండి', en: 'Save Changes' },
  profileUpdated: { te: 'ప్రొఫైల్ అప్‌డేట్ అయింది', en: 'Profile Updated' },
  
  // Error Messages
  pleaseEnterPhone: { te: 'దయచేసి మొబైల్ నంబర్ నమోదు చేయండి', en: 'Please enter phone number' },
  pleaseEnterOTP: { te: 'దయచేసి OTP నమోదు చేయండి', en: 'Please enter OTP' },
  pleaseUploadDocument: { te: 'దయచేసి డాక్యుమెంట్ అప్‌లోడ్ చేయండి', en: 'Please upload document' },
  fileSizeError: { te: 'ఫైల్ సైజ్ చాలా పెద్దది', en: 'File size too large' },
  uploadError: { te: 'అప్‌లోడ్ లోపం', en: 'Upload error' },
  pleaseEnterAmount: { te: 'దయచేసి మొత్తం నమోదు చేయండి', en: 'Please enter amount' },
  pleaseEnterRate: { te: 'దయచేసి వడ్డీ రేట్ నమోదు చేయండి', en: 'Please enter interest rate' },

  // Additional Translations for Enhanced Features
  legalEducation: { te: 'చట్టపరమైన విద్య', en: 'Legal Education' },
  chatbot: { te: 'చాట్‌బాట్', en: 'Chatbot' },
  typeMessage: { te: 'సందేశం టైప్ చేయండి...', en: 'Type your message...' },
  
  // Contract & Documentation
  contractGenerated: { te: 'ఒప్పందం రూపొందించబడింది', en: 'Contract Generated' },
  generateContract: { te: 'ఒప్పందం రూపొందించండి', en: 'Generate Contract' },
  downloadContract: { te: 'ఒప్పందం డౌన్‌లోడ్ చేయండి', en: 'Download Contract' },
  loanContract: { te: 'లోన్ ఒప్పందం', en: 'Loan Contract' },
  
  // Borrower/Lender Details
  borrowerDetails: { te: 'రుణగ్రహీత వివరాలు', en: 'Borrower Details' },
  borrowerName: { te: 'రుణగ్రహీత పేరు', en: 'Borrower Name' },
  borrowerPhone: { te: 'రుణగ్రహీత ఫోన్', en: 'Borrower Phone' },
  borrowerAddress: { te: 'రుణగ్రహీత చిరునామా', en: 'Borrower Address' },
  lenderDetails: { te: 'రుణదాత వివరాలు', en: 'Lender Details' },
  lenderName: { te: 'రుణదాత పేరు', en: 'Lender Name' },
  lenderPhone: { te: 'రుణదాత ఫోన్', en: 'Lender Phone' },
  lenderAddress: { te: 'రుణదాత చిరునామా', en: 'Lender Address' },
  
  // ID Proof & Documentation
  idProofType: { te: 'గుర్తింపు రుజువు రకం', en: 'ID Proof Type' },
  uploadIdProof: { te: 'గుర్తింపు రుజువు అప్‌లోడ్ చేయండి', en: 'Upload ID Proof' },
  amountBorrowed: { te: 'రుణగ్రహీత మొత్తం', en: 'Amount Borrowed' },
  repaymentDate: { te: 'తిరిగి చెల్లింపు తేదీ', en: 'Repayment Date' },
  termsAndConditions: { te: 'నియమాలు మరియు షరతులు', en: 'Terms and Conditions' },

  // Offline/Sync Status
  backOnline: { te: 'తిరిగి ఆన్‌లైన్‌లో ఉన్నారు', en: 'Back online' },
  offlineMode: { te: 'ఆఫ్‌లైన్ మోడ్ - డేటా స్థానికంగా సేవ్ చేయబడుతుంది', en: 'Offline mode - Data saved locally' },
};

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to Telugu ('te') always on first load
  const [currentLanguage, setCurrentLanguage] = useState<Language>('te');

  const t = (key: string): string => {
    return translations[key]?.[currentLanguage] || key;
  };

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('loan-tracker-language', lang);
  };

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'te' ? 'en' : 'te';
    setLanguage(newLanguage);
  };

  useEffect(() => {
    // Always start with Telugu as default, but allow user preference if saved
    const savedLanguage = localStorage.getItem('loan-tracker-language') as Language;
    if (savedLanguage && (savedLanguage === 'te' || savedLanguage === 'en')) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Explicitly set Telugu as default if no saved preference
      setCurrentLanguage('te');
      localStorage.setItem('loan-tracker-language', 'te');
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
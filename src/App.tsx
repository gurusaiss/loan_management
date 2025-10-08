import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './components/LanguageProvider';
import { Dashboard } from './components/Dashboard';
import { InterestCalculator } from './components/InterestCalculator';
import { PaymentHistory } from './components/PaymentHistory';
import { LoanComparison } from './components/LoanComparison';
import { AlertManager } from './components/AlertManager';
import { BankingIntegration } from './components/BankingIntegration';
import { LendMoney } from './components/LendMoney';
import { BorrowMoney } from './components/BorrowMoney';
import { LegalTerms } from './components/LegalTerms';
import { Chatbot } from './components/Chatbot';
import { Onboarding } from './components/Onboarding';
import { Profile } from './components/Profile';
import { VoiceInterface } from './components/VoiceInterface';
import { Navigation } from './components/Navigation';
import { Toaster } from './components/ui/sonner';
import { Settings, Bell, User, Wifi, WifiOff, RefreshCw, CheckCircle, Video, Languages, Play } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { dataStore } from './utils/dataStore';
import { toast } from 'sonner@2.0.3';

type Screen = 'dashboard' | 'calculator' | 'comparison' | 'banking' | 'history' | 'alerts' | 'lendMoney' | 'borrowMoney' | 'profile' | 'legalTerms' | 'chatbot';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [appState, setAppState] = useState<'login' | 'onboarding' | 'aadhaar' | 'app'>('login');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState({ needsSync: false, isOnline: navigator.onLine, lastSync: undefined });
  const [isSyncing, setIsSyncing] = useState(false);
  const { currentLanguage, toggleLanguage, t } = useLanguage();

  // Check user authentication and verification status
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboarding-completed');
    const isAadhaarVerified = localStorage.getItem('aadhaar-verified');

    if (!hasCompletedOnboarding || !isAadhaarVerified) {
      setAppState('onboarding');
    } else {
      setAppState('app');
    }

    // Set up offline/online detection
    const handleOnline = () => {
      setIsOnline(true);
      toast.success(t('backOnline'));
      checkSyncStatus();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning(t('offlineMode'));
    };

    // Set up sync event listeners
    const handleDataSynced = (event: any) => {
      setIsSyncing(false);
      const { loans, notifications } = event.detail;
      toast.success(
        currentLanguage === 'te' 
          ? `${loans + notifications} వస్తువులు సమకాలీకరించబడ్డాయి`
          : `${loans + notifications} items synced successfully`
      );
      checkSyncStatus();
    };

    const handleSyncFailed = () => {
      setIsSyncing(false);
      toast.error(currentLanguage === 'te' ? 'సమకాలీకరణ విఫలమైంది' : 'Sync failed');
      checkSyncStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('dataSynced', handleDataSynced);
    window.addEventListener('syncFailed', handleSyncFailed);

    // Initial sync status check
    checkSyncStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('dataSynced', handleDataSynced);
      window.removeEventListener('syncFailed', handleSyncFailed);
    };
  }, [currentLanguage, t]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding-completed', 'true');
    localStorage.setItem('aadhaar-verified', 'true');
    localStorage.setItem('user-logged-in', 'true');
    setAppState('app');
  };

  const checkSyncStatus = async () => {
    try {
      const status = await dataStore.getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error('Error checking sync status:', error);
    }
  };

  const handleManualSync = async () => {
    if (!isOnline) {
      toast.error(currentLanguage === 'te' ? 'ఇంటర్నెట్ కనెక్షన్ అవసరం' : 'Internet connection required');
      return;
    }
    
    setIsSyncing(true);
    try {
      // Trigger manual sync
      await dataStore.generatePaymentNotifications();
      // The sync will happen automatically when notifications are generated
      toast.info(currentLanguage === 'te' ? 'సమకాలీకరణ ప్రారంభమైంది...' : 'Sync started...');
    } catch (error) {
      setIsSyncing(false);
      toast.error(currentLanguage === 'te' ? 'సమకాలీకరణ లోపం' : 'Sync error');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentScreen} />;
      case 'calculator':
        return <InterestCalculator />;
      case 'comparison':
        return <LoanComparison />;
      case 'banking':
        return <BankingIntegration />;
      case 'history':
        return <PaymentHistory />;
      case 'alerts':
        return <AlertManager />;
      case 'lendMoney':
        return <LendMoney onBack={() => setCurrentScreen('dashboard')} />;
      case 'borrowMoney':
        return <BorrowMoney onBack={() => setCurrentScreen('dashboard')} />;
      case 'legalTerms':
        return <LegalTerms onBack={() => setCurrentScreen('dashboard')} />;
      case 'chatbot':
        return <Chatbot onBack={() => setCurrentScreen('dashboard')} />;
      case 'profile':
        return <Profile onBack={() => setCurrentScreen('dashboard')} />;
      default:
        return <Dashboard onNavigate={setCurrentScreen} />;
    }
  };

  // Show appropriate screen based on app state
  if (appState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.1),transparent_50%)]" />
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative p-6 pb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                {/* Profile Icon */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentScreen('profile')}
                  className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full"
                >
                  <span className="text-lg">👨</span>
                </Button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-lg">💰</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">
                      {t('appTitle')}
                    </h1>
                    <p className="text-blue-100 text-sm opacity-90">
                      {t('appSubtitle')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="text-white hover:bg-white/20 h-9 w-9 p-0 flex flex-col items-center justify-center"
                >
                  <div className="flex items-center space-x-0.5">
                    <span className="text-xs font-bold">అ</span>
                    <span className="text-xs font-bold">A</span>
                  </div>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentScreen('alerts')}
                  className="text-white hover:bg-white/20 h-9 w-9 p-0 relative"
                >
                  <Bell className="h-4 w-4" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white">3</span>
                  </div>
                </Button>

                {/* Sync Status Indicator */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleManualSync}
                  disabled={isSyncing || !isOnline}
                  className="text-white hover:bg-white/20 h-9 w-9 p-0 relative"
                  title={isOnline ? 
                    (syncStatus.needsSync ? (currentLanguage === 'te' ? 'సమకాలీకరణ అవసరం' : 'Needs sync') : 
                     (currentLanguage === 'te' ? 'సమకాలీకరించబడింది' : 'Synced')) :
                    (currentLanguage === 'te' ? 'ఆఫ్‌లైన్ మోడ్' : 'Offline mode')
                  }
                >
                  {isSyncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : isOnline ? (
                    syncStatus.needsSync ? (
                      <RefreshCw className="h-4 w-4 text-yellow-300" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-300" />
                    )
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-300" />
                  )}
                  {syncStatus.needsSync && isOnline && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full" />
                  )}
                </Button>

                {/* Reset All Data for Testing */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    localStorage.removeItem('user-logged-in');
                    localStorage.removeItem('onboarding-completed');
                    localStorage.removeItem('aadhaar-verified');
                    localStorage.removeItem('user-profile');
                    localStorage.removeItem('user-phone');
                    localStorage.removeItem('user-auth-method');
                    setAppState('onboarding');
                  }}
                  className="text-white hover:bg-white/20 h-9 w-9 p-0"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVoiceMode(!isVoiceMode)}
                  className="text-white hover:bg-white/20 h-9 w-9 p-0"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Quick Stats Bar */}
            <div className="mt-4 flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-center">
                <p className="text-xs text-blue-100 opacity-80">
                  {t('totalLoans')}
                </p>
                <p className="text-sm font-semibold">₹25,000</p>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-xs text-blue-100 opacity-80">
                  {t('monthlyEMI')}
                </p>
                <p className="text-sm font-semibold">₹2,083</p>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-xs text-blue-100 opacity-80">
                  {t('remaining')}
                </p>
                <p className="text-sm font-semibold">₹17,500</p>
              </div>
            </div>
          </div>
          
          {/* Wave Bottom */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-6" viewBox="0 0 400 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,12 C100,4 300,20 400,12 L400,24 L0,24 Z" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative pb-20 pt-2">
          {renderScreen()}
        </div>

        {/* Bottom Navigation */}
        <Navigation 
          currentScreen={currentScreen} 
          onNavigate={setCurrentScreen} 
        />
      </div>
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'white',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '14px',
            padding: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
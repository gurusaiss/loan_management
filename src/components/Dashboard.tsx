import React from 'react';
import { useLanguage } from './LanguageProvider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  Calendar,
  CreditCard,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Target,
  Globe,
  Book,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type Screen = 'dashboard' | 'calculator' | 'comparison' | 'banking' | 'history' | 'alerts' | 'lendMoney' | 'borrowMoney' | 'legalTerms' | 'chatbot';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { currentLanguage, toggleLanguage, t } = useLanguage();

  const handlePayNow = (loan: any) => {
    // List of popular payment apps in India
    const paymentApps = [
      { name: 'PhonePe', scheme: 'phonepe://', playStore: 'https://play.google.com/store/apps/details?id=com.phonepe.app' },
      { name: 'Google Pay', scheme: 'tez://', playStore: 'https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user' },
      { name: 'Paytm', scheme: 'paytm://', playStore: 'https://play.google.com/store/apps/details?id=net.one97.paytm' },
      { name: 'BHIM UPI', scheme: 'bhim://', playStore: 'https://play.google.com/store/apps/details?id=in.org.npci.upiapp' },
      { name: 'Amazon Pay', scheme: 'amazonpay://', playStore: 'https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping' }
    ];

    // Try to open each payment app
    const tryOpenPaymentApp = (appIndex: number = 0) => {
      if (appIndex >= paymentApps.length) {
        // If no apps can be opened, show UPI payment URL
        showUPIPayment(loan);
        return;
      }

      const app = paymentApps[appIndex];
      const amount = loan.emi.replace('₹', '').replace(',', '');
      const upiUrl = `${app.scheme}pay?pa=loanapp@upi&pn=Loan%20Payment&am=${amount}&cu=INR&tn=EMI%20Payment%20for%20${encodeURIComponent(loan.name)}`;
      
      // Try to open the app
      window.location.href = upiUrl;
      
      // If app doesn't open within 2 seconds, try next app
      setTimeout(() => {
        tryOpenPaymentApp(appIndex + 1);
      }, 2000);
    };

    // Show payment initiation message
    toast.success(
      currentLanguage === 'te' 
        ? 'పేమెంట్ యాప్ తెరుస్తోంది...' 
        : 'Opening payment app...'
    );

    // Start trying payment apps
    tryOpenPaymentApp();
  };

  const showUPIPayment = (loan: any) => {
    const amount = loan.emi.replace('₹', '').replace(',', '');
    const upiId = 'loanapp@upi';
    const transactionNote = `EMI Payment for ${loan.name}`;
    
    // Generic UPI URL that can be handled by any UPI app
    const upiUrl = `upi://pay?pa=${upiId}&pn=Loan%20Payment&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    
    try {
      window.open(upiUrl, '_blank');
    } catch (error) {
      // Fallback: Show payment details
      const message = currentLanguage === 'te' 
        ? `పేమెంట్ వివరాలు:\nUPI ID: ${upiId}\nమొత్తం: ₹${amount}\nనోట్: ${transactionNote}\n\nదయచేసి ఏదైనా UPI యాప్ ఉపయోగించి పేమెంట్ చేయండి.`
        : `Payment Details:\nUPI ID: ${upiId}\nAmount: ₹${amount}\nNote: ${transactionNote}\n\nPlease use any UPI app to make the payment.`;
      
      alert(message);
      
      toast.info(
        currentLanguage === 'te' 
          ? 'పేమెంట్ వివరాలు కాపీ చేయబడ్డాయి' 
          : 'Payment details shown'
      );
    }
  };



  const loanStats = [
    {
      title: t('totalLoanAmount'),
      value: '₹25,000',
      change: '+₹25,000',
      changeType: 'increase',
      icon: IndianRupee,
      color: 'text-blue-600'
    },
    {
      title: t('amountPaid'),
      value: '₹7,500',
      change: '+₹2,083',
      changeType: 'increase',
      icon: CreditCard,
      color: 'text-green-600'
    },
    {
      title: t('remainingBalance'),
      value: '₹17,500',
      change: '-₹2,083',
      changeType: 'decrease',
      icon: Target,
      color: 'text-purple-600'
    },
    {
      title: t('monthlyEMI'),
      value: '₹2,083',
      change: 'Due in 5 days',
      changeType: 'neutral',
      icon: Calendar,
      color: 'text-orange-600'
    }
  ];

  const recentLoans = [
    {
      id: 1,
      name: currentLanguage === 'te' ? 'వ్యవసాయ లోన్' : 'Farm Loan',
      lender: currentLanguage === 'te' ? 'రాజేష్' : 'Rajesh',
      amount: '₹25,000',
      emi: '₹2,083', // 25000 * 8% / 12 months (approximate)
      dueDate: '10 Nov 2024',
      status: 'active',
      progress: 30,
      interestRate: '8%'
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('welcome')}
            </h2>
            <p className="text-gray-600">
              {t('welcomeSubtext')}
            </p>
          </div>
          
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="h-10 w-12 p-0"
          >
            <div className="flex flex-col items-center">
              <Globe className="h-3 w-3 mb-0.5" />
              <span className="text-xs font-medium">
                {currentLanguage === 'te' ? 'EN' : 'TE'}
              </span>
            </div>
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        {loanStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {stat.changeType !== 'neutral' && (
                    <div className={`flex items-center text-xs ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'increase' ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {stat.change}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600 mt-1">{stat.title}</p>
                  {stat.changeType === 'neutral' && (
                    <Badge variant="outline" className="mt-2 text-xs bg-orange-50 text-orange-700 border-orange-200">
                      {stat.change}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Loans */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('activeLoans')}
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => onNavigate('tracker')}
          >
            {t('viewAll')}
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentLoans.map((loan) => (
            <Card key={loan.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{loan.name}</h4>
                      <p className="text-sm text-gray-600">{currentLanguage === 'te' ? 'రుణదాత' : 'Lender'}: {loan.lender}</p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {t('active')}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">
                        {t('remaining')}
                      </p>
                      <p className="font-semibold text-gray-900">{loan.amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        {t('monthlyEMI')}
                      </p>
                      <p className="font-semibold text-gray-900">{loan.emi}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {t('progress')}
                      </span>
                      <span className="font-medium text-gray-900">{loan.progress}%</span>
                    </div>
                    <Progress value={loan.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {t('nextPayment')} {loan.dueDate}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={() => handlePayNow(loan)}
                    >
                      {t('payNow')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Lending Actions */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            className="h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg flex flex-col items-center justify-center space-y-1"
            onClick={() => onNavigate('lendMoney')}
          >
            <PiggyBank className="h-5 w-5" />
            <span className="text-sm font-medium">{t('lendMoney')}</span>
          </Button>
          
          <Button 
            className="h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg flex flex-col items-center justify-center space-y-1"
            onClick={() => onNavigate('borrowMoney')}
          >
            <CreditCard className="h-5 w-5" />
            <span className="text-sm font-medium">{t('borrowMoney')}</span>
          </Button>
        </div>
        
        {/* Legal & Educational Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            className="h-14 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg flex flex-col items-center justify-center space-y-1"
            onClick={() => onNavigate('legalTerms')}
          >
            <Book className="h-5 w-5" />
            <span className="text-sm font-medium">
              {currentLanguage === 'te' ? 'చట్టపరమైన నిబంధనలు' : 'Learn Legal Terms'}
            </span>
          </Button>
          
          <Button 
            className="h-14 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg flex flex-col items-center justify-center space-y-1"
            onClick={() => onNavigate('chatbot')}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">
              {currentLanguage === 'te' ? 'చాట్‌బాట్' : 'Chatbot'}
            </span>
          </Button>
        </div>
      </div>

      {/* Financial Insights */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                {t('financialInsight')}
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                {currentLanguage === 'te' 
                  ? 'మీరు ఈ నెలలో ₹2,500 అదనంగా చెల్లిస్తే, 8 నెలలు ముందుగానే లోన్ మూసేయవచ్చు.'
                  : 'By paying ₹2,500 extra this month, you can close your loan 8 months early.'
                }
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                {t('learnMore')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
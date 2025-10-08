import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Clock, Settings, Trash2, Plus, BellRing, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useLanguage } from './LanguageProvider';
import { toast } from 'sonner@2.0.3';
import { dataStore, NotificationData, LoanData } from '../utils/dataStore';

interface PaymentAlert {
  id: string;
  loanId: string;
  lenderName: string;
  dueDate: string;
  amount: number;
  reminderDays: number;
  isActive: boolean;
  alertShown: boolean;
}

interface Loan {
  id: string;
  lenderName: string;
  nextPaymentDate: string;
  monthlyPayment: number;
}

export function AlertManager() {
  const { currentLanguage } = useLanguage();
  const [alerts, setAlerts] = useState<PaymentAlert[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isAddingAlert, setIsAddingAlert] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const [formData, setFormData] = useState({
    loanId: '',
    reminderDays: '3'
  });

  useEffect(() => {
    loadAlerts();
    loadLoans();
    checkNotificationPermission();
    checkUpcomingPayments();
  }, []);

  const loadAlerts = () => {
    const savedAlerts = localStorage.getItem('loan-tracker-alerts');
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  };

  const loadLoans = async () => {
    try {
      const loansData = await dataStore.getLoans();
      const transformedLoans = loansData.map(loan => ({
        id: loan.id,
        lenderName: loan.type === 'lend' ? loan.receiverName : loan.lenderName || 'Unknown Lender',
        nextPaymentDate: loan.repaymentDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyPayment: Math.round(loan.remainingBalance / 12) || 1000
      }));
      setLoans(transformedLoans);
      
      // Add some sample loans if none exist
      if (transformedLoans.length === 0) {
        const sampleLoans = [
          {
            id: 'sample-1',
            lenderName: 'SBI Bank',
            nextPaymentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            monthlyPayment: 12500
          },
          {
            id: 'sample-2',
            lenderName: 'HDFC Bank',
            nextPaymentDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            monthlyPayment: 8500
          },
          {
            id: 'sample-3',
            lenderName: 'రాజేష్ గారు',
            nextPaymentDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            monthlyPayment: 5000
          }
        ];
        setLoans(sampleLoans);
      }
    } catch (error) {
      console.error('Error loading loans:', error);
    }
  };

  const saveAlerts = (updatedAlerts: PaymentAlert[]) => {
    localStorage.setItem('loan-tracker-alerts', JSON.stringify(updatedAlerts));
    setAlerts(updatedAlerts);
  };

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        toast.success(currentLanguage === 'te' ? 'నోటిఫికేషన్లు ఎనేబుల్ చేయబడ్డాయి' : 'Notifications enabled');
      } else {
        toast.error(currentLanguage === 'te' ? 'నోటిఫికేషన్ అనుమతి తిరస్కరించబడింది' : 'Notification permission denied');
      }
    }
  };

  const checkUpcomingPayments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    alerts.forEach(alert => {
      if (!alert.isActive || alert.alertShown) return;

      const dueDate = new Date(alert.dueDate);
      const reminderDate = new Date(dueDate);
      reminderDate.setDate(dueDate.getDate() - alert.reminderDays);

      if (today >= reminderDate && today <= dueDate) {
        showPaymentReminder(alert);
        // Mark alert as shown
        const updatedAlerts = alerts.map(a => 
          a.id === alert.id ? { ...a, alertShown: true } : a
        );
        saveAlerts(updatedAlerts);
      }
    });
  };

  const showPaymentReminder = (alert: PaymentAlert) => {
    const message = currentLanguage === 'te' 
      ? `${alert.lenderName} లోన్ చెల్లింపు రేపు దాటింది! ₹${alert.amount.toLocaleString('en-IN')}`
      : `Payment reminder: ${alert.lenderName} loan payment due! ₹${alert.amount.toLocaleString('en-IN')}`;

    // Show browser notification
    if (notificationsEnabled && 'Notification' in window) {
      new Notification(currentLanguage === 'te' ? 'లోన్ చెల్లింపు రిమైండర్' : 'Loan Payment Reminder', {
        body: message,
        icon: '/icon-192x192.png'
      });
    }

    // Show toast notification
    toast.error(message, {
      duration: 10000,
      action: {
        label: currentLanguage === 'te' ? 'చూడు' : 'View',
        onClick: () => console.log('View payment details')
      }
    });
  };

  const addAlert = () => {
    const { loanId, reminderDays } = formData;

    if (!loanId) {
      toast.error(currentLanguage === 'te' ? 'దయచేసి లోన్‌ను ఎంచుకోండి' : 'Please select a loan');
      return;
    }

    const selectedLoan = loans.find(loan => loan.id === loanId);
    if (!selectedLoan) {
      toast.error(currentLanguage === 'te' ? 'దయచేసి సరైన లోన్‌ను ఎంచుకోండి' : 'Please select a valid loan');
      return;
    }

    // Check if alert already exists for this loan
    const existingAlert = alerts.find(alert => alert.loanId === loanId);
    if (existingAlert) {
      toast.error(currentLanguage === 'te' ? 'ఈ లోన్ కోసం అలర్ట్ ఇప్పటికే ఉంది' : 'Alert already exists for this loan');
      return;
    }

    const newAlert: PaymentAlert = {
      id: Date.now().toString(),
      loanId,
      lenderName: selectedLoan.lenderName,
      dueDate: selectedLoan.nextPaymentDate,
      amount: selectedLoan.monthlyPayment,
      reminderDays: parseInt(reminderDays),
      isActive: true,
      alertShown: false
    };

    const updatedAlerts = [...alerts, newAlert];
    saveAlerts(updatedAlerts);
    resetForm();
    toast.success(currentLanguage === 'te' ? 'అలర్ట్ జోడించబడింది' : 'Alert added successfully');
  };

  const toggleAlert = (id: string) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    );
    saveAlerts(updatedAlerts);
    toast.success(currentLanguage === 'te' ? 'అలర్ట్ అప్‌డేట్ చేయబడింది' : 'Alert updated');
  };

  const deleteAlert = (id: string) => {
    if (confirm(currentLanguage === 'te' ? 'మీరు ఖచ్చితంగా ఈ అలర్ట్‌ను తొలగించాలనుకుంటున్నారా?' : 'Are you sure you want to delete this alert?')) {
      const updatedAlerts = alerts.filter(alert => alert.id !== id);
      saveAlerts(updatedAlerts);
      toast.success(currentLanguage === 'te' ? 'అలర్ట్ తొలగించబడింది' : 'Alert deleted');
    }
  };

  const resetForm = () => {
    setFormData({
      loanId: '',
      reminderDays: '3'
    });
    setIsAddingAlert(false);
  };

  const getStatusColor = (alert: PaymentAlert) => {
    const today = new Date();
    const dueDate = new Date(alert.dueDate);
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(dueDate.getDate() - alert.reminderDays);

    if (today > dueDate) return 'bg-red-100 text-red-800';
    if (today >= reminderDate) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (alert: PaymentAlert) => {
    const today = new Date();
    const dueDate = new Date(alert.dueDate);
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(dueDate.getDate() - alert.reminderDays);

    if (today > dueDate) {
      return currentLanguage === 'te' ? 'గడువు దాటింది' : 'Overdue';
    }
    if (today >= reminderDate) {
      return currentLanguage === 'te' ? 'రిమైండర్ యాక్టివ్' : 'Reminder Active';
    }
    return currentLanguage === 'te' ? 'షెడ్యూల్డ్' : 'Scheduled';
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeAlerts = alerts.filter(alert => alert.isActive);
  const upcomingAlerts = activeAlerts.filter(alert => {
    const daysUntil = getDaysUntilDue(alert.dueDate);
    return daysUntil >= 0 && daysUntil <= alert.reminderDays;
  });

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {currentLanguage === 'te' ? 'చెల్లింపు అలర్ట్స్' : 'Payment Alerts'}
          </h2>
          <p className="text-sm text-gray-600">
            {currentLanguage === 'te' ? 'మీ లోన్ చెల్లింపుల కోసం రిమైండర్లు సెట్ చేయండి' : 'Set reminders for your loan payments'}
          </p>
        </div>
        
        <Dialog open={isAddingAlert} onOpenChange={setIsAddingAlert}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddingAlert(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {currentLanguage === 'te' ? 'అలర్ట్ జోడించు' : 'Add Alert'}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {currentLanguage === 'te' ? 'కొత్త అలర్ట్ జోడించండి' : 'Add New Alert'}
              </DialogTitle>
              <DialogDescription>
                {currentLanguage === 'te' ? 'చెల్లింపు రిమైండర్ సెట్ చేయండి' : 'Set up a payment reminder'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>{currentLanguage === 'te' ? 'లోన్ ఎంచుకోండి' : 'Select Loan'}</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.loanId}
                  onChange={(e) => setFormData({...formData, loanId: e.target.value})}
                >
                  <option value="">{currentLanguage === 'te' ? 'లోన్ ఎంచుకోండి' : 'Select a loan'}</option>
                  {loans.map(loan => (
                    <option key={loan.id} value={loan.id}>
                      {loan.lenderName} - {new Date(loan.nextPaymentDate).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label>{currentLanguage === 'te' ? 'రిమైండర్ దినాలు (ముందుగా)' : 'Reminder Days (in advance)'}</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.reminderDays}
                  onChange={(e) => setFormData({...formData, reminderDays: e.target.value})}
                >
                  <option value="1">{currentLanguage === 'te' ? '1 రోజు ముందు' : '1 day before'}</option>
                  <option value="3">{currentLanguage === 'te' ? '3 రోజులు ముందు' : '3 days before'}</option>
                  <option value="7">{currentLanguage === 'te' ? '1 వారం ముందు' : '1 week before'}</option>
                  <option value="15">{currentLanguage === 'te' ? '15 రోజులు ముందు' : '15 days before'}</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={addAlert} className="flex-1">
                  {currentLanguage === 'te' ? 'జోడించు' : 'Add Alert'}
                </Button>
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  {currentLanguage === 'te' ? 'రద్దు' : 'Cancel'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {currentLanguage === 'te' ? 'నోటిఫికేషన్ సెట్టింగ్స్' : 'Notification Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">
                {currentLanguage === 'te' ? 'బ్రౌజర్ నోటిఫికేషన్లు' : 'Browser Notifications'}
              </div>
              <div className="text-sm text-gray-600">
                {currentLanguage === 'te' ? 'చెల్లింపు రిమైండర్లను పుష్ నోటిఫికేషన్‌గా పొందండి' : 'Receive payment reminders as push notifications'}
              </div>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={requestNotificationPermission}
            />
          </div>
          
          {!notificationsEnabled && (
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                {currentLanguage === 'te' 
                  ? 'రిమైండర్లను మిస్ కాకుండా ఉండాలంటే దయచేసి నోటిఫికేషన్లను ఎనేబుల్ చేయండి'
                  : 'Please enable notifications to receive timely payment reminders'
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Alerts Summary */}
      {upcomingAlerts.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <Clock className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>{currentLanguage === 'te' ? 'రాబోయే చెల్లింపులు:' : 'Upcoming Payments:'}</strong> 
            {' '}{upcomingAlerts.length} {currentLanguage === 'te' ? 'చెల్లింపులు రాబోయే వారంలో' : 'payments due soon'}
          </AlertDescription>
        </Alert>
      )}

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {currentLanguage === 'te' ? 'ఇంకా అలర్ట్స్ లేవు' : 'No Alerts Set'}
            </h3>
            <p className="text-gray-500 mb-4">
              {currentLanguage === 'te' ? 'మీ మొదటి చెల్లింపు రిమైండర్‌ను సెట్ చేయండి' : 'Set up your first payment reminder'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const daysUntil = getDaysUntilDue(alert.dueDate);
            
            return (
              <Card key={alert.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{alert.lenderName}</h3>
                      <p className="text-sm text-gray-600">
                        {currentLanguage === 'te' ? 'గడువు:' : 'Due:'} {new Date(alert.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(alert)}>
                        {getStatusText(alert)}
                      </Badge>
                      <Switch
                        checked={alert.isActive}
                        onCheckedChange={() => toggleAlert(alert.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {currentLanguage === 'te' ? 'చెల్లింపు మొత్తం:' : 'Payment Amount:'}
                      </span>
                      <span className="font-semibold">₹{alert.amount.toLocaleString('en-IN')}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {currentLanguage === 'te' ? 'రిమైండర్:' : 'Reminder:'}
                      </span>
                      <span>{alert.reminderDays} {currentLanguage === 'te' ? 'రోజులు ముందు' : 'days before'}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {currentLanguage === 'te' ? 'స్థితి:' : 'Status:'}
                      </span>
                      <span className={daysUntil < 0 ? 'text-red-600 font-semibold' : daysUntil <= alert.reminderDays ? 'text-orange-600 font-semibold' : 'text-green-600'}>
                        {daysUntil < 0 
                          ? `${Math.abs(daysUntil)} ${currentLanguage === 'te' ? 'రోజులు ఆలస్యం' : 'days overdue'}`
                          : daysUntil === 0 
                          ? (currentLanguage === 'te' ? 'ఈరోజు గడువు' : 'Due today')
                          : `${daysUntil} ${currentLanguage === 'te' ? 'రోజులు మిగిలాయి' : 'days remaining'}`
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
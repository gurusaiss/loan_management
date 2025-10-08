import React, { useState, useEffect } from 'react';
import { Calendar, IndianRupee, CheckCircle, Clock, Plus, Filter, Download, History as HistoryIcon, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageProvider';
import { toast } from 'sonner@2.0.3';
import { dataStore, LoanData, PaymentRecord } from '../utils/dataStore';
import { PDFGenerator } from '../utils/pdfGenerator';

interface Payment {
  id: string;
  loanId: string;
  lenderName: string;
  amount: number;
  date: string;
  type: 'principal' | 'interest' | 'both';
  status: 'completed' | 'pending' | 'overdue';
  notes?: string;
}

interface Loan {
  id: string;
  lenderName: string;
  principal: number;
  remainingBalance: number;
}

export function PaymentHistory() {
  const { currentLanguage } = useLanguage();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loans, setLoans] = useState<LoanData[]>([]);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [filterLender, setFilterLender] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const [formData, setFormData] = useState({
    loanId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'both' as 'principal' | 'interest' | 'both',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const loansData = await dataStore.getLoans();
      setLoans(loansData);
      
      // Extract payments from all loans
      const allPayments: Payment[] = [];
      loansData.forEach(loan => {
        if (loan.payments) {
          loan.payments.forEach(payment => {
            allPayments.push({
              id: payment.id,
              loanId: payment.loanId,
              lenderName: loan.lenderName || loan.receiverName,
              amount: payment.amount,
              date: payment.date,
              type: 'both' as 'principal' | 'interest' | 'both',
              status: 'completed' as 'completed' | 'pending' | 'overdue',
              notes: payment.notes
            });
          });
        }
      });

      // Add sample payment history for Rajesh Farm Loan (due date 10th of every month)
      const farmLoanPayments: Payment[] = [
        {
          id: 'farm-payment-1',
          loanId: 'farm-loan-1',
          lenderName: currentLanguage === 'te' ? 'రాజేష్' : 'Rajesh',
          amount: 2083,
          date: '2024-10-10',
          type: 'both',
          status: 'completed',
          notes: currentLanguage === 'te' ? 'నెలవారీ చెల్లింపు - అక్టోబర్' : 'Monthly payment - October'
        },
        {
          id: 'farm-payment-2',
          loanId: 'farm-loan-1',
          lenderName: currentLanguage === 'te' ? 'రాజేష్' : 'Rajesh',
          amount: 2083,
          date: '2024-09-10',
          type: 'both',
          status: 'completed',
          notes: currentLanguage === 'te' ? 'నెలవారీ చెల్లింపు - సెప్టెంబర్' : 'Monthly payment - September'
        },
        {
          id: 'farm-payment-3',
          loanId: 'farm-loan-1',
          lenderName: currentLanguage === 'te' ? 'రాజేష్' : 'Rajesh',
          amount: 2083,
          date: '2024-08-10',
          type: 'both',
          status: 'completed',
          notes: currentLanguage === 'te' ? 'నెలవారీ చెల్లింపు - ఆగస్టు' : 'Monthly payment - August'
        },
        {
          id: 'farm-payment-upcoming',
          loanId: 'farm-loan-1',
          lenderName: currentLanguage === 'te' ? 'రాజేష్' : 'Rajesh',
          amount: 2083,
          date: '2024-11-10',
          type: 'both',
          status: 'pending',
          notes: currentLanguage === 'te' ? 'నెలవారీ చెల్లింపు - నవంబర్ (రాబోయే)' : 'Monthly payment - November (upcoming)'
        }
      ];

      setPayments([...allPayments, ...farmLoanPayments]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const savePayments = (updatedPayments: Payment[]) => {
    localStorage.setItem('loan-tracker-payments', JSON.stringify(updatedPayments));
    setPayments(updatedPayments);
  };

  const handleSubmit = async () => {
    const { loanId, amount, date, type, notes } = formData;

    if (!loanId || !amount || !date) {
      toast.error(currentLanguage === 'te' ? 'దయచేసి అవసరమైన వివరాలను నమోదు చేయండి' : 'Please fill in required details');
      return;
    }

    try {
      const newPayment: PaymentRecord = {
        id: dataStore.generateId(),
        loanId,
        amount: parseFloat(amount),
        date,
        method: 'manual',
        notes
      };

      await dataStore.savePayment(newPayment);
      await loadData(); // Reload data
      
      resetForm();
      toast.success(currentLanguage === 'te' ? 'చెల్లింపు రికార్డ్ చేయబడింది' : 'Payment recorded successfully');
    } catch (error) {
      toast.error(currentLanguage === 'te' ? 'లోపం సంభవించింది' : 'An error occurred');
    }
  };

  const downloadHistoryReport = async () => {
    setIsDownloading(true);
    try {
      const reportData = {
        loans,
        payments,
        totalPaid,
        thisMonthTotal,
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `loan_history_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success(currentLanguage === 'te' ? 'రిపోర్ట్ డౌన్‌లోడ్ అయింది' : 'Report downloaded successfully');
    } catch (error) {
      toast.error(currentLanguage === 'te' ? 'డౌన్‌లోడ్ లోపం' : 'Download error');
    } finally {
      setIsDownloading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      loanId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      type: 'both',
      notes: ''
    });
    setIsAddingPayment(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'principal': return 'bg-blue-100 text-blue-800';
      case 'interest': return 'bg-orange-100 text-orange-800';
      case 'both': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const lenderMatch = !filterLender || payment.lenderName.toLowerCase().includes(filterLender.toLowerCase());
    const statusMatch = !filterStatus || payment.status === filterStatus;
    return lenderMatch && statusMatch;
  });

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const thisMonthPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.date);
    const now = new Date();
    return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <HistoryIcon className="h-5 w-5 mr-2" />
            {currentLanguage === 'te' ? 'చరిత్ర' : 'History'}
          </h2>
          <p className="text-sm text-gray-600">
            {currentLanguage === 'te' ? 'మీ చెల్లింపులు మరియు రుణ వివరాలు' : 'Your payments and loan details'}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={downloadHistoryReport}
            disabled={isDownloading}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? 
              (currentLanguage === 'te' ? 'డౌన్‌లోడ్...' : 'Downloading...') :
              (currentLanguage === 'te' ? 'రిపోర్ట్ డౌన్‌లోడ్' : 'Download Report')
            }
          </Button>
          
          <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddingPayment(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {currentLanguage === 'te' ? 'చెల్లింపు జోడించు' : 'Add Payment'}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {currentLanguage === 'te' ? 'కొత్త చెల్లింపు రికార్డ్ చేయండి' : 'Record New Payment'}
              </DialogTitle>
              <DialogDescription>
                {currentLanguage === 'te' ? 'చెల్లించిన మొత్తం మరియు వివరాలను నమోదు చేయండి' : 'Enter the payment amount and details'}
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
                      {loan.type === 'lend' ? loan.receiverName : loan.lenderName} - ₹{loan.remainingBalance.toLocaleString('en-IN')} {currentLanguage === 'te' ? 'మిగిలింది' : 'remaining'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label>{currentLanguage === 'te' ? 'చెల్లింపు మొత్తం (₹)' : 'Payment Amount (₹)'}</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder={currentLanguage === 'te' ? 'ఉదా: 5000' : 'e.g. 5000'}
                />
              </div>
              
              <div>
                <Label>{currentLanguage === 'te' ? 'చెల్లింపు తేదీ' : 'Payment Date'}</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              
              <div>
                <Label>{currentLanguage === 'te' ? 'చెల్లింపు రకం' : 'Payment Type'}</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="both">{currentLanguage === 'te' ? 'మూలధనం + వడ్డీ' : 'Principal + Interest'}</option>
                  <option value="principal">{currentLanguage === 'te' ? 'మూలధనం మాత్రమే' : 'Principal Only'}</option>
                  <option value="interest">{currentLanguage === 'te' ? 'వడ్డీ మాత్రమే' : 'Interest Only'}</option>
                </select>
              </div>
              
              <div>
                <Label>{currentLanguage === 'te' ? 'గమనికలు (ఐచ్ఛిక)' : 'Notes (Optional)'}</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder={currentLanguage === 'te' ? 'అదనపు వివరాలు' : 'Additional details'}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                  {currentLanguage === 'te' ? 'రికార్డ్ చేయండి' : 'Record Payment'}
                </Button>
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  {currentLanguage === 'te' ? 'రద్దు' : 'Cancel'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ₹{totalPaid.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-gray-600">
                {currentLanguage === 'te' ? 'మొత్తం చెల్లించిన మొత్తం' : 'Total Paid'}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ₹{thisMonthTotal.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-gray-600">
                {currentLanguage === 'te' ? 'ఈ నెల చెల్లింపులు' : 'This Month'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {currentLanguage === 'te' ? 'ఫిల్టర్లు' : 'Filters'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{currentLanguage === 'te' ? 'రుణదాత పేరు' : 'Lender Name'}</Label>
              <Input
                value={filterLender}
                onChange={(e) => setFilterLender(e.target.value)}
                placeholder={currentLanguage === 'te' ? 'వెతకండి...' : 'Search...'}
              />
            </div>
            <div>
              <Label>{currentLanguage === 'te' ? 'స్థితి' : 'Status'}</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">{currentLanguage === 'te' ? 'అన్నీ' : 'All'}</option>
                <option value="completed">{currentLanguage === 'te' ? 'పూర్తయింది' : 'Completed'}</option>
                <option value="pending">{currentLanguage === 'te' ? 'పెండింగ్' : 'Pending'}</option>
                <option value="overdue">{currentLanguage === 'te' ? 'ఆలస్యం' : 'Overdue'}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment List */}
      {filteredPayments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <IndianRupee className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {currentLanguage === 'te' ? 'ఇంకా చెల్లింపులు లేవు' : 'No Payments Yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {currentLanguage === 'te' ? 'మీ మొదటి చెల్లింపును రికార్డ్ చేయడానికి మేలు బటన్‌ను నొక్కండి' : 'Click the Add button to record your first payment'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{payment.lenderName}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(payment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      ₹{payment.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(payment.status)}>
                        {currentLanguage === 'te' 
                          ? (payment.status === 'completed' ? 'పూర్తయింది' : payment.status === 'pending' ? 'పెండింగ్' : 'ఆలస్యం')
                          : payment.status.charAt(0).toUpperCase() + payment.status.slice(1)
                        }
                      </Badge>
                      <Badge className={getTypeColor(payment.type)}>
                        {currentLanguage === 'te' 
                          ? (payment.type === 'principal' ? 'మూలధనం' : payment.type === 'interest' ? 'వడ్డీ' : 'రెండూ')
                          : payment.type === 'both' ? 'EMI' : payment.type.charAt(0).toUpperCase() + payment.type.slice(1)
                        }
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {payment.notes && (
                  <div className="bg-gray-50 p-2 rounded text-sm">
                    <strong>{currentLanguage === 'te' ? 'గమనిక:' : 'Note:'}</strong> {payment.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
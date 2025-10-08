import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, IndianRupee, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageProvider';
import { toast } from 'sonner@2.0.3';

interface Loan {
  id: string;
  lenderName: string;
  principal: number;
  interestRate: number;
  duration: number;
  startDate: string;
  nextPaymentDate: string;
  monthlyPayment: number;
  remainingBalance: number;
  totalInterestPaid: number;
  status: 'active' | 'completed' | 'defaulted';
  type: 'simple' | 'compound';
}

export function LoanTracker() {
  const { currentLanguage } = useLanguage();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isAddingLoan, setIsAddingLoan] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);

  const [formData, setFormData] = useState({
    lenderName: '',
    principal: '',
    interestRate: '',
    duration: '',
    startDate: '',
    type: 'simple' as 'simple' | 'compound'
  });

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = () => {
    const savedLoans = localStorage.getItem('loan-tracker-loans');
    if (savedLoans) {
      setLoans(JSON.parse(savedLoans));
    }
  };

  const saveLoans = (updatedLoans: Loan[]) => {
    localStorage.setItem('loan-tracker-loans', JSON.stringify(updatedLoans));
    setLoans(updatedLoans);
  };

  const calculateLoanDetails = (
    principal: number,
    rate: number,
    duration: number,
    type: 'simple' | 'compound'
  ) => {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = duration * 12;

    let monthlyPayment: number;
    let totalAmount: number;

    if (type === 'simple') {
      const totalInterest = principal * (rate / 100) * duration;
      totalAmount = principal + totalInterest;
      monthlyPayment = totalAmount / numberOfPayments;
    } else {
      // Compound interest - EMI calculation
      if (monthlyRate === 0) {
        monthlyPayment = principal / numberOfPayments;
      } else {
        monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                         (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      }
      totalAmount = monthlyPayment * numberOfPayments;
    }

    return {
      monthlyPayment,
      totalAmount,
      totalInterest: totalAmount - principal
    };
  };

  const handleSubmit = () => {
    const { lenderName, principal, interestRate, duration, startDate, type } = formData;

    if (!lenderName || !principal || !interestRate || !duration || !startDate) {
      toast.error(currentLanguage === 'te' ? 'దయచేసి అన్ని వివరాలను నమోదు చేయండి' : 'Please fill in all details');
      return;
    }

    const principalAmount = parseFloat(principal);
    const rate = parseFloat(interestRate);
    const durationYears = parseFloat(duration);

    const { monthlyPayment, totalAmount } = calculateLoanDetails(principalAmount, rate, durationYears, type);

    const newLoan: Loan = {
      id: editingLoan?.id || Date.now().toString(),
      lenderName,
      principal: principalAmount,
      interestRate: rate,
      duration: durationYears,
      startDate,
      nextPaymentDate: calculateNextPaymentDate(startDate),
      monthlyPayment,
      remainingBalance: principalAmount,
      totalInterestPaid: 0,
      status: 'active',
      type
    };

    let updatedLoans: Loan[];
    if (editingLoan) {
      updatedLoans = loans.map(loan => loan.id === editingLoan.id ? newLoan : loan);
    } else {
      updatedLoans = [...loans, newLoan];
    }

    saveLoans(updatedLoans);
    resetForm();
    toast.success(currentLanguage === 'te' ? 'లోన్ విజయవంతంగా సేవ్ చేయబడింది' : 'Loan saved successfully');
  };

  const calculateNextPaymentDate = (startDate: string): string => {
    const start = new Date(startDate);
    const nextMonth = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate());
    return nextMonth.toISOString().split('T')[0];
  };

  const resetForm = () => {
    setFormData({
      lenderName: '',
      principal: '',
      interestRate: '',
      duration: '',
      startDate: '',
      type: 'simple'
    });
    setIsAddingLoan(false);
    setEditingLoan(null);
  };

  const deleteLoan = (id: string) => {
    if (confirm(currentLanguage === 'te' ? 'మీరు ఖచ్చితంగా ఈ లోన్‌ను తొలగించాలనుకుంటున్నారా?' : 'Are you sure you want to delete this loan?')) {
      const updatedLoans = loans.filter(loan => loan.id !== id);
      saveLoans(updatedLoans);
      toast.success(currentLanguage === 'te' ? 'లోన్ తొలగించబడింది' : 'Loan deleted');
    }
  };

  const editLoan = (loan: Loan) => {
    setFormData({
      lenderName: loan.lenderName,
      principal: loan.principal.toString(),
      interestRate: loan.interestRate.toString(),
      duration: loan.duration.toString(),
      startDate: loan.startDate,
      type: loan.type
    });
    setEditingLoan(loan);
    setIsAddingLoan(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'defaulted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {currentLanguage === 'te' ? 'లోన్ ట్రాకర్' : 'Loan Tracker'}
          </h2>
          <p className="text-sm text-gray-600">
            {currentLanguage === 'te' ? 'మీ రుణాలను నిర్వహించండి' : 'Manage your loans'}
          </p>
        </div>
        
        <Dialog open={isAddingLoan} onOpenChange={setIsAddingLoan}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddingLoan(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {currentLanguage === 'te' ? 'జోడించు' : 'Add Loan'}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingLoan 
                  ? (currentLanguage === 'te' ? 'లోన్ ఎడిట్ చేయండి' : 'Edit Loan')
                  : (currentLanguage === 'te' ? 'కొత్త లోన్ జోడించండి' : 'Add New Loan')
                }
              </DialogTitle>
              <DialogDescription>
                {editingLoan 
                  ? (currentLanguage === 'te' ? 'లోన్ వివరాలను అప్‌డేట్ చేయండి' : 'Update the loan details')
                  : (currentLanguage === 'te' ? 'కొత్త లోన్ వివరాలను నమోదు చేయండి' : 'Enter new loan details')
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>{currentLanguage === 'te' ? 'రుణదాత పేరు' : 'Lender Name'}</Label>
                <Input
                  value={formData.lenderName}
                  onChange={(e) => setFormData({...formData, lenderName: e.target.value})}
                  placeholder={currentLanguage === 'te' ? 'ఉదా: స్టేట్ బ్యాంక్' : 'e.g. State Bank'}
                />
              </div>
              
              <div>
                <Label>{currentLanguage === 'te' ? 'మూలధనం (₹)' : 'Principal Amount (₹)'}</Label>
                <Input
                  type="number"
                  value={formData.principal}
                  onChange={(e) => setFormData({...formData, principal: e.target.value})}
                  placeholder={currentLanguage === 'te' ? 'ఉదా: 100000' : 'e.g. 100000'}
                />
              </div>
              
              <div>
                <Label>{currentLanguage === 'te' ? 'వడ్డీ రేట్ (%)' : 'Interest Rate (%)'}</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
                  placeholder={currentLanguage === 'te' ? 'ఉదా: 12' : 'e.g. 12'}
                />
              </div>
              
              <div>
                <Label>{currentLanguage === 'te' ? 'వ్యవధి (సంవత్సరాలు)' : 'Duration (Years)'}</Label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder={currentLanguage === 'te' ? 'ఉదా: 2' : 'e.g. 2'}
                />
              </div>
              
              <div>
                <Label>{currentLanguage === 'te' ? 'ప్రారంభ తేదీ' : 'Start Date'}</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              
              <div>
                <Label>{currentLanguage === 'te' ? 'వడ్డీ రకం' : 'Interest Type'}</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'simple' | 'compound'})}
                >
                  <option value="simple">{currentLanguage === 'te' ? 'సాధారణ వడ్డీ' : 'Simple Interest'}</option>
                  <option value="compound">{currentLanguage === 'te' ? 'చక్రవడ్డీ' : 'Compound Interest'}</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                  {editingLoan 
                    ? (currentLanguage === 'te' ? 'అప్‌డేట్' : 'Update')
                    : (currentLanguage === 'te' ? 'జోడించు' : 'Add')
                  }
                </Button>
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  {currentLanguage === 'te' ? 'రద్దు' : 'Cancel'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loans.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <IndianRupee className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {currentLanguage === 'te' ? 'ఇంకా లోన్లు లేవు' : 'No Loans Yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {currentLanguage === 'te' ? 'మీ మొదటి లోన్‌ను జోడించడానికి మేలు బటన్‌ను నొక్కండి' : 'Click the Add button to track your first loan'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <Card key={loan.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{loan.lenderName}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(loan.status)}>
                      {currentLanguage === 'te' 
                        ? (loan.status === 'active' ? 'యాక్టివ్' : loan.status === 'completed' ? 'పూర్తి' : 'డిఫాల్ట్')
                        : loan.status.charAt(0).toUpperCase() + loan.status.slice(1)
                      }
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => editLoan(loan)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteLoan(loan.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">{currentLanguage === 'te' ? 'మూలధనం' : 'Principal'}</div>
                    <div className="font-semibold">₹{loan.principal.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">{currentLanguage === 'te' ? 'వడ్డీ రేట్' : 'Interest Rate'}</div>
                    <div className="font-semibold">{loan.interestRate}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">{currentLanguage === 'te' ? 'మాసిక చెల్లింపు' : 'Monthly Payment'}</div>
                    <div className="font-semibold">₹{loan.monthlyPayment.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">{currentLanguage === 'te' ? 'వ్యవధి' : 'Duration'}</div>
                    <div className="font-semibold">{loan.duration} {currentLanguage === 'te' ? 'సంవత్సరాలు' : 'years'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      {currentLanguage === 'te' ? 'తదుపరి చెల్లింపు:' : 'Next Payment:'} {new Date(loan.nextPaymentDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {currentLanguage === 'te' ? 'మిగిలిన బ్యాలెన్స్' : 'Remaining Balance'}
                    </span>
                    <span className="font-semibold text-lg">
                      ₹{loan.remainingBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
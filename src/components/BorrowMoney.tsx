import React, { useState, useRef } from 'react';
import { useLanguage } from './LanguageProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ArrowLeft, Upload, FileText, Download, User, Phone, MapPin, CreditCard, Calendar, Percent, IndianRupee, Globe, CheckCircle, Shield, FileCheck } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { dataStore, LoanData } from '../utils/dataStore';
import { PDFGenerator } from '../utils/pdfGenerator';

interface BorrowMoneyProps {
  onBack: () => void;
}

export function BorrowMoney({ onBack }: BorrowMoneyProps) {
  const { currentLanguage, toggleLanguage, t } = useLanguage();
  const [step, setStep] = useState<'approved' | 'form' | 'contract' | 'complete'>('approved');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contractGenerated, setContractGenerated] = useState(false);
  const [loanData, setLoanData] = useState<Partial<LoanData>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-filled approved loan data
  const approvedLoan = {
    lenderName: currentLanguage === 'te' ? 'రామరాజు' : 'Rama Raju',
    lenderPhone: '+91 98765 43210',
    lenderAddress: '456, Business District, Hyderabad, Telangana - 500032',
    loanType: currentLanguage === 'te' ? 'వ్యాపార లోన్' : 'Business Loan',
    amount: '50,000',
    interestRate: '12',
    repaymentPeriod: '24',
    monthlyEMI: '2,350',
    processingFee: '500',
    terms: currentLanguage === 'te' ? 
      'వ్యాపార అభివృద్ధి కోసం రుణం. నెలవారీ చెల్లింపులు. ముందస్తు చెల్లింపు అనుమతి.' :
      'Loan for business development. Monthly installments. Prepayment allowed.',
    approvalDate: '2024-10-05',
    disbursementDate: '2024-10-10',
    status: 'approved'
  };

  const [formData, setFormData] = useState({
    // Borrower details (user)
    borrowerName: '',
    borrowerPhone: '',
    borrowerAddress: '',
    borrowerIdProofType: '',
    borrowerIdProofFile: null as File | null,
    
    // Lender details
    lenderName: '',
    lenderPhone: '',
    lenderAddress: '',
    
    // Loan details
    amount: '',
    interestRate: '',
    repaymentDate: '',
    terms: ''
  });

  const idProofTypes = [
    'Aadhaar Card',
    'PAN Card',
    'Passport',
    'Driving License'
  ];

  const handleSubmit = async () => {
    // Validate form
    const requiredFields = ['borrowerName', 'borrowerPhone', 'lenderName', 'lenderPhone', 'amount', 'interestRate'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      toast.error(currentLanguage === 'te' ? 'దయచేసి అవసరమైన వివరాలను పూరించండి' : 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newLoan: LoanData = {
        id: dataStore.generateId(),
        type: 'borrow',
        lenderName: formData.lenderName,
        borrowerName: formData.borrowerName,
        amount: parseFloat(formData.amount),
        remainingBalance: parseFloat(formData.amount),
        interestRate: parseFloat(formData.interestRate),
        startDate: new Date().toISOString().split('T')[0],
        endDate: formData.repaymentDate,
        terms: formData.terms,
        status: 'active',
        payments: []
      };
      
      setLoanData(newLoan);
      await dataStore.addLoan(newLoan);
      
      setStep('contract');
      setContractGenerated(true);
      
      toast.success(currentLanguage === 'te' ? 'లోన్ రిక్వెస్ట్ విజయవంతంగా సమర్పించబడింది' : 'Loan request submitted successfully');
    } catch (error) {
      toast.error(currentLanguage === 'te' ? 'లోన్ రిక్వెస్ట్ విఫలమైంది' : 'Failed to submit loan request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateContract = async () => {
    if (!loanData) return;
    
    try {
      const pdfGenerator = new PDFGenerator();
      await pdfGenerator.generateLoanContract(loanData as LoanData);
      toast.success(currentLanguage === 'te' ? 'కాంట్రాక్ట్ డౌన్‌లోడ్ చేయబడింది' : 'Contract downloaded successfully');
    } catch (error) {
      toast.error(currentLanguage === 'te' ? 'కాంట్రాక్ట్ జనరేట్ చేయడంలో లోపం' : 'Error generating contract');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, borrowerIdProofFile: file }));
      toast.success(currentLanguage === 'te' ? 'ఫైల్ అప్‌లోడ్ చేయబడింది' : 'File uploaded successfully');
    }
  };

  const renderApprovedLoan = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">
          {currentLanguage === 'te' ? 'రుణం తీసుకోండి' : 'Borrow Money'}
        </h1>
        <Button variant="ghost" size="sm" onClick={toggleLanguage} className="h-10 w-12 p-0">
          <Globe className="h-4 w-4" />
        </Button>
      </div>

      {/* Approved Loan Status */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-green-800">
                  {currentLanguage === 'te' ? 'లోన్ ఆమోదించబడింది!' : 'Loan Approved!'}
                </CardTitle>
                <p className="text-sm text-green-600">
                  {currentLanguage === 'te' ? 'మీ వ్యాపార లోన్ అప్రూవల్ అయింది' : 'Your business loan has been approved'}
                </p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              {currentLanguage === 'te' ? 'ఆమోదిత' : 'Approved'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Loan Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            {currentLanguage === 'te' ? 'లోన్ వివరాలు' : 'Loan Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">
                {currentLanguage === 'te' ? 'రుణదాత' : 'Lender'}
              </Label>
              <p className="font-semibold">{approvedLoan.lenderName}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">
                {currentLanguage === 'te' ? 'లోన్ రకం' : 'Loan Type'}
              </Label>
              <p className="font-semibold">{approvedLoan.loanType}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">
                {currentLanguage === 'te' ? 'లోన్ మొత్తం' : 'Loan Amount'}
              </Label>
              <p className="font-semibold text-xl text-blue-600">₹{approvedLoan.amount}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">
                {currentLanguage === 'te' ? 'వడ్డీ రేటు' : 'Interest Rate'}
              </Label>
              <p className="font-semibold text-lg">{approvedLoan.interestRate}% {currentLanguage === 'te' ? 'వార్షిక' : 'per annum'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">
                {currentLanguage === 'te' ? 'చెల్లింపు వ్యవధి' : 'Repayment Period'}
              </Label>
              <p className="font-semibold">{approvedLoan.repaymentPeriod} {currentLanguage === 'te' ? 'నెలలు' : 'months'}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">
                {currentLanguage === 'te' ? 'నెలవారీ EMI' : 'Monthly EMI'}
              </Label>
              <p className="font-semibold text-lg text-green-600">₹{approvedLoan.monthlyEMI}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm text-gray-600">
              {currentLanguage === 'te' ? 'రుణ నిబంధనలు' : 'Loan Terms'}
            </Label>
            <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{approvedLoan.terms}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">
                {currentLanguage === 'te' ? 'ఆమోదం తేదీ' : 'Approval Date'}
              </Label>
              <p className="font-semibold">{approvedLoan.approvalDate}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">
                {currentLanguage === 'te' ? 'మొత్తం అందుకోనే తేదీ' : 'Disbursement Date'}
              </Label>
              <p className="font-semibold">{approvedLoan.disbursementDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lender Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            {currentLanguage === 'te' ? 'రుణదాత సంప్రదింపు వివరాలు' : 'Lender Contact Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-gray-500" />
            <div>
              <Label className="text-sm text-gray-600">
                {currentLanguage === 'te' ? 'ఫోన్ నంబర్' : 'Phone Number'}
              </Label>
              <p className="font-semibold">{approvedLoan.lenderPhone}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div>
              <Label className="text-sm text-gray-600">
                {currentLanguage === 'te' ? 'చిరునామా' : 'Address'}
              </Label>
              <p className="font-semibold text-sm">{approvedLoan.lenderAddress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* E-sign Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-800">
                {currentLanguage === 'te' ? 'ఆధార్ E-సైన్ అవసరం' : 'Aadhaar E-Sign Required'}
              </h3>
              <p className="text-sm text-blue-600 mt-2">
                {currentLanguage === 'te' ? 
                  'లోన్ అగ్రీమెంట్‌ను పూర్తి చేయడానికి మీ ఆధార్ E-సైన్ అవసరం' :
                  'Your Aadhaar E-Sign is required to complete the loan agreement'
                }
              </p>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <FileCheck className="h-4 w-4 mr-2" />
                {currentLanguage === 'te' ? 'ఆధార్ E-సైన్ చేయండి' : 'Proceed with Aadhaar E-Sign'}
              </Button>
              
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <Shield className="h-3 w-3" />
                <span>
                  {currentLanguage === 'te' ? 
                    'మీ ఆధార్ వివరాలు సురక్షితంగా మరియు ఎంక్రిప్ట్ చేయబడ్డాయి' :
                    'Your Aadhaar details are secure and encrypted'
                  }
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={() => generateContract()}
          className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
        >
          <Download className="h-4 w-4 mr-2" />
          {currentLanguage === 'te' ? 'లోన్ అగ్రీమెంట్ డౌన్‌లోడ్ చేయండి' : 'Download Loan Agreement'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onBack}
          className="w-full h-12"
        >
          {currentLanguage === 'te' ? 'డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి' : 'Back to Dashboard'}
        </Button>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">
          {currentLanguage === 'te' ? 'రుణం తీసుకోండి' : 'Borrow Money'}
        </h1>
        <Button variant="ghost" size="sm" onClick={toggleLanguage} className="h-10 w-12 p-0">
          <Globe className="h-4 w-4" />
        </Button>
      </div>

      {/* Rest of the original form would go here... */}
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            {currentLanguage === 'te' ? 'नया लोन आवेदन फॉर्म यहाँ होगा' : 'New loan application form would be here'}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderContract = () => (
    <div className="space-y-6">
      {/* Contract content... */}
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Contract generation view</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderComplete = () => (
    <div className="space-y-6">
      {/* Completion view... */}
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Completion view</p>
        </CardContent>
      </Card>
    </div>
  );

  switch (step) {
    case 'approved':
      return renderApprovedLoan();
    case 'form':
      return renderForm();
    case 'contract':
      return renderContract();
    case 'complete':
      return renderComplete();
    default:
      return renderApprovedLoan();
  }
}
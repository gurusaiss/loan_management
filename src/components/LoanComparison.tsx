import React, { useState, useEffect } from 'react';
import { BarChart3, Building2, TrendingUp, TrendingDown, ExternalLink, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useLanguage } from './LanguageProvider';

interface BankOffer {
  id: string;
  bankName: string;
  bankNameTE: string;
  loanType: string;
  loanTypeTE: string;
  interestRate: number;
  processingFee: number;
  maxAmount: number;
  tenure: number;
  monthlyEMI: number;
  totalAmount: number;
  totalInterest: number;
  features: string[];
  featuresTE: string[];
  eligibility: string[];
  eligibilityTE: string[];
  contactNumber: string;
  applyLink: string;
  isRecommended?: boolean;
}

// Pre-defined bank offers for INR 10,000
const bankOffers: BankOffer[] = [
  {
    id: 'sbi-personal',
    bankName: 'State Bank of India',
    bankNameTE: 'స్టేట్ బ్యాంక్ ఆఫ్ ఇండియా',
    loanType: 'Personal Loan',
    loanTypeTE: 'వ్యక్తిగత రుణం',
    interestRate: 10.5,
    processingFee: 295,
    maxAmount: 10000,
    tenure: 1,
    monthlyEMI: 877,
    totalAmount: 10524,
    totalInterest: 229,
    features: ['Quick approval', 'No collateral', 'Online application'],
    featuresTE: ['త్వరిత ఆమోదం', 'తాకట్టు లేదు', 'ఆన్‌లైన్ దరఖాస్తు'],
    eligibility: ['Age 21-65', 'Salary ₹15,000+', 'Employment 2+ years'],
    eligibilityTE: ['వయస్సు 21-65', 'జీతం ₹15,000+', 'ఉద్యోగం 2+ సంవత్సరాలు'],
    contactNumber: '1800-11-2211',
    applyLink: 'https://www.onlinesbi.com',
    isRecommended: true
  },
  {
    id: 'hdfc-personal',
    bankName: 'HDFC Bank',
    bankNameTE: 'HDFC బ్యాంక్',
    loanType: 'Personal Loan',
    loanTypeTE: 'వ్యక్తిగత రుణం',
    interestRate: 11.0,
    processingFee: 299,
    maxAmount: 10000,
    tenure: 1,
    monthlyEMI: 879,
    totalAmount: 10548,
    totalInterest: 249,
    features: ['Instant approval', 'No prepayment charges', 'Flexible tenure'],
    featuresTE: ['తక్షణ ఆమోదం', 'ముందస్తు చెల్లింపు ఛార్జీలు లేవు', 'వృత్తిాంత కాలవధి'],
    eligibility: ['Age 23-65', 'Salary ₹20,000+', 'Good credit score'],
    eligibilityTE: ['వయస్సు 23-65', 'జీతం ₹20,000+', 'మంచి క్రెడిట్ స్కోర్'],
    contactNumber: '1800-202-6161',
    applyLink: 'https://www.hdfcbank.com'
  },
  {
    id: 'icici-personal',
    bankName: 'ICICI Bank',
    bankNameTE: 'ICICI బ్యాంక్',
    loanType: 'Personal Loan',
    loanTypeTE: 'వ్యక్తిగత రుణం',
    interestRate: 10.75,
    processingFee: 199,
    maxAmount: 10000,
    tenure: 1,
    monthlyEMI: 878,
    totalAmount: 10536,
    totalInterest: 337,
    features: ['Digital process', '5-minute approval', 'Instant disbursal'],
    featuresTE: ['డిజిటల్ ప్రక్రియ', '5-నిమిషాల ఆమోదం', 'తక్షణ వేతనం'],
    eligibility: ['Age 23-58', 'Salary ₹17,500+', 'ITR filing'],
    eligibilityTE: ['వయస్సు 23-58', 'జీతం ₹17,500+', 'ITR దాఖలు'],
    contactNumber: '1800-102-4242',
    applyLink: 'https://www.icicibank.com'
  },
  {
    id: 'axis-personal',
    bankName: 'Axis Bank',
    bankNameTE: 'యాక్సిస్ బ్యాంక్',
    loanType: 'Personal Loan',
    loanTypeTE: 'వ్యక్తిగత రుణం',
    interestRate: 11.25,
    processingFee: 250,
    maxAmount: 10000,
    tenure: 1,
    monthlyEMI: 881,
    totalAmount: 10572,
    totalInterest: 322,
    features: ['Quick disbursal', 'Competitive rates', 'Minimal documentation'],
    featuresTE: ['త్వరిత వేతనం', 'పోటీ రేట్లు', 'కనీస పత్రాలు'],
    eligibility: ['Age 21-60', 'Salary ₹15,000+', 'Bank relationship'],
    eligibilityTE: ['వయస్సు 21-60', 'జీతం ₹15,000+', 'బ్యాంక్ సంబంధం'],
    contactNumber: '1800-419-5555',
    applyLink: 'https://www.axisbank.com'
  },
  {
    id: 'kotak-personal',
    bankName: 'Kotak Mahindra Bank',
    bankNameTE: 'కోటక్ మహీంద్రా బ్యాంక్',
    loanType: 'Personal Loan',
    loanTypeTE: 'వ్యక్తిగత రుణం',
    interestRate: 10.99,
    processingFee: 199,
    maxAmount: 10000,
    tenure: 1,
    monthlyEMI: 879,
    totalAmount: 10548,
    totalInterest: 349,
    features: ['Same day approval', 'No guarantor', 'Flexible repayment'],
    featuresTE: ['అదే రోజు ఆమోదం', 'హామీదారు లేదు', 'వృత్తిాంత రీపేమెంట్'],
    eligibility: ['Age 21-65', 'Salary ₹12,000+', 'Stable employment'],
    eligibilityTE: ['వయస్సు 21-65', 'జీతం ₹12,000+', 'స్థిర ఉద్యోగం'],
    contactNumber: '1800-274-0110',
    applyLink: 'https://www.kotak.com'
  },
  {
    id: 'union-personal',
    bankName: 'Union Bank of India',
    bankNameTE: 'యూనియన్ బ్యాంక్ ఆఫ్ ఇండియా',
    loanType: 'Personal Loan',
    loanTypeTE: 'వ్యక్తిగత రుణం',
    interestRate: 10.25,
    processingFee: 354,
    maxAmount: 10000,
    tenure: 1,
    monthlyEMI: 876,
    totalAmount: 10512,
    totalInterest: 158,
    features: ['Government bank', 'Lower interest', 'AP presence'],
    featuresTE: ['ప్రభుత్వ బ్యాంక్', 'తక్కువ వడ్డీ', 'AP ప్రాధాన్యత'],
    eligibility: ['Age 21-60', 'Salary ₹12,000+', 'Local resident'],
    eligibilityTE: ['వయస్సు 21-60', 'జీతం ₹12,000+', 'స్థానిక నివాసి'],
    contactNumber: '1800-222-244',
    applyLink: 'https://www.unionbankofindia.co.in'
  }
];

export function LoanComparison() {
  const { currentLanguage } = useLanguage();
  const [loanAmount, setLoanAmount] = useState(10000);
  const [filteredOffers, setFilteredOffers] = useState<BankOffer[]>(bankOffers);
  const [selectedTenure, setSelectedTenure] = useState(1);

  // Recalculate offers when amount or tenure changes
  useEffect(() => {
    const updatedOffers = bankOffers.map(offer => {
      const principal = loanAmount;
      const monthlyRate = offer.interestRate / 100 / 12;
      const numberOfPayments = selectedTenure * 12;
      
      let monthlyEMI: number;
      if (monthlyRate === 0) {
        monthlyEMI = principal / numberOfPayments;
      } else {
        monthlyEMI = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      }
      
      const totalAmount = (monthlyEMI * numberOfPayments) + offer.processingFee;
      const totalInterest = totalAmount - principal - offer.processingFee;

      return {
        ...offer,
        maxAmount: principal,
        tenure: selectedTenure,
        monthlyEMI: Math.round(monthlyEMI),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest)
      };
    });

    // Sort by total amount (best offers first)
    updatedOffers.sort((a, b) => a.totalAmount - b.totalAmount);
    
    // Mark the best offer as recommended
    updatedOffers.forEach((offer, index) => {
      offer.isRecommended = index === 0;
    });

    setFilteredOffers(updatedOffers);
  }, [loanAmount, selectedTenure]);

  const bestOffer = filteredOffers[0];
  const worstOffer = filteredOffers[filteredOffers.length - 1];

  const handleApply = (offer: BankOffer) => {
    window.open(offer.applyLink, '_blank');
  };

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          {currentLanguage === 'te' ? 'లోన్ ఆఫర్ల పోలిక' : 'Loan Offers Comparison'}
        </h2>
        <p className="text-sm text-gray-600">
          {currentLanguage === 'te' ? 'వివిధ బ్యాంక్‌ల నుండి ఉత్తమ ఆఫర్లను పొందండి' : 'Get the best offers from different banks'}
        </p>
      </div>

      {/* Loan Amount and Tenure Selector */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-base">
            {currentLanguage === 'te' ? 'లోన్ వివరాలు' : 'Loan Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{currentLanguage === 'te' ? 'లోన్ మొత్తం (₹)' : 'Loan Amount (₹)'}</Label>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseInt(e.target.value) || 10000)}
                min="5000"
                max="100000"
                step="1000"
              />
            </div>
            <div>
              <Label>{currentLanguage === 'te' ? 'వ్యవధి (సంవత్సరాలు)' : 'Tenure (Years)'}</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedTenure}
                onChange={(e) => setSelectedTenure(parseInt(e.target.value))}
              >
                <option value={1}>1 {currentLanguage === 'te' ? 'సంవత్సరం' : 'Year'}</option>
                <option value={2}>2 {currentLanguage === 'te' ? 'సంవత్సరాలు' : 'Years'}</option>
                <option value={3}>3 {currentLanguage === 'te' ? 'సంవత్సరాలు' : 'Years'}</option>
                <option value={5}>5 {currentLanguage === 'te' ? 'సంవత్సరాలు' : 'Years'}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Offer Alert */}
      {filteredOffers.length > 0 && (
        <Alert className="border-green-200 bg-green-50">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>{currentLanguage === 'te' ? 'ఉత్తమ ఆఫర్:' : 'Best Offer:'}</strong> {currentLanguage === 'te' ? bestOffer.bankNameTE : bestOffer.bankName} - 
            ₹{bestOffer.monthlyEMI.toLocaleString('en-IN')} {currentLanguage === 'te' ? 'మాసిక EMI' : 'monthly EMI'} 
            ({bestOffer.interestRate}% {currentLanguage === 'te' ? 'వడ్డీ' : 'interest'})
          </AlertDescription>
        </Alert>
      )}

      {/* Offers Grid */}
      <div className="space-y-4">
        {filteredOffers.map((offer, index) => (
          <Card key={offer.id} className={`relative ${
            offer.isRecommended ? 'border-green-300 bg-green-50' : 'border-gray-200'
          } hover:shadow-md transition-shadow`}>
            {offer.isRecommended && (
              <div className="absolute -top-2 left-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                {currentLanguage === 'te' ? '⭐ सिफारिश' : '⭐ Recommended'}
              </div>
            )}
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {currentLanguage === 'te' ? offer.bankNameTE : offer.bankName}
                    </CardTitle>
                    <p className="text-xs text-gray-500">
                      {currentLanguage === 'te' ? offer.loanTypeTE : offer.loanType}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {offer.interestRate}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentLanguage === 'te' ? 'వార్షిక వడ్డీ' : 'p.a.'}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 p-3 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500">
                    {currentLanguage === 'te' ? 'మాసిక EMI' : 'Monthly EMI'}
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    ₹{offer.monthlyEMI.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">
                    {currentLanguage === 'te' ? 'మొత్తం వడ్డీ' : 'Total Interest'}
                  </div>
                  <div className="text-lg font-bold text-orange-600">
                    ₹{offer.totalInterest.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">
                    {currentLanguage === 'te' ? 'ప్రాసెసింగ్ ఫీ' : 'Processing Fee'}
                  </div>
                  <div className="text-lg font-bold text-gray-600">
                    ₹{offer.processingFee.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  {currentLanguage === 'te' ? 'ప్రత్యేకతలు' : 'Features'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {(currentLanguage === 'te' ? offer.featuresTE : offer.features)
                    .slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {currentLanguage === 'te' ? 'మొత్తం చెల్లించవలసిన మొత్తం' : 'Total Amount Payable'}
                  </span>
                  <span className="text-xl font-bold text-red-600">
                    ₹{offer.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-2">
                <Button 
                  onClick={() => handleApply(offer)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {currentLanguage === 'te' ? 'దరఖాస్తు చేసుకోండి' : 'Apply Now'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCall(offer.contactNumber)}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>

              {/* Savings Indicator */}
              {index > 0 && (
                <div className="text-center">
                  <span className="text-xs text-red-600">
                    ₹{(offer.totalAmount - bestOffer.totalAmount).toLocaleString('en-IN')} {' '}
                    {currentLanguage === 'te' ? 'ఎక్కువ ఖర్చు' : 'more expensive than best offer'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Government Schemes CTA */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-green-900">
                {currentLanguage === 'te' ? 'ప్రభుత్వ రుణ పథకాలు' : 'Government Loan Schemes'}
              </h3>
              <p className="text-sm text-green-700">
                {currentLanguage === 'te' 
                  ? 'తక్కువ వడ్డీ రేట్లతో ముద్రా లోన్, PMSVANidhi వంటి పథకాలు అందుబాటులో ఉన్నాయి' 
                  : 'Lower interest schemes like Mudra Loan, PMSVANidhi available'
                }
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-green-700 border-green-300">
              {currentLanguage === 'te' ? 'చూడండి' : 'Explore'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
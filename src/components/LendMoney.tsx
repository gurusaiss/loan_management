import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ArrowLeft, FileSignature, UserCheck, IndianRupee, Calendar, Percent } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LendMoneyProps {
  onBack: () => void;
}

export function LendMoney({ onBack }: LendMoneyProps) {
  const { t, currentLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    receiverMobile: '',
    amount: [50000],
    interestType: '',
    interestRate: [12],
    termYears: [2],
    termMonths: [0]
  });
  const [contractSigned, setContractSigned] = useState(false);

  const handleSubmit = () => {
    if (!formData.receiverMobile || !formData.interestType || !contractSigned) {
      toast.error(currentLanguage === 'te' ? 'దయచేసి అన్ని ఫీల్డ్‌లను పూర్తి చేయండి' : 'Please fill all required fields');
      return;
    }

    toast.success(currentLanguage === 'te' ? 'రుణ ఒప్పందం విజయవంతంగా సృష్టించబడింది' : 'Lending contract created successfully');
    onBack();
  };

  const totalInterest = formData.interestType === 'simple' 
    ? (formData.amount[0] * formData.interestRate[0] * (formData.termYears[0] + formData.termMonths[0] / 12)) / 100
    : formData.amount[0] * (Math.pow(1 + formData.interestRate[0] / 100, formData.termYears[0] + formData.termMonths[0] / 12) - 1);

  const totalAmount = formData.amount[0] + totalInterest;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('lendMoney')}</h2>
          <p className="text-sm text-gray-600">{t('lendingDetails')}</p>
        </div>
      </div>

      {/* Receiver Details */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
            {currentLanguage === 'te' ? 'రిసీవర్ వివరాలు' : 'Receiver Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mobile">{t('receiverMobile')}</Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.receiverMobile}
              onChange={(e) => setFormData(prev => ({ ...prev, receiverMobile: e.target.value }))}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Loan Amount */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <IndianRupee className="h-5 w-5 mr-2 text-green-600" />
            {t('amount')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>{t('principalAmount')}</Label>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                ₹{formData.amount[0].toLocaleString()}
              </Badge>
            </div>
            <Slider
              value={formData.amount}
              onValueChange={(value) => setFormData(prev => ({ ...prev, amount: value }))}
              max={1000000}
              min={10000}
              step={5000}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹10,000</span>
              <span>₹10,00,000</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interest Details */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Percent className="h-5 w-5 mr-2 text-purple-600" />
            {t('interest')} {currentLanguage === 'te' ? 'వివరాలు' : 'Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t('interestType')}</Label>
            <Select value={formData.interestType} onValueChange={(value) => setFormData(prev => ({ ...prev, interestType: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={currentLanguage === 'te' ? 'వడ్డీ రకం ఎంచుకోండి' : 'Select interest type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">{t('simpleInterest')}</SelectItem>
                <SelectItem value="compound">{t('compoundInterest')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>{t('interestRate')}</Label>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                {formData.interestRate[0]}% {currentLanguage === 'te' ? 'వార్షికం' : 'per annum'}
              </Badge>
            </div>
            <Slider
              value={formData.interestRate}
              onValueChange={(value) => setFormData(prev => ({ ...prev, interestRate: value }))}
              max={36}
              min={1}
              step={0.5}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1%</span>
              <span>36%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Term Details */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-orange-600" />
            {t('term')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>{t('years')}</Label>
              <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                {formData.termYears[0]} {t('years')}
              </Badge>
            </div>
            <Slider
              value={formData.termYears}
              onValueChange={(value) => setFormData(prev => ({ ...prev, termYears: value }))}
              max={10}
              min={0}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>{t('months')}</Label>
              <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                {formData.termMonths[0]} {t('months')}
              </Badge>
            </div>
            <Slider
              value={formData.termMonths}
              onValueChange={(value) => setFormData(prev => ({ ...prev, termMonths: value }))}
              max={11}
              min={0}
              step={1}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Calculation Summary */}
      {formData.interestType && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              {currentLanguage === 'te' ? 'లెక్కల సారాంశం' : 'Calculation Summary'}
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('principalAmount')}:</span>
                <span className="font-medium">₹{formData.amount[0].toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('totalInterest')}:</span>
                <span className="font-medium">₹{totalInterest.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">{t('totalAmount')}:</span>
                <span className="font-bold text-lg">₹{totalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* E-Contract Section */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <FileSignature className="h-5 w-5 mr-2 text-red-600" />
            {t('signContract')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 mb-3">
              {currentLanguage === 'te' 
                ? 'మీరు పైన పేర్కొన్న నిబంధనలకు అంగీకరిస్తున్నారని మరియు ఈ రుణ ఒప్పందాన్ని డిజిటల్‌గా సంతకం చేయడానికి సిద్ధంగా ఉన్నారని నిర్ధారించండి.'
                : 'By signing this e-contract, you agree to the terms mentioned above and confirm your digital lending agreement.'
              }
            </p>
            <Button
              onClick={() => setContractSigned(true)}
              disabled={contractSigned}
              className={`w-full ${contractSigned ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {contractSigned ? (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  {t('contractSigned')}
                </>
              ) : (
                <>
                  <FileSignature className="h-4 w-4 mr-2" />
                  {t('signContract')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!contractSigned}
        className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
      >
        {currentLanguage === 'te' ? 'రుణ ఒప్పందం పూర్తి చేయండి' : 'Complete Lending Agreement'}
      </Button>
    </div>
  );
}
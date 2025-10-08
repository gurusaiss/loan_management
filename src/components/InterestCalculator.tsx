import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Calculator, 
  TrendingUp, 
  PieChart, 
  Calendar,
  IndianRupee,
  Percent,
  Clock,
  Target,
  ArrowRight,
  Info
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function InterestCalculator() {
  const { currentLanguage, t } = useLanguage();
  const [calculationType, setCalculationType] = useState<'simple' | 'compound'>('simple');
  const [principal, setPrincipal] = useState<string>('100000');
  const [rate, setRate] = useState<string>('12');
  const [time, setTime] = useState<string>('2');
  const [compoundFrequency, setCompoundFrequency] = useState<string>('12');
  const [results, setResults] = useState({
    interest: 0,
    totalAmount: 0,
    monthlyEMI: 0
  });

  const calculateInterest = () => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(rate) || 0;
    const t = parseFloat(time) || 0;
    const n = parseFloat(compoundFrequency) || 1;

    if (calculationType === 'simple') {
      const interest = (p * r * t) / 100;
      const totalAmount = p + interest;
      const monthlyEMI = totalAmount / (t * 12);
      
      setResults({
        interest,
        totalAmount,
        monthlyEMI
      });
    } else {
      const amount = p * Math.pow((1 + (r / (n * 100))), (n * t));
      const interest = amount - p;
      const monthlyEMI = amount / (t * 12);
      
      setResults({
        interest,
        totalAmount: amount,
        monthlyEMI
      });
    }
  };

  useEffect(() => {
    calculateInterest();
  }, [principal, rate, time, compoundFrequency, calculationType]);

  const pieData = [
    { 
      name: t('principal'), 
      value: parseFloat(principal) || 0, 
      color: '#3B82F6' 
    },
    { 
      name: t('interest'), 
      value: results.interest, 
      color: '#EF4444' 
    }
  ];

  const monthlyBreakdown = [];
  const months = parseFloat(time) * 12;
  for (let i = 1; i <= Math.min(months, 12); i++) {
    monthlyBreakdown.push({
      month: `Month ${i}`,
      principal: results.monthlyEMI * 0.7,
      interest: results.monthlyEMI * 0.3,
      total: results.monthlyEMI
    });
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const compoundingOptions = [
    { value: '1', label: t('annually') },
    { value: '2', label: t('semiAnnually') },
    { value: '4', label: t('quarterly') },
    { value: '12', label: t('monthly') }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white mb-2">
          <Calculator className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t('interestCalculator')}
        </h2>
        <p className="text-gray-600 text-sm">
          {t('calculatorSubtext')}
        </p>
      </div>

      {/* Calculator Type Toggle */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-gray-50 to-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant={calculationType === 'simple' ? 'default' : 'outline'}
              onClick={() => setCalculationType('simple')}
              className="flex-1"
            >
              {t('simpleInterest')}
            </Button>
            <Button
              variant={calculationType === 'compound' ? 'default' : 'outline'}
              onClick={() => setCalculationType('compound')}
              className="flex-1"
            >
              {t('compoundInterest')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Input Form */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <IndianRupee className="h-5 w-5 text-green-600" />
            <span>{t('loanDetails')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Principal Amount */}
            <div className="space-y-3">
              <Label className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span>{t('principalAmount')}</span>
                </div>
                <span className="text-lg font-bold text-blue-600">₹{parseInt(principal || '0').toLocaleString('en-IN')}</span>
              </Label>
              <Slider
                value={[parseInt(principal) || 100000]}
                onValueChange={(value) => setPrincipal(value[0].toString())}
                max={1000000}
                min={10000}
                step={10000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>₹10,000</span>
                <span>₹10,00,000</span>
              </div>
              <Input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="100000"
                className="text-center"
              />
            </div>

            {/* Interest Rate */}
            <div className="space-y-3">
              <Label className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Percent className="h-4 w-4 text-red-600" />
                  <span>{t('interestRate')}</span>
                </div>
                <span className="text-lg font-bold text-red-600">{parseFloat(rate || '0').toFixed(1)}%</span>
              </Label>
              <Slider
                value={[parseFloat(rate) || 12]}
                onValueChange={(value) => setRate(value[0].toFixed(1))}
                max={30}
                min={5}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>5%</span>
                <span>30%</span>
              </div>
              <Input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="12"
                className="text-center"
                step="0.1"
              />
            </div>

            {/* Time Period */}
            <div className="space-y-3">
              <Label className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span>{t('timePeriod')}</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{parseFloat(time || '0').toFixed(1)} {t('years')}</span>
              </Label>
              <Slider
                value={[parseFloat(time) || 2]}
                onValueChange={(value) => setTime(value[0].toFixed(1))}
                max={20}
                min={0.5}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>6 {currentLanguage === 'te' ? 'నెలలు' : 'months'}</span>
                <span>20 {t('years')}</span>
              </div>
              <Input
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="2"
                className="text-center"
                step="0.5"
              />
            </div>

            {/* Compound Frequency (only for compound interest) */}
            {calculationType === 'compound' && (
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  <span>{t('compoundingFrequency')}</span>
                </Label>
                <select
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {compoundingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {/* Main Results Cards */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 mb-1">
                    {t('totalInterest')}
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(results.interest)}
                  </p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <Percent className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 mb-1">
                    {t('totalAmount')}
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(results.totalAmount)}
                  </p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 mb-1">
                    {t('monthlyEMI')}
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatCurrency(results.monthlyEMI)}
                  </p>
                </div>
                <div className="p-3 bg-purple-200 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visual Analysis */}
        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="breakdown" className="text-sm">
              {t('breakdown')}
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-sm">
              {t('schedule')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="breakdown" className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  <span>{t('amountBreakdown')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex justify-center space-x-6 mt-4">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <BarChart className="h-5 w-5 text-green-600" />
                  <span>{t('monthlyBreakdown')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="principal" stackId="a" fill="#3B82F6" />
                      <Bar dataKey="interest" stackId="a" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <ArrowRight className="h-4 w-4 mr-2" />
            {t('trackLoan')}
          </Button>
          <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
            <Info className="h-4 w-4 mr-2" />
            {t('saveResult')}
          </Button>
        </div>
      </div>
    </div>
  );
}
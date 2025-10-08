import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { ArrowLeft, Book, Scale, Shield, AlertTriangle, Globe, Search } from 'lucide-react';
import { Input } from './ui/input';

interface LegalTermsProps {
  onBack: () => void;
}

export function LegalTerms({ onBack }: LegalTermsProps) {
  const { currentLanguage, toggleLanguage, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('terms');

  const legalTerms = [
    {
      term: 'EMI',
      fullForm: 'Equated Monthly Installment',
      teDefinition: 'సమాన నెలవారీ చెల్లింపు - రుణం మరియు వడ్డీని సమాన భాగాలుగా చెల్లించే పద్ధతి',
      enDefinition: 'A fixed payment amount made by a borrower to a lender at a specified date each calendar month.',
      category: 'payment'
    },
    {
      term: 'ROI',
      fullForm: 'Rate of Interest',
      teDefinition: 'వడ్డీ రేటు - రుణం మీద వసూలు చేయబడే వడ్డీ శాతం',
      enDefinition: 'The amount charged, expressed as a percentage of principal, by a lender to a borrower for the use of assets.',
      category: 'interest'
    },
    {
      term: 'NPA',
      fullForm: 'Non-Performing Asset',
      teDefinition: 'నాన్-పర్ఫార్మింగ్ ఆస్సెట్ - 90 రోజుల కంటే ఎక్కువ కాలం చెల్లించని రుణం',
      enDefinition: 'A loan or advance for which the principal or interest payment remained overdue for a period of 90 days.',
      category: 'risk'
    },
    {
      term: 'Collateral',
      fullForm: 'Collateral Security',
      teDefinition: 'తాకట్టు - రుణం కోసం భద్రతగా ఉంచే ఆస్తి లేదా వస్తువు',
      enDefinition: 'An asset that a borrower offers as a way for a lender to secure the loan.',
      category: 'security'
    },
    {
      term: 'CIBIL',
      fullForm: 'Credit Information Bureau India Limited',
      teDefinition: 'క్రెడిట్ స్కోర్ - వ్యక్తి యొక్క రుణ చెల్లింపు చరిత్రను సూచించే స్కోర్',
      enDefinition: 'A credit score that represents the creditworthiness of an individual based on their credit history.',
      category: 'credit'
    },
    {
      term: 'APR',
      fullForm: 'Annual Percentage Rate',
      teDefinition: 'వార్షిక శాతం రేటు - సంవత్సరానికి చెల్లించాల్సిన మొత్తం వడ్డీ మరియు ఫీజులు',
      enDefinition: 'The annual rate charged for borrowing, expressed as a single percentage number.',
      category: 'interest'
    },
    {
      term: 'Moratorium',
      fullForm: 'Payment Moratorium',
      teDefinition: 'చెల్లింపు వాయిదా - రుణ చెల్లింపుకు తాత్కాలిక విరామం',
      enDefinition: 'A temporary suspension of loan payments, typically granted during financial hardship.',
      category: 'payment'
    },
    {
      term: 'Prepayment',
      fullForm: 'Loan Prepayment',
      teDefinition: 'ముందస్తు చెల్లింపు - నిర్ణీత కాలానికి ముందే రుణం పూర్తిగా చెల్లించడం',
      enDefinition: 'Payment of a debt or installment before its official due date.',
      category: 'payment'
    },
    {
      term: 'Guarantor',
      fullForm: 'Loan Guarantor',
      teDefinition: 'హామీదారు - రుణగ్రహీత చెల్లించలేకపోతే చెల్లించే బాధ్యత తీసుకునే వ్యక్తి',
      enDefinition: 'A person who agrees to pay a borrower\'s debt if the borrower defaults on a loan obligation.',
      category: 'security'
    }
  ];

  const governmentRules = [
    {
      title: currentLanguage === 'te' ? 'రిజర్వ్ బ్యాంక్ ఆఫ్ ఇండియా నిబంధనలు' : 'Reserve Bank of India Guidelines',
      rules: currentLanguage === 'te' ? [
        'వడ్డీ రేట్లు RBI నిర్దేశాలకు అనుగుణంగా ఉండాలి',
        'అన్ని రుణాలు KYC నిబంధనలను పాటించాలి',
        'రుణదాతలు లైసెన్స్ పొందాలి',
        'వినియోగదారుల ఫిర్యాదుల పరిష్కారం తప్పనిసరి'
      ] : [
        'Interest rates must comply with RBI guidelines',
        'All loans must follow KYC regulations',
        'Lenders must be licensed and regulated',
        'Consumer complaint resolution is mandatory'
      ]
    },
    {
      title: currentLanguage === 'te' ? 'ఫెయిర్ ప్రాక్టీసెస్ కోడ్' : 'Fair Practices Code',
      rules: currentLanguage === 'te' ? [
        'పారదర్శకమైన వడ్డీ రేట్లు మరియు ఫీజులు',
        'రుణ నిబంధనలు స్పష్టంగా వివరించాలి',
        'వసూలు పద్ధతులు న్యాయంగా ఉండాలి',
        'వినియోగదారుల గోప్యత రక్షణ'
      ] : [
        'Transparent interest rates and fees',
        'Clear explanation of loan terms',
        'Fair collection practices',
        'Consumer privacy protection'
      ]
    },
    {
      title: currentLanguage === 'te' ? 'చట్టపరమైన రక్షణలు' : 'Legal Protections',
      rules: currentLanguage === 'te' ? [
        'కన్జ్యూమర్ ప్రొటెక్షన్ యాక్ట్ కింద రక్షణ',
        'అధిక వడ్డీకి వ్యతిరేకంగా చట్టపరమైన చర్యలు',
        'వేధింపుల కేసుల్లో పోలీసు ఫిర్యాదు హక్కు',
        'రుణ మాఫీ పథకాలకు అర్హత'
      ] : [
        'Protection under Consumer Protection Act',
        'Legal action against excessive interest',
        'Right to file police complaint for harassment',
        'Eligibility for loan waiver schemes'
      ]
    }
  ];

  const safetyTips = [
    {
      icon: '🔒',
      title: currentLanguage === 'te' ? 'డాక్యుమెంట్స్ భద్రత' : 'Document Security',
      tips: currentLanguage === 'te' ? [
        'అసలు డాక్యుమెంట్స్ ఎప్పుడూ ఇవ్వకండి',
        'కాపీలకు "కాపీ" అని రాయండి',
        'అన్ని పేపర్లను జాగ్రత్తగా చదవండి',
        'అవగాహన లేని పేపర్లపై సంతకం చేయకండి'
      ] : [
        'Never give original documents',
        'Mark copies as "COPY"',
        'Read all papers carefully',
        'Don\'t sign papers you don\'t understand'
      ]
    },
    {
      icon: '💰',
      title: currentLanguage === 'te' ? 'వడ్డీ రేటు జాగ్రత్తలు' : 'Interest Rate Cautions',
      tips: currentLanguage === 'te' ? [
        'మార్కెట్ రేట్లతో పోల్చండి',
        'దాచిన ఛార్జీలను అడగండి',
        'వార్షిక వడ్డీ రేటు తెలుసుకోండి',
        'రోజువారీ వడ్డీ వేధింపులను నివారించండి'
      ] : [
        'Compare with market rates',
        'Ask about hidden charges',
        'Know the annual interest rate',
        'Avoid daily interest harassment'
      ]
    },
    {
      icon: '⚖️',
      title: currentLanguage === 'te' ? 'చట్టపరమైన హక్కులు' : 'Legal Rights',
      tips: currentLanguage === 'te' ? [
        'రుణ ఒప్పందం కాపీ తీసుకోండి',
        'చెల్లింపు రసీదులు భద్రపరచండి',
        'వేధింపులను నివేదించండి',
        'న్యాయ సహాయం కోసం కాంటాక్ట్ చేయండి'
      ] : [
        'Take copy of loan agreement',
        'Keep payment receipts safe',
        'Report harassment',
        'Contact legal aid if needed'
      ]
    }
  ];

  const filteredTerms = legalTerms.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.fullForm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (currentLanguage === 'te' ? term.teDefinition : term.enDefinition)
      .toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      payment: 'bg-blue-100 text-blue-800',
      interest: 'bg-green-100 text-green-800',
      risk: 'bg-red-100 text-red-800',
      security: 'bg-purple-100 text-purple-800',
      credit: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('legalEducation')}</h2>
            <p className="text-sm text-gray-600">
              {currentLanguage === 'te' 
                ? 'రుణాలకు సంబంధించిన చట్టపరమైన నిబంధనలు మరియు భద్రత'
                : 'Legal terms and safety guidelines for loans'
              }
            </p>
          </div>
        </div>
        
        {/* Language Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="h-9 w-9 p-0"
        >
          <div className="flex flex-col items-center">
            <Globe className="h-3 w-3 mb-0.5" />
            <span className="text-xs font-medium">
              {currentLanguage === 'te' ? 'EN' : 'TE'}
            </span>
          </div>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="terms" className="text-sm">
            <Book className="h-4 w-4 mr-2" />
            {currentLanguage === 'te' ? 'నిబంధనలు' : 'Terms'}
          </TabsTrigger>
          <TabsTrigger value="rules" className="text-sm">
            <Scale className="h-4 w-4 mr-2" />
            {currentLanguage === 'te' ? 'నియమాలు' : 'Rules'}
          </TabsTrigger>
          <TabsTrigger value="safety" className="text-sm">
            <Shield className="h-4 w-4 mr-2" />
            {currentLanguage === 'te' ? 'భద్రత' : 'Safety'}
          </TabsTrigger>
        </TabsList>

        {/* Legal Terms Tab */}
        <TabsContent value="terms" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={currentLanguage === 'te' ? 'నిబంధనలు వెతకండి...' : 'Search terms...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredTerms.map((term, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{term.term}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{term.fullForm}</p>
                      </div>
                      <Badge className={getCategoryColor(term.category)}>
                        {term.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {currentLanguage === 'te' ? term.teDefinition : term.enDefinition}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Government Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              {governmentRules.map((section, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Scale className="h-5 w-5 mr-2 text-blue-600" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-gray-700">{rule}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Safety Tips Tab */}
        <TabsContent value="safety" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              {safetyTips.map((section, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="text-2xl mr-3">{section.icon}</span>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-3">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{tip}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}

              {/* Emergency Contacts */}
              <Card className="border-0 shadow-md bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-800">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {currentLanguage === 'te' ? 'అత్యవసర సహాయం' : 'Emergency Help'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <p className="font-medium text-red-800">
                      {currentLanguage === 'te' ? 'వేధింపుల కేసుల్లో:' : 'In case of harassment:'}
                    </p>
                    <p className="text-red-700">
                      {currentLanguage === 'te' ? 'పోలీసు: 100' : 'Police: 100'}
                    </p>
                    <p className="text-red-700">
                      {currentLanguage === 'te' ? 'మహిళల హెల్ప్‌లైన్: 181' : 'Women Helpline: 181'}
                    </p>
                    <p className="text-red-700">
                      {currentLanguage === 'te' ? 'లీగల్ ఎయిడ్: 15100' : 'Legal Aid: 15100'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Building2, 
  Landmark, 
  Search, 
  ExternalLink, 
  Phone, 
  MapPin,
  Clock,
  IndianRupee,
  Users,
  Tractor,
  Home,
  GraduationCap,
  Briefcase,
  Heart
} from 'lucide-react';

interface LoanScheme {
  id: string;
  name: string;
  nameTE: string;
  description: string;
  descriptionTE: string;
  provider: string;
  providerTE: string;
  category: 'personal' | 'business' | 'agriculture' | 'education' | 'housing' | 'healthcare';
  interestRate: string;
  maxAmount: string;
  tenure: string;
  eligibility: string[];
  eligibilityTE: string[];
  documents: string[];
  documentsTE: string[];
  applicationLink: string;
  contactNumber: string;
  type: 'central' | 'state' | 'bank';
}

const governmentSchemes: LoanScheme[] = [
  // Central Government Schemes
  {
    id: 'pmmy',
    name: 'Pradhan Mantri Mudra Yojana',
    nameTE: 'ప్రధాన మంత్రి ముద్రా యోజన',
    description: 'Collateral-free loans for micro and small enterprises',
    descriptionTE: 'సూక్ష్మ మరియు చిన్న వ్యాపారాల కోసం తాకట్టు లేని రుణాలు',
    provider: 'Government of India',
    providerTE: 'భారత ప్రభుత్వం',
    category: 'business',
    interestRate: '8.5% - 12%',
    maxAmount: '₹10 Lakhs',
    tenure: '5 Years',
    eligibility: ['Age 18+', 'Indian Citizen', 'Business Plan', 'Non-defaulter'],
    eligibilityTE: ['వయస్సు 18+', 'భారతీయ పౌరుడు', 'వ్యాపార ప్రణాళిక', 'డిఫాల్టర్ కాదు'],
    documents: ['Aadhaar Card', 'PAN Card', 'Bank Statements', 'Business Plan'],
    documentsTE: ['ఆధార్ కార్డ్', 'పాన్ కార్డ్', 'బ్యాంక్ స్టేట్‌మెంట్లు', 'వ్యాపార ప్రణాళిక'],
    applicationLink: 'https://www.mudra.org.in/',
    contactNumber: '1800-180-1111',
    type: 'central'
  },
  {
    id: 'pmay',
    name: 'Pradhan Mantri Awas Yojana',
    nameTE: 'ప్రధాన మంత్రి ఆవాస్ యోజన',
    description: 'Home loans with subsidized interest rates for affordable housing',
    descriptionTE: 'సరసమైన గృహనిర్మాణం కోసం రాయితీ వడ్డీ రేట్లతో గృహ రుణాలు',
    provider: 'Government of India',
    providerTE: 'భారత ప్రభుత్వం',
    category: 'housing',
    interestRate: '6.5% onwards',
    maxAmount: '₹12 Lakhs',
    tenure: '20 Years',
    eligibility: ['Annual Income < ₹18 Lakhs', 'First time home buyer', 'Indian Citizen'],
    eligibilityTE: ['వార్షిక ఆదాయం < ₹18 లక్షలు', 'మొదటిసారి ఇల్లు కొనేవారు', 'భారతీయ పౌరుడు'],
    documents: ['Income Certificate', 'Aadhaar Card', 'Property Documents', 'Bank Statements'],
    documentsTE: ['ఆదాయ ప్రమాణపత్రం', 'ఆధార్ కార్డ్', 'ఆస్తి పత్రాలు', 'బ్యాంక్ స్టేట్‌మెంట్లు'],
    applicationLink: 'https://pmaymis.gov.in/',
    contactNumber: '1800-11-6677',
    type: 'central'
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card',
    nameTE: 'కిసాన్ క్రెడిట్ కార్డ్',
    description: 'Credit facility for farmers to meet agricultural expenses',
    descriptionTE: 'వ్యవసాయ ఖర్చులను తీర్చడానికి రైతులకు రుణ సౌకర్యం',
    provider: 'Government of India',
    providerTE: 'భారత ప్రభుత్వం',
    category: 'agriculture',
    interestRate: '4% - 7%',
    maxAmount: '₹3 Lakhs',
    tenure: '1 Year (Renewable)',
    eligibility: ['Farmer with land records', 'Age 18-75', 'Valid land documents'],
    eligibilityTE: ['భూమి రికార్డులున్న రైతు', 'వయస్సు 18-75', 'చెల్లుబాటు అయ్యే భూమి పత్రాలు'],
    documents: ['Land Records', 'Aadhaar Card', 'Bank Account', 'Passport Photo'],
    documentsTE: ['భూమి రికార్డులు', 'ఆధార్ కార్డ్', 'బ్యాంక్ ఖాతా', 'పాస్‌పోర్ట్ ఫోటో'],
    applicationLink: 'https://pmkisan.gov.in/',
    contactNumber: '155261',
    type: 'central'
  },
  {
    id: 'education-loan',
    name: 'Central Scheme for Interest Subsidy',
    nameTE: 'వడ్డీ రాయితీ కేంద్ర పథకం',
    description: 'Interest subsidy on education loans for economically weaker sections',
    descriptionTE: 'ఆర్థికంగా వెనుకబడిన వర్గాలకు విద్యా రుణాలపై వడ్డీ రాయితీ',
    provider: 'Government of India',
    providerTE: 'భారత ప్రభుత్వం',
    category: 'education',
    interestRate: '4% subsidy',
    maxAmount: '₹7.5 Lakhs',
    tenure: 'Course duration + 1 year',
    eligibility: ['Family income < ₹4.5 Lakhs', 'Admission in recognized institution'],
    eligibilityTE: ['కుటుంబ ఆదాయం < ₹4.5 లక్షలు', 'గుర్తింపు పొందిన సంస్థలో ప్రవేశం'],
    documents: ['Income Certificate', 'Admission Letter', 'Bank Account', 'Aadhaar Card'],
    documentsTE: ['ఆదాయ ప్రమాణపత్రం', 'ప్రవేశ లేఖ', 'బ్యాంక్ ఖాతా', 'ఆధార్ కార్డ్'],
    applicationLink: 'https://www.vidyalakshmi.co.in/',
    contactNumber: '1800-233-4555',
    type: 'central'
  },

  // Andhra Pradesh State Schemes
  {
    id: 'apsfc',
    name: 'AP State Financial Corporation Loans',
    nameTE: 'ఆంధ్రప్రదేశ్ రాష్ట్ర ఆర్థిక సంస్థ రుణాలు',
    description: 'Term loans for small and medium enterprises in AP',
    descriptionTE: 'ఆంధ్రప్రదేశ్‌లో చిన్న మరియు మధ్యమ వ్యాపారాలకు టర్మ్ లోన్లు',
    provider: 'Government of Andhra Pradesh',
    providerTE: 'ఆంధ్రప్రదేశ్ ప్రభుత్వం',
    category: 'business',
    interestRate: '9% - 12%',
    maxAmount: '₹25 Lakhs',
    tenure: '7 Years',
    eligibility: ['AP Resident', 'Valid business license', 'Project report'],
    eligibilityTE: ['ఆంధ్రప్రదేశ్ నివాసి', 'చెల్లుబాటు అయ్యే వ్యాపార లైసెన్స్', 'ప్రాజెక్ట్ రిపోర్ట్'],
    documents: ['Residence Certificate', 'Business License', 'Project Report', 'Collateral Documents'],
    documentsTE: ['నివాస ప్రమాణపత్రం', 'వ్యాపార లైసెన్స్', 'ప్రాజెక్ట్ రిపోర్ట్', 'తాకట్టు పత్రాలు'],
    applicationLink: 'https://www.apsfc.ap.gov.in/',
    contactNumber: '0863-2340506',
    type: 'state'
  },
  {
    id: 'rytu-bharosa',
    name: 'Rytu Bharosa Investment Support',
    nameTE: 'రైతు భరోసా పెట్టుబడి మద్దతు',
    description: 'Financial assistance for farmers in Andhra Pradesh',
    descriptionTE: 'ఆంధ్రప్రదేశ్‌లోని రైతులకు ఆర్థిక సహాయం',
    provider: 'Government of Andhra Pradesh',
    providerTE: 'ఆంధ్రప్రదేశ్ ప్రభుత్వం',
    category: 'agriculture',
    interestRate: '0% (Grant)',
    maxAmount: '₹13,500/year',
    tenure: 'Annual',
    eligibility: ['AP Farmer', 'Land ownership/tenancy', 'Aadhaar linked bank account'],
    eligibilityTE: ['ఆంధ్రప్రదేశ్ రైతు', 'భూమి యాజమాన్యం/కౌలు', 'ఆధార్ అనుసంధాన బ్యాంక్ ఖాతా'],
    documents: ['Land Records', 'Aadhaar Card', 'Bank Passbook', 'Ration Card'],
    documentsTE: ['భూమి రికార్డులు', 'ఆధార్ కార్డ్', 'బ్యాంక్ పాస్‌బుక్', 'రేషన్ కార్డ్'],
    applicationLink: 'https://webland.ap.gov.in/',
    contactNumber: '14400',
    type: 'state'
  },
  {
    id: 'ap-housing',
    name: 'AP Housing Corporation Loans',
    nameTE: 'ఆంధ్రప్రదేశ్ హౌసింగ్ కార్పొరేషన్ రుణాలు',
    description: 'Affordable housing loans for AP residents',
    descriptionTE: 'ఆంధ్రప్రదేశ్ నివాసులకు సరసమైన గృహ రుణాలు',
    provider: 'Government of Andhra Pradesh',
    providerTE: 'ఆంధ్రప్రదేశ్ ప్రభుత్వం',
    category: 'housing',
    interestRate: '8.5% onwards',
    maxAmount: '₹15 Lakhs',
    tenure: '15 Years',
    eligibility: ['AP Resident', 'Income < ₹15 Lakhs', 'First time home buyer'],
    eligibilityTE: ['ఆంధ్రప్రదేశ్ నివాసి', 'ఆదాయం < ₹15 లక్షలు', 'మొదటిసారి ఇల్లు కొనేవారు'],
    documents: ['Residence Certificate', 'Income Certificate', 'Property Documents', 'Bank Statements'],
    documentsTE: ['నివాస ప్రమాణపత్రం', 'ఆదాయ ప్రమాణపత్రం', 'ఆస్తి పత్రాలు', 'బ్యాంక్ స్టేట్‌మెంట్లు'],
    applicationLink: 'https://www.apshcl.ap.gov.in/',
    contactNumber: '040-23150000',
    type: 'state'
  }
];

const bankingPartners = [
  {
    name: 'State Bank of India',
    nameTE: 'స్టేట్ బ్యాంక్ ఆఫ్ ఇండియా',
    specialization: 'All loan types',
    specializationTE: 'అన్ని రకాల రుణాలు',
    phone: '1800-11-2211',
    website: 'https://www.onlinesbi.com'
  },
  {
    name: 'Andhra Bank (Now Union Bank)',
    nameTE: 'ఆంధ్రా బ్యాంక్ (ఇప్పుడు యూనియన్ బ్యాంక్)',
    specialization: 'Personal & Business loans',
    specializationTE: 'వ్యక్తిగత మరియు వ్యాపార రుణాలు',
    phone: '1800-222-244',
    website: 'https://www.unionbankofindia.co.in'
  },
  {
    name: 'Andhra Pradesh Grameena Vikas Bank',
    nameTE: 'ఆంధ్రప్రదేశ్ గ్రామీణ వికాస్ బ్యాంక్',
    specialization: 'Rural & Agricultural loans',
    specializationTE: 'గ్రామీణ మరియు వ్యవసాయ రుణాలు',
    phone: '1800-425-1414',
    website: 'https://www.apgvbank.in'
  }
];

export function BankingIntegration() {
  const { t, currentLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const categoryIcons = {
    personal: Users,
    business: Briefcase,
    agriculture: Tractor,
    education: GraduationCap,
    housing: Home,
    healthcare: Heart
  };

  const filteredSchemes = governmentSchemes.filter(scheme => {
    const matchesSearch = searchTerm === '' || 
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.nameTE.includes(searchTerm) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    const matchesType = selectedType === 'all' || scheme.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleApply = (scheme: LoanScheme) => {
    window.open(scheme.applicationLink, '_blank');
  };

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">
            {currentLanguage === 'te' ? 'బ్యాంకింగ్ మరియు ప్రభుత్వ పథకాలు' : 'Banking & Government Schemes'}
          </h1>
        </div>
        <p className="text-sm text-gray-600">
          {currentLanguage === 'te' 
            ? 'అధికారిక బ్యాంకింగ్ ఎంపికలు మరియు ప్రభుత్వ రుణ పథకాలు' 
            : 'Official banking options and government loan schemes'
          }
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={currentLanguage === 'te' ? 'పథకాలను వెతకండి...' : 'Search schemes...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">{currentLanguage === 'te' ? 'అన్ని రకాలు' : 'All Types'}</option>
            <option value="central">{currentLanguage === 'te' ? 'కేంద్ర ప్రభుత్వం' : 'Central Govt'}</option>
            <option value="state">{currentLanguage === 'te' ? 'రాష్ట్ర ప్రభుత్వం' : 'State Govt'}</option>
            <option value="bank">{currentLanguage === 'te' ? 'బ్యాంకులు' : 'Banks'}</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">{currentLanguage === 'te' ? 'అన్ని వర్గాలు' : 'All Categories'}</option>
            <option value="personal">{currentLanguage === 'te' ? 'వ్యక్తిగతం' : 'Personal'}</option>
            <option value="business">{currentLanguage === 'te' ? 'వ్యాపారం' : 'Business'}</option>
            <option value="agriculture">{currentLanguage === 'te' ? 'వ్యవసాయం' : 'Agriculture'}</option>
            <option value="education">{currentLanguage === 'te' ? 'విద్య' : 'Education'}</option>
            <option value="housing">{currentLanguage === 'te' ? 'గృహనిర్మాణం' : 'Housing'}</option>
            <option value="healthcare">{currentLanguage === 'te' ? 'ఆరోగ్యం' : 'Healthcare'}</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="schemes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schemes">
            {currentLanguage === 'te' ? 'ప్రభుత్వ పథకాలు' : 'Government Schemes'}
          </TabsTrigger>
          <TabsTrigger value="banks">
            {currentLanguage === 'te' ? 'బ్యాంకింగ్ భాగస్వాములు' : 'Banking Partners'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schemes" className="space-y-4">
          {filteredSchemes.map((scheme) => {
            const IconComponent = categoryIcons[scheme.category];
            
            return (
              <Card key={scheme.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {currentLanguage === 'te' ? scheme.nameTE : scheme.name}
                        </CardTitle>
                        <p className="text-xs text-gray-500">
                          {currentLanguage === 'te' ? scheme.providerTE : scheme.provider}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {scheme.type === 'central' 
                          ? currentLanguage === 'te' ? 'కేంద్రం' : 'Central'
                          : currentLanguage === 'te' ? 'రాష్ట్రం' : 'State'
                        }
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {currentLanguage === 'te' ? scheme.descriptionTE : scheme.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">
                        {currentLanguage === 'te' ? 'వడ్డీ రేటు' : 'Interest Rate'}
                      </p>
                      <p className="font-medium text-green-600">{scheme.interestRate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">
                        {currentLanguage === 'te' ? 'గరిష్ట మొత్తం' : 'Max Amount'}
                      </p>
                      <p className="font-medium text-blue-600">{scheme.maxAmount}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm mb-2">
                      {currentLanguage === 'te' ? 'అర్హత' : 'Eligibility'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(currentLanguage === 'te' ? scheme.eligibilityTE : scheme.eligibility)
                        .slice(0, 2).map((criteria, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {criteria}
                        </Badge>
                      ))}
                      {scheme.eligibility.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{scheme.eligibility.length - 2} {currentLanguage === 'te' ? 'మరిన్ని' : 'more'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Button 
                      onClick={() => handleApply(scheme)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      size="sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {currentLanguage === 'te' ? 'దరఖాస్తు చేసుకోండి' : 'Apply Now'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCall(scheme.contactNumber)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredSchemes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {currentLanguage === 'te' 
                  ? 'మీ వెతుకులాటకు సరిపోయే పథకాలు లేవు' 
                  : 'No schemes match your search criteria'
                }
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="banks" className="space-y-4">
          {bankingPartners.map((bank, index) => (
            <Card key={index} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Landmark className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {currentLanguage === 'te' ? bank.nameTE : bank.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {currentLanguage === 'te' ? bank.specializationTE : bank.specialization}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{bank.phone}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(bank.website, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    {currentLanguage === 'te' ? 'సందర్శించండి' : 'Visit'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Emergency Contact */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-orange-900">
                {currentLanguage === 'te' ? 'ఆపద్ధర్మిక సహాయం' : 'Emergency Helpline'}
              </h3>
              <p className="text-sm text-orange-700">
                {currentLanguage === 'te' 
                  ? 'రుణ సంబంధిత సమస్యలకు: 14416' 
                  : 'For loan-related issues: 14416'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
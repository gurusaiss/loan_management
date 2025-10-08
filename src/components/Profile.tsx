import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, User, Edit3, Save, Phone, Shield, Globe } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ProfileProps {
  onBack: () => void;
}

interface UserProfile {
  aadhaarNumber: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phoneNumber?: string;
  authMethod?: string;
}

// Translation dictionary for Profile page
const profileTranslations = {
  en: {
    profile: 'Profile',
    personalDetails: 'Personal Details',
    fullName: 'Full Name',
    aadharNumber: 'Aadhaar Number',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    address: 'Address',
    phoneNumber: 'Phone Number',
    verified: 'Verified',
    edit: 'Edit',
    save: 'Save',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    accountInfo: 'Account Information',
    loginMethod: 'Login Method:',
    mobileOTP: 'Mobile OTP',
    verificationStatus: 'Verification Status:',
    completed: 'Completed',
    noProfileData: 'No profile data found',
    profileUpdated: 'Profile updated successfully',
    // Data translations
    nameValue: 'Ram Kumar Sharma',
    addressValue: '123, Gandhi Street, Hyderabad, Telangana - 500001'
  },
  te: {
    profile: 'ప్రొఫైల్',
    personalDetails: 'వ్యక్తిగత వివరాలు',
    fullName: 'పూర్తి పేరు',
    aadharNumber: 'ఆధార్ నంబర్',
    dateOfBirth: 'జన్మ తేదీ',
    gender: 'లింగం',
    male: 'పురుషుడు',
    female: 'స్త్రీ',
    other: 'ఇతర',
    address: 'చిరునామా',
    phoneNumber: 'ఫోన్ నంబర్',
    verified: 'వెరిఫై అయింది',
    edit: 'ఎడిట్',
    save: 'సేవ్',
    saveChanges: 'మార్పులను సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    accountInfo: 'ఖాతా సమాచారం',
    loginMethod: 'లాగిన్ మెథడ్:',
    mobileOTP: 'మొబైల్ OTP',
    verificationStatus: 'వెరిఫికేషన్ స్థితి:',
    completed: 'పూర్తయింది',
    noProfileData: 'ప్రొఫైల్ డేటా లేదు',
    profileUpdated: 'ప్రొఫైల్ విజయవంతంగా అప్‌డేట్ చేయబడింది',
    // Data translations
    nameValue: 'రామ్ కుమార్ శర్మ',
    addressValue: '123, గాంధీ వీధి, హైదరాబాద్, తెలంగాణ - 500001'
  }
};

export function Profile({ onBack }: ProfileProps) {
  const { currentLanguage, toggleLanguage, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [profilePageLang, setProfilePageLang] = useState<'en' | 'te'>('en'); // Local language state for Profile page

  useEffect(() => {
    // Load profile data from localStorage
    const savedProfile = localStorage.getItem('user-profile');
    const phoneNumber = localStorage.getItem('user-phone');
    const authMethod = localStorage.getItem('user-auth-method');

    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      const fullProfile = {
        ...profileData,
        phoneNumber: phoneNumber || '',
        authMethod: authMethod || 'phone'
      };
      setProfile(fullProfile);
      setEditedProfile(fullProfile);
    }
  }, []);

  const handleSave = () => {
    if (!editedProfile) return;

    // Save to localStorage
    const { phoneNumber, authMethod, ...profileToSave } = editedProfile;
    localStorage.setItem('user-profile', JSON.stringify(profileToSave));
    
    setProfile(editedProfile);
    setIsEditing(false);
    const pt = profileTranslations[profilePageLang];
    toast.success(pt.profileUpdated);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const updateProfile = (field: keyof UserProfile, value: string) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  };

  const toggleProfilePageLang = () => {
    setProfilePageLang(prev => prev === 'en' ? 'te' : 'en');
  };

  const pt = profileTranslations[profilePageLang];

  if (!profile) {
    return (
      <div className="p-4">
        <div className="text-center">
          <p className="text-gray-600">
            {pt.noProfileData}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{pt.profile}</h2>
            <p className="text-sm text-gray-600">{pt.personalDetails}</p>
          </div>
        </div>
        
        {/* Language Toggle - Local to this page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleProfilePageLang}
          className="h-9 w-9 p-0 flex flex-col items-center justify-center border border-gray-200"
        >
          <div className="flex items-center space-x-0.5">
            <span className={`text-xs font-bold ${profilePageLang === 'te' ? 'text-blue-600' : 'text-gray-400'}`}>అ</span>
            <span className={`text-xs font-bold ${profilePageLang === 'en' ? 'text-blue-600' : 'text-gray-400'}`}>A</span>
          </div>
        </Button>
      </div>

      {/* Profile Header Card */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-100">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                {pt.nameValue}
              </h3>
              <div className="flex items-center space-x-4 mt-1">
                {profile.phoneNumber && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-3 w-3 mr-1" />
                    +91{profile.phoneNumber}
                  </div>
                )}
                <div className="flex items-center text-sm text-green-600">
                  <Shield className="h-3 w-3 mr-1" />
                  {pt.verified}
                </div>
              </div>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {pt.save}
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 mr-2" />
                  {pt.edit}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Details */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            {pt.personalDetails}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fullName">{pt.fullName}</Label>
            <Input
              id="fullName"
              value={pt.nameValue}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="aadhaar">{pt.aadharNumber}</Label>
            <Input
              id="aadhaar"
              value={editedProfile?.aadhaarNumber || ''}
              disabled
              className="mt-1 font-mono bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dob">{pt.dateOfBirth}</Label>
              <Input
                id="dob"
                value={editedProfile?.dateOfBirth || ''}
                onChange={(e) => updateProfile('dateOfBirth', e.target.value)}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="gender">{pt.gender}</Label>
              <Select 
                value={editedProfile?.gender?.toLowerCase() || ''} 
                onValueChange={(value) => updateProfile('gender', value)}
                disabled={!isEditing}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{pt.male}</SelectItem>
                  <SelectItem value="female">{pt.female}</SelectItem>
                  <SelectItem value="other">{pt.other}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">{pt.address}</Label>
            <Input
              id="address"
              value={pt.addressValue}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          {profile.phoneNumber && (
            <div>
              <Label htmlFor="phone">{pt.phoneNumber}</Label>
              <Input
                id="phone"
                value={`+91${profile.phoneNumber}`}
                disabled
                className="mt-1 bg-gray-50"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      {isEditing && (
        <div className="flex space-x-3">
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {pt.saveChanges}
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1"
          >
            {pt.cancel}
          </Button>
        </div>
      )}

      {/* Account Information */}
      <Card className="border-0 shadow-md bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">
            {pt.accountInfo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {pt.loginMethod}
              </span>
              <span className="font-medium">
                {profile.authMethod === 'google' 
                  ? 'Google' 
                  : pt.mobileOTP
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                {pt.verificationStatus}
              </span>
              <span className="text-green-600 font-medium">
                {pt.completed}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
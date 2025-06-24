'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, MapPin, Building, Camera, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface ProfileData {
  // Personal Info
  profilePicture?: File;
  bio?: string;
  dateOfBirth?: string;
  
  // Address
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Professional Info
  experience?: number;
  specializations?: string[];
  preferredRoutes?: string[];
  
  // Company Info (if applicable)
  companyDescription?: string;
  website?: string;
  yearEstablished?: number;
  certifications?: string[];
  
  // Preferences
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  language: string;
  timezone: string;
}

const COMPLETION_STEPS = [
  { id: 1, title: 'Personal Details', icon: Building },
  { id: 2, title: 'Address & Location', icon: MapPin },
  { id: 3, title: 'Professional Info', icon: Building },
  { id: 4, title: 'Preferences', icon: CheckCircle },
];

export default function ProfileCompletionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({
    notifications: { email: false, sms: false, push: false },
    language: 'en',
    timezone: 'UTC',
    country: 'Morocco'
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const progress = (currentStep / COMPLETION_STEPS.length) * 100;

  const updateData = (stepData: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...stepData }));
  };

  const validateStep = (): boolean => {
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, COMPLETION_STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/profile/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        router.push('/dashboard');
      }
    } catch {
      // Error handling can be added here if needed
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDetailsStep data={profileData} onUpdate={updateData} />;
      case 2:
        return <AddressStep data={profileData} onUpdate={updateData} />;
      case 3:
        return <ProfessionalInfoStep data={profileData} onUpdate={updateData} />;
      case 4:
        return <PreferencesStep data={profileData} onUpdate={updateData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Profile
          </CardTitle>
          <p className="text-center text-gray-600">
            Help us personalize your MarocTransit experience
          </p>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between">
              {COMPLETION_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center space-y-2 ${
                      currentStep >= step.id ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep >= step.id ? 'bg-green-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="text-xs text-center">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>Previous</span>
            </Button>
            
            {currentStep === COMPLETION_STEPS.length ? (
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
                >
                  Skip for now
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  {isLoading ? 'Completing...' : 'Complete Profile'}
                </Button>
              </div>
            ) : (
              <Button
                onClick={nextStep}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Step Components
function PersonalDetailsStep({ 
  data, 
  onUpdate 
}: { 
  data: Partial<ProfileData>;
  onUpdate: (data: Partial<ProfileData>) => void;
}) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdate({ profilePicture: file });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Personal Details</h3>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            {data.profilePicture ? (
              <Image
                src={URL.createObjectURL(data.profilePicture)}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <label
            htmlFor="profilePicture"
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700"
          >
            <Upload size={16} />
          </label>
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        <p className="text-sm text-gray-600">Upload your profile picture</p>
      </div>

      <div>
        <Textarea
          placeholder="Tell us about yourself (optional)"
          value={data.bio || ''}
          onChange={(e) => onUpdate({ bio: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <div>
        <Input
          type="date"
          placeholder="Date of Birth (optional)"
          value={data.dateOfBirth || ''}
          onChange={(e) => onUpdate({ dateOfBirth: e.target.value })}
        />
      </div>
    </div>
  );
}

function AddressStep({ 
  data, 
  onUpdate 
}: { 
  data: Partial<ProfileData>;
  onUpdate: (data: Partial<ProfileData>) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Address & Location</h3>
      
      <div>
        <Input
          placeholder="Street Address"
          value={data.street || ''}
          onChange={(e) => onUpdate({ street: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="City"
            value={data.city || ''}
            onChange={(e) => onUpdate({ city: e.target.value })}
          />
        </div>
        <div>
          <Input
            placeholder="State/Province"
            value={data.state || ''}
            onChange={(e) => onUpdate({ state: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="Postal Code"
            value={data.postalCode || ''}
            onChange={(e) => onUpdate({ postalCode: e.target.value })}
          />
        </div>
        <div>
          <Select
            value={data.country || 'Morocco'}
            onValueChange={(value) => onUpdate({ country: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Morocco">Morocco</SelectItem>
              <SelectItem value="Algeria">Algeria</SelectItem>
              <SelectItem value="Tunisia">Tunisia</SelectItem>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="Spain">Spain</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function ProfessionalInfoStep({ 
  data, 
  onUpdate 
}: { 
  data: Partial<ProfileData>;
  onUpdate: (data: Partial<ProfileData>) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Professional Information</h3>
      
      <div>
        <Input
          type="number"
          placeholder="Years of Experience (optional)"
          value={data.experience || ''}
          onChange={(e) => onUpdate({ experience: parseInt(e.target.value) })}
        />
      </div>

      <div>
        <Input
          placeholder="Website (optional)"
          value={data.website || ''}
          onChange={(e) => onUpdate({ website: e.target.value })}
        />
      </div>

      <div>
        <Textarea
          placeholder="Company Description (optional)"
          value={data.companyDescription || ''}
          onChange={(e) => onUpdate({ companyDescription: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <div>
        <Input
          type="number"
          placeholder="Year Established (optional)"
          value={data.yearEstablished || ''}
          onChange={(e) => onUpdate({ yearEstablished: parseInt(e.target.value) })}
        />
      </div>
    </div>
  );
}

function PreferencesStep({ 
  data, 
  onUpdate 
}: { 
  data: Partial<ProfileData>;
  onUpdate: (data: Partial<ProfileData>) => void;
}) {
  const updateNotifications = (key: keyof ProfileData['notifications'], value: boolean) => {
    onUpdate({
      notifications: {
        ...(data.notifications || { email: false, sms: false, push: false }),
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Preferences</h3>
      
      <div className="space-y-4">
        <h4 className="font-medium">Notification Preferences</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Email Notifications</span>
            <input
              type="checkbox"
              checked={data.notifications?.email || false}
              onChange={(e) => updateNotifications('email', e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>SMS Notifications</span>
            <input
              type="checkbox"
              checked={data.notifications?.sms || false}
              onChange={(e) => updateNotifications('sms', e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Push Notifications</span>
            <input
              type="checkbox"
              checked={data.notifications?.push || false}
              onChange={(e) => updateNotifications('push', e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <Select
            value={data.language || 'en'}
            onValueChange={(value) => onUpdate({ language: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Timezone</label>
          <Select
            value={data.timezone || 'UTC'}
            onValueChange={(value) => onUpdate({ timezone: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="Africa/Casablanca">Morocco Time</SelectItem>
              <SelectItem value="Europe/Paris">Central European Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
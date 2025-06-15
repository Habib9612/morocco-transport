'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Mail, User, Building, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

// Step 1: Basic Information
interface BasicInfoData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Step 2: Account Security
interface SecurityData {
  password: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  securityQuestion: string;
  securityAnswer: string;
}

// Step 3: Role & Profile
interface RoleData {
  role: 'individual' | 'carrier' | 'company';
  companyName?: string;
  businessType?: string;
  licenseNumber?: string;
  vehicleCount?: number;
  serviceAreas?: string[];
}

// Step 4: Verification
interface VerificationData {
  emailVerified: boolean;
  phoneVerified: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingOptIn: boolean;
}

interface SignupData extends BasicInfoData, SecurityData, RoleData, VerificationData {}

const SIGNUP_STEPS = [
  { id: 1, title: 'Basic Information', icon: User },
  { id: 2, title: 'Account Security', icon: Shield },
  { id: 3, title: 'Role & Profile', icon: Building },
  { id: 4, title: 'Verification', icon: CheckCircle },
];

export function EnhancedMultiStepSignup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [signupData, setSignupData] = useState<Partial<SignupData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signup } = useAuth();
  const router = useRouter();

  const progress = (currentStep / SIGNUP_STEPS.length) * 100;

  const updateData = (stepData: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...stepData }));
    setErrors({});
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!signupData.firstName) newErrors.firstName = 'First name is required';
        if (!signupData.lastName) newErrors.lastName = 'Last name is required';
        if (!signupData.email) newErrors.email = 'Email is required';
        if (!signupData.phone) newErrors.phone = 'Phone number is required';
        break;
      case 2:
        if (!signupData.password) newErrors.password = 'Password is required';
        if (signupData.password && signupData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        if (signupData.password !== signupData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
      case 3:
        if (!signupData.role) newErrors.role = 'Please select a role';
        if (signupData.role === 'company' && !signupData.companyName) {
          newErrors.companyName = 'Company name is required';
        }
        break;
      case 4:
        if (!signupData.termsAccepted) newErrors.terms = 'You must accept the terms';
        if (!signupData.privacyAccepted) newErrors.privacy = 'You must accept the privacy policy';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, SIGNUP_STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      await signup(signupData);
      router.push('/email-verification');
    } catch (error) {
      setErrors({ submit: 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep data={signupData} onUpdate={updateData} errors={errors} />;
      case 2:
        return <SecurityStep data={signupData} onUpdate={updateData} errors={errors} />;
      case 3:
        return <RoleProfileStep data={signupData} onUpdate={updateData} errors={errors} />;
      case 4:
        return <VerificationStep data={signupData} onUpdate={updateData} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create Your MarocTransit Account
          </CardTitle>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between">
              {SIGNUP_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center space-y-2 ${
                      currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200'
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
            
            {currentStep === SIGNUP_STEPS.length ? (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
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
function BasicInformationStep({ 
  data, 
  onUpdate, 
  errors 
}: { 
  data: Partial<SignupData>;
  onUpdate: (data: Partial<SignupData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="First Name"
            value={data.firstName || ''}
            onChange={(e) => onUpdate({ firstName: e.target.value })}
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <Input
            placeholder="Last Name"
            value={data.lastName || ''}
            onChange={(e) => onUpdate({ lastName: e.target.value })}
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>
      <div>
        <Input
          type="email"
          placeholder="Email Address"
          value={data.email || ''}
          onChange={(e) => onUpdate({ email: e.target.value })}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <Input
          type="tel"
          placeholder="Phone Number"
          value={data.phone || ''}
          onChange={(e) => onUpdate({ phone: e.target.value })}
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>
    </div>
  );
}

function SecurityStep({ 
  data, 
  onUpdate, 
  errors 
}: { 
  data: Partial<SignupData>;
  onUpdate: (data: Partial<SignupData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Account Security</h3>
      <div>
        <Input
          type="password"
          placeholder="Password (min 8 characters)"
          value={data.password || ''}
          onChange={(e) => onUpdate({ password: e.target.value })}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <div>
        <Input
          type="password"
          placeholder="Confirm Password"
          value={data.confirmPassword || ''}
          onChange={(e) => onUpdate({ confirmPassword: e.target.value })}
          className={errors.confirmPassword ? 'border-red-500' : ''}
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="twoFactor"
          checked={data.twoFactorEnabled || false}
          onChange={(e) => onUpdate({ twoFactorEnabled: e.target.checked })}
        />
        <label htmlFor="twoFactor" className="text-sm">
          Enable Two-Factor Authentication (Recommended)
        </label>
      </div>
    </div>
  );
}

function RoleProfileStep({ 
  data, 
  onUpdate, 
  errors 
}: { 
  data: Partial<SignupData>;
  onUpdate: (data: Partial<SignupData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Role & Profile</h3>
      <div>
        <Select
          value={data.role || ''}
          onValueChange={(value) => onUpdate({ role: value as 'individual' | 'carrier' | 'company' })}
        >
          <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Individual Shipper</SelectItem>
            <SelectItem value="carrier">Carrier</SelectItem>
            <SelectItem value="company">Company/Fleet Manager</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
      </div>
      
      {data.role === 'company' && (
        <>
          <div>
            <Input
              placeholder="Company Name"
              value={data.companyName || ''}
              onChange={(e) => onUpdate({ companyName: e.target.value })}
              className={errors.companyName ? 'border-red-500' : ''}
            />
            {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
          </div>
          <div>
            <Input
              placeholder="Business License Number"
              value={data.licenseNumber || ''}
              onChange={(e) => onUpdate({ licenseNumber: e.target.value })}
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Number of Vehicles"
              value={data.vehicleCount || ''}
              onChange={(e) => onUpdate({ vehicleCount: parseInt(e.target.value) })}
            />
          </div>
        </>
      )}
    </div>
  );
}

function VerificationStep({ 
  data, 
  onUpdate, 
  errors 
}: { 
  data: Partial<SignupData>;
  onUpdate: (data: Partial<SignupData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Terms & Verification</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={data.termsAccepted || false}
            onChange={(e) => onUpdate({ termsAccepted: e.target.checked })}
          />
          <label htmlFor="terms" className="text-sm">
            I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
          </label>
        </div>
        {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="privacy"
            checked={data.privacyAccepted || false}
            onChange={(e) => onUpdate({ privacyAccepted: e.target.checked })}
          />
          <label htmlFor="privacy" className="text-sm">
            I agree to the <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
          </label>
        </div>
        {errors.privacy && <p className="text-red-500 text-sm">{errors.privacy}</p>}
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="marketing"
            checked={data.marketingOptIn || false}
            onChange={(e) => onUpdate({ marketingOptIn: e.target.checked })}
          />
          <label htmlFor="marketing" className="text-sm">
            I would like to receive updates and promotional emails
          </label>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 text-blue-700">
          <Mail size={16} />
          <span className="font-medium">Email Verification Required</span>
        </div>
        <p className="text-sm text-blue-600 mt-1">
          We'll send a verification link to {data.email} after account creation.
        </p>
      </div>
    </div>
  );
}
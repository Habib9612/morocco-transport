'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, Shield, Chrome, Facebook, Smartphone } from 'lucide-react';
import Link from 'next/link';

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
  twoFactorCode?: string;
}

export function EnhancedLoginForm() {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }

    if (showTwoFactor && !loginData.twoFactorCode) {
      newErrors.twoFactorCode = '2FA code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.requiresTwoFactor && !showTwoFactor) {
          setShowTwoFactor(true);
        } else {
          // Successful login
          if (loginData.rememberMe) {
            localStorage.setItem('rememberUser', loginData.email);
          }
          router.push('/dashboard');
        }
      } else {
        setErrors({ submit: result.message || 'Login failed' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    
    try {
      // TODO: Replace with actual social login implementation
      const response = await fetch(`/api/auth/social/${provider}`, {
        method: 'POST',
      });

      if (response.ok) {
        const { redirectUrl } = await response.json();
        window.location.href = redirectUrl;
      } else {
        setErrors({ submit: `${provider} login failed` });
      }
    } catch (error) {
      setErrors({ submit: 'Social login failed. Please try again.' });
    } finally {
      setSocialLoading(null);
    }
  };

  const updateField = (field: keyof LoginData, value: string | boolean) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (showTwoFactor) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center space-x-2">
            <Shield className="w-6 h-6" />
            <span>Two-Factor Authentication</span>
          </CardTitle>
          <p className="text-center text-gray-600">
            Enter the 6-digit code from your authenticator app
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={loginData.twoFactorCode || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  updateField('twoFactorCode', value);
                }}
                className={`text-center text-lg tracking-widest ${errors.twoFactorCode ? 'border-red-500' : ''}`}
                maxLength={6}
              />
              {errors.twoFactorCode && (
                <p className="text-red-500 text-sm mt-1">{errors.twoFactorCode}</p>
              )}
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm text-center">{errors.submit}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || (loginData.twoFactorCode?.length || 0) !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setShowTwoFactor(false)}
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Welcome Back
        </CardTitle>
        <p className="text-center text-gray-600">
          Sign in to your MarocTransit account
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Social Login Options */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
            onClick={() => handleSocialLogin('google')}
            disabled={socialLoading === 'google'}
          >
            <Chrome className="w-5 h-5" />
            <span>
              {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
            </span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
            onClick={() => handleSocialLogin('facebook')}
            disabled={socialLoading === 'facebook'}
          >
            <Facebook className="w-5 h-5" />
            <span>
              {socialLoading === 'facebook' ? 'Connecting...' : 'Continue with Facebook'}
            </span>
          </Button>
        </div>

        <div className="relative">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-2 text-sm text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Email/Password Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Email address"
                value={loginData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => updateField('password', e.target.value)}
                className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={loginData.rememberMe}
                onChange={(e) => updateField('rememberMe', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </Link>
          </div>

          {errors.submit && (
            <p className="text-red-500 text-sm text-center">{errors.submit}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-800 font-medium">Secure Login</p>
              <p className="text-blue-600">
                Your data is protected with industry-standard encryption.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
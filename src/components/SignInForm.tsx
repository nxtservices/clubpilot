'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignInData } from '@/types/auth';

export function SignInForm() {
  const router = useRouter();
  const { signIn, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<SignInData>({
    email: '',
    password: '',
  });
  const [validationError, setValidationError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.email) {
      setValidationError('E-mailadres is verplicht');
      return false;
    }
    if (!formData.password) {
      setValidationError('Wachtwoord is verplicht');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) {
      return;
    }

    try {
      await signIn(formData);
      router.push('/cockpit');
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">ClubPilot</h1>
          <p className="text-gray-600">De slimme cockpit voor je vereniging</p>
        </div>

        {/* Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Aanmelden</CardTitle>
            <CardDescription>Meld je aan met je e-mailadres en wachtwoord</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {displayError && (
              <Alert variant="error">{displayError}</Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                id="email"
                name="email"
                label="E-mailadres"
                placeholder="jij@voorbeeld.nl"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />

              <Input
                type="password"
                id="password"
                name="password"
                label="Wachtwoord"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />

              <Button
                type="submit"
                disabled={loading}
                isLoading={loading}
                size="lg"
                className="w-full"
              >
                {loading ? 'Bezig met aanmelden...' : 'Aanmelden'}
              </Button>
            </form>
          </CardContent>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <p className="text-center text-sm text-gray-600">
              Nog geen account?{' '}
              <Link href="/signup" className="font-semibold text-brand-primary hover:underline">
                Account aanmaken
              </Link>
            </p>
          </div>
        </Card>

        {/* Help text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Problemen met inloggen?{' '}
          <button className="text-brand-primary hover:underline font-medium">
            Neem contact op
          </button>
        </p>
      </div>
    </div>
  );
}

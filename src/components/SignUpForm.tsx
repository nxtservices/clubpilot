'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignUpData } from '@/types/auth';

export function SignUpForm() {
  const router = useRouter();
  const { signUp, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    fullName: '',
  });
  const [validationError, setValidationError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.fullName) {
      setValidationError('Volledige naam is verplicht');
      return false;
    }
    if (!formData.email) {
      setValidationError('E-mailadres is verplicht');
      return false;
    }
    if (!formData.password) {
      setValidationError('Wachtwoord is verplicht');
      return false;
    }
    if (formData.password.length < 6) {
      setValidationError('Wachtwoord moet minimaal 6 tekens zijn');
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
      await signUp(formData);
      router.push('/onboarding');
    } catch (err) {
      console.error('Sign up error:', err);
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
            <CardTitle className="text-2xl">Account aanmaken</CardTitle>
            <CardDescription>Maak een nieuw ClubPilot account aan</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {displayError && (
              <Alert variant="error">{displayError}</Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                id="fullName"
                name="fullName"
                label="Volledige naam"
                placeholder="Jan de Vries"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                required
              />

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
                hint="Minimaal 6 tekens"
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
                {loading ? 'Account aanmaken...' : 'Account aanmaken'}
              </Button>
            </form>
          </CardContent>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <p className="text-center text-sm text-gray-600">
              Al een account?{' '}
              <Link href="/signin" className="font-semibold text-brand-primary hover:underline">
                Aanmelden
              </Link>
            </p>
          </div>
        </Card>

        {/* Privacy note */}
        <p className="text-center text-xs text-gray-500 mt-6 px-4">
          Door een account aan te maken ga je akkoord met onze{' '}
          <button className="text-brand-primary hover:underline">gebruiksvoorwaarden</button>
        </p>
      </div>
    </div>
  );
}

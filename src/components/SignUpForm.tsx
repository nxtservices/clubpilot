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
import { ArrowRight } from 'lucide-react';

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
      <div className="w-full max-w-md animate-slide-in">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-brand-primary rounded-lg flex items-center justify-center">
              <div className="text-white font-bold text-3xl">CP</div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-navy bg-clip-text text-transparent mb-1">
            ClubPilot
          </h1>
          <p className="text-gray-600 font-medium">De slimme cockpit voor je vereniging</p>
        </div>

        {/* Card */}
        <Card className="border-2 border-brand-border">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-2xl">Account aanmaken</CardTitle>
            <CardDescription>Registreer je en begin meteen met ClubPilot</CardDescription>
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
                className="w-full gap-2"
              >
                {loading ? 'Account aanmaken...' : 'Account aanmaken'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>
          </CardContent>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-brand-border bg-brand-light rounded-b-xl">
            <p className="text-center text-sm text-brand-navy">
              Al een account?{' '}
              <Link href="/signin" className="font-semibold text-brand-primary hover:text-blue-700 transition">
                Aanmelden
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

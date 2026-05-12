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
import { ArrowRight } from 'lucide-react';

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
            <CardTitle className="text-2xl">Welkom terug</CardTitle>
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

              <div>
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
                <button 
                  type="button"
                  className="text-xs text-brand-primary font-medium hover:underline mt-2"
                >
                  Wachtwoord vergeten?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                isLoading={loading}
                size="lg"
                className="w-full gap-2"
              >
                {loading ? 'Bezig met aanmelden...' : 'Aanmelden'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>
          </CardContent>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-brand-border bg-brand-light rounded-b-xl">
            <p className="text-center text-sm text-brand-navy">
              Nog geen account?{' '}
              <Link href="/signup" className="font-semibold text-brand-primary hover:text-blue-700 transition">
                Account aanmaken
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
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
    if (!formData.fullName) {
      setValidationError('Volledige naam is verplicht');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">ClubPilot</h1>
          <p className="text-gray-600 text-sm">De slimme cockpit voor je vereniging</p>
        </div>

        <h2 className="text-2xl font-semibold text-brand-dark mb-6">Account aanmaken</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {displayError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {displayError}
            </div>
          )}

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Volledige naam
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
              placeholder="Jan de Vries"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mailadres
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
              placeholder="jan@voorbeeld.nl"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Wachtwoord
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
              placeholder="Minimaal 6 tekens"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Account aanmaken...' : 'Account aanmaken'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Al een account?{' '}
          <Link href="/signin" className="text-brand-primary hover:underline font-semibold">
            Aanmelden
          </Link>
        </p>
      </div>
    </div>
  );
}

'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function OnboardingPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-brand-dark mb-2">Welkom, {user?.email}!</h1>
          <p className="text-xl text-gray-600 mb-8">Laten we je ClubPilot account instellen.</p>

          <div className="grid gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-brand-dark mb-3">1. Organisatie maken</h2>
              <p className="text-gray-600 mb-4">
                Maak je eerste organisatie/vereniging aan waarvan je lid bent.
              </p>
              <Link
                href="/onboarding/organization"
                className="inline-block bg-brand-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Volgende →
              </Link>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-md p-6 opacity-50">
              <h2 className="text-xl font-semibold text-gray-400 mb-3">2. Profiel voltooien</h2>
              <p className="text-gray-400 mb-4">(Beschikbaar na stap 1)</p>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-md p-6 opacity-50">
              <h2 className="text-xl font-semibold text-gray-400 mb-3">3. Team setup</h2>
              <p className="text-gray-400 mb-4">(Beschikbaar na stap 2)</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/signin"
              className="text-gray-600 hover:text-gray-900 underline text-sm"
            >
              Terug naar aanmelden
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

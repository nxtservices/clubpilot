'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useTenant } from '@/lib/tenant-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OnboardingPage() {
  const { activeTenant } = useTenant();
  const router = useRouter();

  // If user already has a tenant, redirect to cockpit
  useEffect(() => {
    if (activeTenant) {
      router.push('/cockpit');
    }
  }, [activeTenant, router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-brand-dark mb-2">Welkom bij ClubPilot!</h1>
          <p className="text-xl text-gray-600 mb-8">Laten we je account instellen.</p>

          <div className="grid gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-brand-primary">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-brand-primary text-white font-bold">
                  1
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-brand-dark">Organisatie aanmaken</h2>
                  <p className="text-gray-600 mt-2 mb-4">
                    Maak je eerste organisatie of vereniging aan. Dit kan later gewijzigd worden.
                  </p>
                  <Link
                    href="/onboarding/create-organization"
                    className="inline-block bg-brand-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                  >
                    Organisatie aanmaken
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-md p-6 border-l-4 border-gray-300 opacity-50">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-gray-300 text-white font-bold">
                  2
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-600">Profiel aanvullen</h2>
                  <p className="text-gray-500 mt-2">(Beschikbaar na stap 1)</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-md p-6 border-l-4 border-gray-300 opacity-50">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-gray-300 text-white font-bold">
                  3
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-600">Starten met ClubPilot</h2>
                  <p className="text-gray-500 mt-2">(Beschikbaar na stap 2)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Tip:</strong> Je kunt later meer organisaties toevoegen en tussen ze schakelen vanuit de zijbalk.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

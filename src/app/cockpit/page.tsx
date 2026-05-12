'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function CockpitPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-brand-dark">Cockpit</h1>
              <p className="text-gray-600">Welkom terug, {user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Afmelden
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-brand-dark mb-2">Mijn taken</h3>
              <p className="text-gray-600">Geen taken toegewezen</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-brand-dark mb-2">Aankomende events</h3>
              <p className="text-gray-600">Geen aankomende events</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-brand-dark mb-2">Smart signals</h3>
              <p className="text-gray-600">Alles in orde</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/onboarding"
              className="text-gray-600 hover:text-gray-900 underline text-sm"
            >
              Terug naar onboarding
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

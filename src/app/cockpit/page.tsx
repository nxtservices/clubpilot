'use client';

import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@/lib/auth-context';

export default function CockpitPage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div>
        <h1 className="text-4xl font-bold text-brand-dark mb-2">Cockpit</h1>
        <p className="text-gray-600 mb-8">Welkom terug, {user?.email}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Smart Signals Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-brand-dark">Smart Signals</h3>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">2</span>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm font-medium text-yellow-900">Shift onderbezet</p>
                <p className="text-xs text-yellow-700 mt-1">Zaterdag kantinedienst</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                <p className="text-sm font-medium text-orange-900">Taak vervallen</p>
                <p className="text-xs text-orange-700 mt-1">Uitnodigingen versturen</p>
              </div>
            </div>
          </div>

          {/* My Tasks Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-brand-dark mb-4">Mijn Taken</h3>
            <p className="text-gray-600 text-sm">Geen taken toegewezen</p>
          </div>

          {/* My Shifts Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-brand-dark mb-4">Mijn Vrijwilligerswerk</h3>
            <p className="text-gray-600 text-sm">Geen aanmeldingen</p>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-brand-dark mb-4">Aankomende Events</h3>
            <p className="text-gray-600 text-sm">Geen aankomende events</p>
          </div>

          {/* Voting Rounds */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-brand-dark mb-4">Stemmingen</h3>
            <p className="text-gray-600 text-sm">Geen actieve stemmingen</p>
          </div>

          {/* Recent Decisions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-brand-dark mb-4">Recente Besluiten</h3>
            <p className="text-gray-600 text-sm">Geen besluiten</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

'use client';

import { AppLayout } from '@/components/AppLayout';
import { Users } from 'lucide-react';

export default function VrijwilligersPage() {
  return (
    <AppLayout>
      <div>
        <h1 className="text-4xl font-bold text-brand-dark mb-2">Vrijwilligers</h1>
        <p className="text-gray-600 mb-8">Beheer je vrijwilligers, taken en shifts</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-brand-dark mb-4">Taken</h2>
            <p className="text-gray-500 text-sm">Geen taken</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-brand-dark mb-4">Mijn Shifts</h2>
            <p className="text-gray-500 text-sm">Geen shifts</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-brand-dark mb-4">Intake Formulier</h2>
            <p className="text-gray-500 text-sm">Voltooid je vrijwilligers profiel</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-brand-dark mb-4">Punten</h2>
            <p className="text-gray-500 text-sm">Je vrijwilligers punten overview</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

'use client';

import { AppLayout } from '@/components/AppLayout';
import { Settings } from 'lucide-react';

export default function InstellingenPage() {
  return (
    <AppLayout>
      <div>
        <h1 className="text-4xl font-bold text-brand-dark mb-2">Instellingen</h1>
        <p className="text-gray-600 mb-8">Beheer je instellingen en voorkeuren</p>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-brand-dark mb-4">Profiel</h2>
            <p className="text-gray-500 text-sm">Profielinstellingen</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-brand-dark mb-4">Organisatie</h2>
            <p className="text-gray-500 text-sm">Organisatie instellingen</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-brand-dark mb-4">Notificaties</h2>
            <p className="text-gray-500 text-sm">Notificatie voorkeuren</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

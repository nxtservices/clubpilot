'use client';

import { AppLayout } from '@/components/AppLayout';
import { Users2 } from 'lucide-react';

export default function TeamsPage() {
  return (
    <AppLayout>
      <div>
        <h1 className="text-4xl font-bold text-brand-dark mb-2">Teams</h1>
        <p className="text-gray-600 mb-8">Organiseer je teams en teamleden</p>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Users2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Geen teams</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

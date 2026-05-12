'use client';

import { AppLayout } from '@/components/AppLayout';
import { CheckSquare } from 'lucide-react';

export default function TakenPage() {
  return (
    <AppLayout>
      <div>
        <h1 className="text-4xl font-bold text-brand-dark mb-2">Taken</h1>
        <p className="text-gray-600 mb-8">Beheer taken en checklists</p>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Geen taken</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

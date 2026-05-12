'use client';

import { AppLayout } from '@/components/AppLayout';
import { FileText } from 'lucide-react';

export default function DocumentenPage() {
  return (
    <AppLayout>
      <div>
        <h1 className="text-4xl font-bold text-brand-dark mb-2">Documenten</h1>
        <p className="text-gray-600 mb-8">Deel en beheer documenten</p>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Geen documenten</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

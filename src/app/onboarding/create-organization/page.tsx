'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CreateOrganizationForm } from '@/components/CreateOrganizationForm';

export default function CreateOrganizationPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-8">
        <div className="max-w-2xl mx-auto">
          <CreateOrganizationForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}

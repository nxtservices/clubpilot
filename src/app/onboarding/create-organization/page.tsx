'use client';

import { AppLayout } from '@/components/AppLayout';
import { CreateOrganizationForm } from '@/components/CreateOrganizationForm';
import { useTenant } from '@/lib/tenant-context';
import Link from 'next/link';

export default function CreateOrganizationPage() {
  const { activeTenant } = useTenant();

  return (
    <AppLayout>
      <div className="max-w-2xl">
        {activeTenant && (
          <div className="mb-6">
            <Link
              href="/cockpit"
              className="text-brand-primary hover:underline text-sm"
            >
              ← Terug naar Cockpit
            </Link>
          </div>
        )}
        <CreateOrganizationForm />
      </div>
    </AppLayout>
  );
}

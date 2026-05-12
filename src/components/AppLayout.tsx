'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-brand-light">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

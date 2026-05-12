'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/lib/tenant-context';
import { ChevronDown, Plus } from 'lucide-react';

export function TenantSelector() {
  const { activeTenant, tenants, setActiveTenant, loading } = useTenant();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className="p-4 border-b border-gray-200">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!activeTenant && tenants.length === 0) {
    return (
      <div className="p-4 border-b border-gray-200">
        <Link
          href="/onboarding"
          className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Organisatie maken</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm font-medium text-gray-900"
        >
          <div className="text-left">
            <p className="text-xs text-gray-500 mb-1">Actieve organisatie</p>
            <p className="text-sm font-semibold text-gray-900">{activeTenant?.name || 'Geen selectie'}</p>
          </div>
          <ChevronDown className={`w-4 h-4 transition ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
            {tenants.length > 0 && (
              <div className="py-2">
                {tenants.map((tenant) => (
                  <button
                    key={tenant.id}
                    onClick={() => {
                      setActiveTenant(tenant);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition ${
                      activeTenant?.id === tenant.id
                        ? 'bg-brand-primary text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium">{tenant.name}</p>
                    <p className={`text-xs ${activeTenant?.id === tenant.id ? 'text-blue-100' : 'text-gray-500'}`}>
                      {tenant.slug}
                    </p>
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-gray-200 py-2">
              <Link
                href="/onboarding/create-organization"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Nieuwe organisatie</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

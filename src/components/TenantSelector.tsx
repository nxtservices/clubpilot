'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/lib/tenant-context';
import { ChevronDown, Plus, Building2 } from 'lucide-react';

export function TenantSelector() {
  const { activeTenant, tenants, setActiveTenant, loading } = useTenant();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className="p-4 border-b border-brand-border">
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!activeTenant && tenants.length === 0) {
    return (
      <div className="p-4 border-b border-brand-border bg-brand-light">
        <Link
          href="/onboarding"
          className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-brand-primary text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-medium text-sm shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Organisatie aanmaken</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-brand-border bg-brand-light">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-brand-border rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all text-sm font-medium text-brand-navy shadow-sm"
        >
          <div className="flex items-center gap-2 text-left min-w-0">
            <Building2 className="w-4 h-4 flex-shrink-0 text-brand-primary" />
            <div className="min-w-0">
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Organisatie</p>
              <p className="text-sm font-semibold text-brand-navy truncate">{activeTenant?.name || 'Geen selectie'}</p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-brand-border rounded-lg shadow-lg z-20 overflow-hidden">
            {tenants.length > 0 && (
              <div className="py-1">
                {tenants.map((tenant) => (
                  <button
                    key={tenant.id}
                    onClick={() => {
                      setActiveTenant(tenant);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeTenant?.id === tenant.id
                        ? 'bg-brand-primary text-white'
                        : 'text-brand-navy hover:bg-brand-light'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 opacity-60" />
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className={`text-xs ${activeTenant?.id === tenant.id ? 'text-blue-100' : 'text-gray-600'}`}>
                          {tenant.slug}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-brand-border py-1">
              <Link
                href="/onboarding/create-organization"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 text-sm text-brand-navy hover:bg-brand-light transition-colors font-medium"
              >
                <Plus className="w-4 h-4 text-brand-primary" />
                <span>Nieuwe organisatie</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

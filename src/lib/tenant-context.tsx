'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Tenant, getUserTenants } from '@/lib/tenant-service';

type TenantContextType = {
  activeTenant: Tenant | null;
  tenants: Tenant[];
  loading: boolean;
  error: string | null;
  setActiveTenant: (tenant: Tenant) => void;
  refreshTenants: () => Promise<void>;
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tenants when user logs in
  useEffect(() => {
    if (!user) {
      setTenants([]);
      setActiveTenant(null);
      setLoading(false);
      return;
    }

    const loadTenants = async () => {
      try {
        setLoading(true);
        setError(null);
        const userTenants = await getUserTenants(user.id);
        setTenants(userTenants);

        // Set first tenant as active if available
        if (userTenants.length > 0) {
          // Try to restore from localStorage
          const savedTenantId = localStorage.getItem('activeTenantId');
          const savedTenant = userTenants.find((t) => t.id === savedTenantId);
          setActiveTenant(savedTenant || userTenants[0]);
        } else {
          setActiveTenant(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load tenants';
        setError(errorMessage);
        console.error('Tenant loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTenants();
  }, [user]);

  const handleSetActiveTenant = (tenant: Tenant) => {
    setActiveTenant(tenant);
    localStorage.setItem('activeTenantId', tenant.id);
  };

  const refreshTenants = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userTenants = await getUserTenants(user.id);
      setTenants(userTenants);

      // If active tenant no longer exists, switch to first available
      if (activeTenant && !userTenants.find((t) => t.id === activeTenant.id)) {
        setActiveTenant(userTenants.length > 0 ? userTenants[0] : null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh tenants';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TenantContext.Provider
      value={{
        activeTenant,
        tenants,
        loading,
        error,
        setActiveTenant: handleSetActiveTenant,
        refreshTenants,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}

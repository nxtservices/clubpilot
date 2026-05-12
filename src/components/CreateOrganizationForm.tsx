'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTenant } from '@/lib/tenant-context';
import { createTenant, addTenantMember } from '@/lib/tenant-service';
import { supabase } from '@/lib/supabase';

export function CreateOrganizationForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshTenants } = useTenant();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from name
    if (name === 'name') {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Organisatienaam is verplicht');
      return;
    }

    if (!formData.slug.trim()) {
      setError('URL-slug is verplicht');
      return;
    }

    if (!user) {
      setError('Niet ingelogd');
      return;
    }

    try {
      setLoading(true);

      // Create tenant
      const tenant = await createTenant({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
      });

      // Create admin role for this tenant
      const { data: role, error: roleError } = await supabase
        .from('roles')
        .insert([
          {
            tenant_id: tenant.id,
            name: 'Beheerder',
            description: 'Beheerder van de organisatie',
            is_admin: true,
          },
        ])
        .select()
        .single();

      if (roleError) throw roleError;
      if (!role) throw new Error('Rol aanmaken mislukt');

      // Add user as tenant member with admin role
      await addTenantMember(tenant.id, user.id, role.id);

      // Refresh tenant context
      await refreshTenants();

      // Redirect to cockpit
      router.push('/cockpit');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Fout bij aanmaken organisatie';
      setError(errorMessage);
      console.error('Create organization error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold text-brand-dark mb-2">Organisatie aanmaken</h1>
      <p className="text-gray-600 mb-8">Maak je eerste organisatie/vereniging aan</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Organisatienaam *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            placeholder="Bijvoorbeeld: Voetbalclub Ajax"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Dit is de naam van je organisatie of vereniging</p>
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            URL-slug *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            disabled={loading}
            placeholder="voetbalclub-ajax"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition text-sm"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Dit wordt gebruikt in URLs. Alleen letters, nummers en streepjes.
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Beschrijving
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            placeholder="Optionele beschrijving van je organisatie..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-brand-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Bezig met aanmaken...' : 'Organisatie aanmaken'}
          </button>
        </div>
      </form>
    </div>
  );
}

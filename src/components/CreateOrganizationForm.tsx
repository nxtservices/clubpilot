'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTenant } from '@/lib/tenant-context';
import { createTenant, addTenantMember } from '@/lib/tenant-service';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Organisatie aanmaken</CardTitle>
        <CardDescription>
          Maak je eerste organisatie of vereniging aan
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="error">{error}</Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            id="name"
            name="name"
            label="Organisatienaam *"
            placeholder="Bijvoorbeeld: Voetbalclub De Favaart"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            hint="Dit is de naam van je organisatie of vereniging"
            required
          />

          <Input
            type="text"
            id="slug"
            name="slug"
            label="URL-slug *"
            placeholder="de-favaart"
            value={formData.slug}
            onChange={handleChange}
            disabled={loading}
            hint="Dit wordt gebruikt in URLs. Alleen letters, nummers en streepjes."
            required
          />

          <TextArea
            id="description"
            name="description"
            label="Beschrijving"
            placeholder="Optionele beschrijving van je organisatie..."
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            hint="Optioneel. Dit helpt je organisatie te identificeren."
          />

          <Button
            type="submit"
            disabled={loading}
            isLoading={loading}
            size="lg"
            className="w-full"
          >
            Organisatie aanmaken
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

import { supabase } from '@/lib/supabase';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TenantMembership {
  id: string;
  tenant_id: string;
  user_id: string;
  role_id: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

// Create a new tenant
export async function createTenant(data: {
  name: string;
  slug: string;
  description?: string;
}): Promise<Tenant> {
  const { data: tenant, error } = await supabase
    .from('tenants')
    .insert([
      {
        name: data.name,
        slug: data.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        description: data.description || null,
        logo_url: null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return tenant;
}

// Get user's tenants
export async function getUserTenants(userId: string): Promise<Tenant[]> {
  const { data: memberships, error: membershipError } = await supabase
    .from('tenant_memberships')
    .select('tenant_id')
    .eq('user_id', userId)
    .eq('status', 'active');

  if (membershipError) throw membershipError;

  if (!memberships || memberships.length === 0) {
    return [];
  }

  const tenantIds = memberships.map((m) => m.tenant_id);

  const { data: tenants, error: tenantError } = await supabase
    .from('tenants')
    .select()
    .in('id', tenantIds);

  if (tenantError) throw tenantError;
  return tenants || [];
}

// Get single tenant
export async function getTenant(tenantId: string): Promise<Tenant> {
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select()
    .eq('id', tenantId)
    .single();

  if (error) throw error;
  return tenant;
}

// Update tenant
export async function updateTenant(
  tenantId: string,
  data: Partial<Pick<Tenant, 'name' | 'description' | 'logo_url'>>
): Promise<Tenant> {
  const { data: updated, error } = await supabase
    .from('tenants')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', tenantId)
    .select()
    .single();

  if (error) throw error;
  return updated;
}

// Add user to tenant (membership)
export async function addTenantMember(
  tenantId: string,
  userId: string,
  roleId: string
): Promise<TenantMembership> {
  const { data: membership, error } = await supabase
    .from('tenant_memberships')
    .insert([
      {
        tenant_id: tenantId,
        user_id: userId,
        role_id: roleId,
        status: 'active',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return membership;
}

// Get tenant members
export async function getTenantMembers(tenantId: string) {
  const { data: memberships, error } = await supabase
    .from('tenant_memberships')
    .select('*, profiles(full_name, email)')
    .eq('tenant_id', tenantId)
    .eq('status', 'active');

  if (error) throw error;
  return memberships || [];
}

// Get tenant membership for user
export async function getTenantMembership(
  tenantId: string,
  userId: string
): Promise<TenantMembership | null> {
  const { data: membership, error } = await supabase
    .from('tenant_memberships')
    .select()
    .eq('tenant_id', tenantId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return membership || null;
}

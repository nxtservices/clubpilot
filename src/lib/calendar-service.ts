import { supabase } from '@/lib/supabase';
import { CalendarEvent, CreateEventData, UpdateEventData, EventFilter } from '@/types/calendar';

export const calendarService = {
  // Create event
  async createEvent(tenantId: string, data: CreateEventData): Promise<CalendarEvent> {
    const { data: event, error } = await supabase
      .from('calendar_events')
      .insert([{
        tenant_id: tenantId,
        ...data,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      }])
      .select()
      .single();

    if (error) throw error;
    return event;
  },

  // Update event
  async updateEvent(eventId: string, data: Partial<CreateEventData>): Promise<CalendarEvent> {
    const { data: event, error } = await supabase
      .from('calendar_events')
      .update(data)
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw error;
    return event;
  },

  // Delete event
  async deleteEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
  },

  // Get single event
  async getEvent(eventId: string): Promise<CalendarEvent> {
    const { data: event, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) throw error;
    return event;
  },

  // Get tenant events with filters
  async getTenantEvents(tenantId: string, filters?: EventFilter): Promise<CalendarEvent[]> {
    let query = supabase
      .from('calendar_events')
      .select('*')
      .eq('tenant_id', tenantId);

    if (filters?.event_type) {
      query = query.eq('event_type', filters.event_type);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.visibility) {
      query = query.eq('visibility', filters.visibility);
    }

    if (filters?.needs_attention !== undefined) {
      query = query.eq('needs_attention', filters.needs_attention);
    }

    if (filters?.owner_user_id) {
      query = query.eq('owner_user_id', filters.owner_user_id);
    }

    if (filters?.start_date) {
      query = query.gte('starts_at', filters.start_date);
    }

    if (filters?.end_date) {
      query = query.lte('starts_at', filters.end_date);
    }

    const { data: events, error } = await query.order('starts_at', { ascending: true });

    if (error) throw error;
    return events || [];
  },

  // Get tenant events for date range
  async getTenantEventsByDateRange(
    tenantId: string,
    startDate: string,
    endDate: string,
  ): Promise<CalendarEvent[]> {
    const { data: events, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('starts_at', startDate)
      .lte('starts_at', endDate)
      .order('starts_at', { ascending: true });

    if (error) throw error;
    return events || [];
  },

  // Get events needing attention
  async getEventsNeedingAttention(tenantId: string): Promise<CalendarEvent[]> {
    const { data: events, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('needs_attention', true)
      .order('starts_at', { ascending: true });

    if (error) throw error;
    return events || [];
  },

  // Get upcoming events (next 7 days)
  async getUpcomingEvents(tenantId: string, limit = 5): Promise<CalendarEvent[]> {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { data: events, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('starts_at', now.toISOString())
      .lte('starts_at', weekFromNow.toISOString())
      .neq('status', 'cancelled')
      .order('starts_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return events || [];
  },

  // Flag events needing attention (smart logic)
  async flagEventNeedingAttention(eventId: string, reason: string): Promise<CalendarEvent> {
    return this.updateEvent(eventId, {
      needs_attention: true,
      attention_reason: reason,
      status: 'needs_attention',
    });
  },

  // Apply smart signals logic
  async applySmartSignals(tenantId: string): Promise<void> {
    const events = await this.getTenantEvents(tenantId);
    const now = new Date();

    for (const event of events) {
      const startsAt = new Date(event.starts_at);
      const hoursUntilStart = (startsAt.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Flag draft events starting within 48 hours
      if (event.status === 'draft' && hoursUntilStart > 0 && hoursUntilStart <= 48) {
        await this.flagEventNeedingAttention(
          event.id,
          'Concept event start binnen 48 uur',
        );
      }

      // Flag overdue task deadlines
      if (
        event.event_type === 'task_deadline' &&
        startsAt < now &&
        event.status !== 'completed'
      ) {
        await this.flagEventNeedingAttention(
          event.id,
          'Verlopen taakdeadline',
        );
      }
    }
  },
};
